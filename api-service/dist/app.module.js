"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sequelize_1 = require("@nestjs/sequelize");
const bookings_module_1 = require("./bookings/bookings.module");
const redis_module_1 = require("./cache/redis.module");
const booking_model_1 = require("./bookings/booking.model");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            sequelize_1.SequelizeModule.forRootAsync({
                useFactory: () => ({
                    dialect: 'postgres',
                    host: process.env.POSTGRES_HOST || 'localhost',
                    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
                    username: process.env.POSTGRES_USER || 'postgres',
                    password: String(process.env.POSTGRES_PASSWORD || 'postgres'),
                    database: process.env.POSTGRES_DB || 'bookings_db',
                    models: [booking_model_1.Booking],
                    autoLoadModels: true,
                    synchronize: true,
                    logging: false,
                })
            }),
            redis_module_1.RedisModule,
            bookings_module_1.BookingsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map