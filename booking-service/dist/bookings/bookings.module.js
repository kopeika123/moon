"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsModule = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const booking_model_1 = require("./booking.model");
const bookings_service_1 = require("./bookings.service");
const bookings_consumer_1 = require("./bookings.consumer");
const table_allocation_checker_1 = require("./availability/table-allocation-checker");
const producer_1 = require("../kafka/producer");
const table_model_1 = require("./availability/table.model");
let BookingsModule = class BookingsModule {
};
exports.BookingsModule = BookingsModule;
exports.BookingsModule = BookingsModule = __decorate([
    (0, common_1.Module)({
        imports: [sequelize_1.SequelizeModule.forFeature([
                booking_model_1.Booking,
                table_model_1.RestaurantTable
            ])],
        providers: [
            bookings_service_1.BookingsService,
            bookings_consumer_1.BookingsConsumer,
            table_allocation_checker_1.TableAllocationChecker,
            producer_1.KafkaProducer
        ],
    })
], BookingsModule);
//# sourceMappingURL=bookings.module.js.map