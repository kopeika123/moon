import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {SequelizeModule} from '@nestjs/sequelize';
import {BookingsModule} from './bookings/bookings.module';
import {RedisModule} from './cache/redis.module';
import {Booking} from "./bookings/booking.model";
import {RestaurantTable} from "./bookings/availability/table.model";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true}),
        SequelizeModule.forRootAsync({
            useFactory: () => ({
                dialect: 'postgres',
                host: process.env.POSTGRES_HOST || 'localhost',
                port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
                username: process.env.POSTGRES_USER || 'postgres',
                password: String(process.env.POSTGRES_PASSWORD || 'postgres'),
                database: process.env.POSTGRES_DB || 'bookings_db',
                models: [Booking, RestaurantTable],
                autoLoadModels: true,
                synchronize: true,
                logging: false,
            })
        }),
        RedisModule,
        BookingsModule,
    ],
})
export class AppModule {}
