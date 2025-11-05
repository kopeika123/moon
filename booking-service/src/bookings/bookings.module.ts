import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Booking } from './booking.model';
import { BookingsService } from './bookings.service';
import { BookingsConsumer } from './bookings.consumer';
import { TableAllocationChecker } from './availability/table-allocation-checker';
import { KafkaProducer } from '../kafka/producer';
import {RestaurantTable} from "./availability/table.model";

@Module({
  imports: [SequelizeModule.forFeature([
      Booking,
      RestaurantTable
  ])],
  providers: [
      BookingsService,
      BookingsConsumer,
      TableAllocationChecker,
      KafkaProducer
  ],
})
export class BookingsModule {}
