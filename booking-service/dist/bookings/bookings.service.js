"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BookingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_typescript_1 = require("sequelize-typescript");
const booking_model_1 = require("./booking.model");
const table_allocation_checker_1 = require("./availability/table-allocation-checker");
const redis_service_1 = require("../cache/redis.service");
const producer_1 = require("../kafka/producer");
let BookingsService = BookingsService_1 = class BookingsService {
    constructor(sequelize, checker, redis, kafka) {
        this.sequelize = sequelize;
        this.checker = checker;
        this.redis = redis;
        this.kafka = kafka;
        this.logger = new common_1.Logger(BookingsService_1.name);
    }
    /**
     * Обработка события о бронировании, полученного из Kafka
     * @param event - объект события (например, booking.created)
     */
    async processBookingEvent(event) {
        const bookingId = event.bookingId; // Извлекаем ID бронирования из события
        const t = await this.sequelize.transaction(); // Начинаем транзакцию БД
        try {
            // Загружаем бронирование по ID с блокировкой строки (для избежания гонок)
            const booking = await booking_model_1.Booking.findByPk(bookingId, {
                transaction: t,
                lock: t.LOCK.UPDATE
            });
            if (!booking) {
                this.logger.warn('Booking not found: ' + bookingId);
                await t.rollback();
                return;
            }
            // Меняем статус на "проверяется доступность"
            booking.status = 'CHECKING_AVAILABILITY';
            await booking.save({ transaction: t });
            // Рассчитываем время начала и окончания брони
            const start = new Date(booking.datetime);
            const end = new Date(start.getTime() + (booking.durationMinutes || 90) * 60000);
            // Проверяем, можно ли выделить стол в указанное время
            const tableNumber = await this.checker.allocate(booking.restaurantId, start, end, booking.id, booking.guests // Передаём количество гостей для правильного выбора столика
            );
            console.log('tableNumber', tableNumber);
            // Если стол найден — подтверждаем бронь, иначе отклоняем
            booking.status = tableNumber ? 'CONFIRMED' : 'REJECTED';
            booking.tableNumber = tableNumber || null; // Сохраняем выделенный столик, если есть
            await booking.save({ transaction: t });
            // Отправляем обновлённое событие в Kafka
            await this.kafka.emit(process.env.BOOKING_UPDATED_TOPIC || 'booking.updated', {
                bookingId: booking.id,
                status: booking.status
            });
            // Кэшируем результат в Redis (на 60 секунд)
            await this.redis.set(`booking:${booking.id}`, JSON.stringify(booking), 60);
            // Фиксируем транзакцию
            await t.commit();
            this.logger.log(`Booking ${booking.id} -> ${booking.status}`);
        }
        catch (err) {
            // В случае ошибки — откатываем транзакцию и логируем ошибку
            await t.rollback();
            this.logger.error('Error processing booking', err);
        }
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = BookingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [sequelize_typescript_1.Sequelize,
        table_allocation_checker_1.TableAllocationChecker,
        redis_service_1.RedisService,
        producer_1.KafkaProducer])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map