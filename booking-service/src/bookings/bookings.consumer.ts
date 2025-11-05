import {Injectable, Logger} from '@nestjs/common';
import {Ctx, EventPattern, KafkaContext, Payload} from '@nestjs/microservices';
import {BookingsService} from './bookings.service';

@Injectable()
export class BookingsConsumer {
    private readonly logger = new Logger(BookingsConsumer.name);

    constructor(private svc: BookingsService) {}

    @EventPattern(process.env.BOOKING_CREATED_TOPIC || 'booking.created')
    async handle(@Payload() message: any, @Ctx() ctx: KafkaContext) {
        try {
            this.logger.log('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq')
            const value = message.value ? JSON.parse(message.value.toString()) : message;
            this.logger.log('Received booking.created: ' + JSON.stringify(value));
            await this.svc.processBookingEvent(value);
        } catch (error) {
            console.log('error', error);
        }
    }
}
