import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './booking.model';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { KafkaProducer } from '../kafka/producer';

@Module({
  imports: [SequelizeModule.forFeature([Booking])],
  controllers: [BookingsController],
  providers: [BookingsService, KafkaProducer],
  exports: [BookingsService],
})
export class BookingsModule {}
