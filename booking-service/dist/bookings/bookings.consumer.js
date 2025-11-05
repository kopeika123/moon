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
var BookingsConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsConsumer = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const bookings_service_1 = require("./bookings.service");
let BookingsConsumer = BookingsConsumer_1 = class BookingsConsumer {
    constructor(svc) {
        this.svc = svc;
        this.logger = new common_1.Logger(BookingsConsumer_1.name);
    }
    async handle(message, ctx) {
        try {
            this.logger.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
            const value = message.value ? JSON.parse(message.value.toString()) : message;
            this.logger.log('Received booking.created: ' + JSON.stringify(value));
            await this.svc.processBookingEvent(value);
        }
        catch (error) {
            console.log('error', error);
        }
    }
};
exports.BookingsConsumer = BookingsConsumer;
__decorate([
    (0, microservices_1.EventPattern)(process.env.BOOKING_CREATED_TOPIC || 'booking.created'),
    __param(0, (0, microservices_1.Payload)()),
    __param(1, (0, microservices_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microservices_1.KafkaContext]),
    __metadata("design:returntype", Promise)
], BookingsConsumer.prototype, "handle", null);
exports.BookingsConsumer = BookingsConsumer = BookingsConsumer_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsConsumer);
//# sourceMappingURL=bookings.consumer.js.map