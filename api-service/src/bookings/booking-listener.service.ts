import { Injectable, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Booking } from './booking.model';

@Injectable()
export class BookingListenerService {
    private readonly logger = new Logger(BookingListenerService.name);

    constructor(private readonly bookingRepo: typeof Booking) {}

    // Подписка на Kafka-топик
    @EventPattern(process.env.BOOKING_UPDATED_TOPIC || 'booking.updated')
    async handleBookingUpdated(@Payload() message: any) {
        const { bookingId, status, tableNumber } = message.value;

        const booking = await this.bookingRepo.findByPk(bookingId);
        if (!booking) {
            this.logger.warn(`Booking not found in API service: ${bookingId}`);
            return;
        }

        booking.status = status;
        booking.tableNumber = tableNumber;
        await booking.save();

        this.logger.log(`Booking ${bookingId} updated in API service: ${status}, table: ${tableNumber}`);
    }
}
