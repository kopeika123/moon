import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import * as dotenv from 'dotenv';

async function bootstrap() {
    dotenv.config({ path: '.env' });
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({whitelist: true, transform: true}));

    const config = new DocumentBuilder()
        .setTitle('Booking System API')
        .setDescription('API для платформы бронирования столиков')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Kafka producer (для отправки событий)
    const kafkaBroker = process.env.KAFKA_BROKER || 'localhost:9092';
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.KAFKA,
        options: {
            client: {
                brokers: [kafkaBroker],
            },
            consumer: {
                groupId: 'api-service-group',
            },
        },
    });

    console.log('Kafka connecting to broker:', kafkaBroker);
    console.log('Kafka broker:', process.env.KAFKA_BROKER);
    console.log('Booking created topic:', process.env.BOOKING_CREATED_TOPIC);
    const port = process.env.API_PORT || 3000;
    await app.listen(port);
    console.log('API Service listening on http://localhost:3000');
}

bootstrap();
