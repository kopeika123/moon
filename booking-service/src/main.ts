import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import * as dotenv from 'dotenv';
import {Sequelize} from "sequelize-typescript";
import {RestaurantTable} from "./bookings/availability/table.model";
import {seedRestaurantTables} from "./seeders/restaurant-tables.seeder";

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);

    // Получаем Sequelize
    const sequelize = app.get(Sequelize);

    // Создаём таблицы (если их ещё нет)
    await sequelize.sync();

    // Seeder: заполняем restaurant_tables только если таблица пустая
    const count = await RestaurantTable.count();
    if (count === 0) {
        await seedRestaurantTables(sequelize); // твоя функция для заполнения
        console.log('Restaurant tables seeded');
    }

    // Настройка Kafka
    const kafkaBroker = process.env.KAFKA_BROKER || 'localhost:9093';
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
            client: {
                brokers: [kafkaBroker],
            },
            consumer: {
                groupId: 'booking-service-group',
                allowAutoTopicCreation: true,
            },
            subscribe: {
                fromBeginning: true,
            },
        }
    });

    console.log('Kafka connecting to broker:', kafkaBroker);
    console.log('Booking created topic:', process.env.BOOKING_CREATED_TOPIC);
    await app.startAllMicroservices();

    const port = process.env.BOOKING_SERVICE_PORT || 3001;
    await app.listen(port);
    console.log('Booking service listening on http://localhost:3001');
}

bootstrap();
