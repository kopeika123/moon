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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BookingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const booking_model_1 = require("./booking.model");
const redis_service_1 = require("../cache/redis.service");
const producer_1 = require("../kafka/producer");
let BookingsService = BookingsService_1 = class BookingsService {
    constructor(bookingModel, redis, kafka) {
        this.bookingModel = bookingModel;
        this.redis = redis;
        this.kafka = kafka;
        this.logger = new common_1.Logger(BookingsService_1.name);
    }
    async create(dto) {
        const booking = await this.bookingModel.create(dto);
        await this.redis.set(`booking:${booking.id}`, JSON.stringify(booking), 60);
        await this.emitBookingCreated(booking);
        return booking;
    }
    async emitBookingCreated(booking) {
        await this.kafka.emit(process.env.BOOKING_CREATED_TOPIC || 'booking.created', {
            bookingId: booking.id,
            restaurantId: booking.restaurantId,
            datetime: booking.datetime.toISOString(),
            durationMinutes: booking.durationMinutes,
            guests: booking.guests,
            tableNumber: booking.tableNumber,
            status: booking.status,
        });
        this.logger.log(`Emitted booking.created for booking ${booking.id}`);
    }
    async findOne(id) {
        const cached = await this.redis.get(`booking:${id}`);
        if (cached)
            return JSON.parse(cached);
        const booking = await this.bookingModel.findByPk(id);
        if (booking)
            await this.redis.set(`booking:${id}`, JSON.stringify(booking), 60);
        return booking;
    }
    async findAll() {
        return this.bookingModel.findAll();
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = BookingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(booking_model_1.Booking)),
    __metadata("design:paramtypes", [Object, redis_service_1.RedisService,
        producer_1.KafkaProducer])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map