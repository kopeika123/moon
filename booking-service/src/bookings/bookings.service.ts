import {Injectable, Logger} from '@nestjs/common';
import {Sequelize} from 'sequelize-typescript';
import {Booking} from './booking.model';
import {TableAllocationChecker} from './availability/table-allocation-checker';
import {RedisService} from '../cache/redis.service';
import {KafkaProducer} from '../kafka/producer';

@Injectable()
export class BookingsService {
    private readonly logger = new Logger(BookingsService.name);

    constructor(private readonly sequelize: Sequelize,
                private readonly checker: TableAllocationChecker,
                private readonly redis: RedisService,
                private readonly kafka: KafkaProducer) {
    }

    /**
     * Обработка события о бронировании, полученного из Kafka
     * @param event - объект события (например, booking.created)
     */
    async processBookingEvent(event: any) {
        const bookingId = event.bookingId; // Извлекаем ID бронирования из события
        const t = await this.sequelize.transaction(); // Начинаем транзакцию БД

        try {
            // Загружаем бронирование по ID с блокировкой строки (для избежания гонок)
            const booking = await Booking.findByPk(bookingId, {
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
            const tableNumber = await this.checker.allocate(
                booking.restaurantId,
                start,
                end,
                booking.id,
                booking.guests // Передаём количество гостей для правильного выбора столика
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
        } catch (err) {
            // В случае ошибки — откатываем транзакцию и логируем ошибку
            await t.rollback();
            this.logger.error('Error processing booking', err);
        }
    }
}
