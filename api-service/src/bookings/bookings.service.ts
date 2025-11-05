import {Injectable, Logger} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {Booking} from './booking.model';
import {RedisService} from '../cache/redis.service';
import {KafkaProducer} from '../kafka/producer';
import {CreateBookingDto} from "./dto/create-booking.dto";

@Injectable()
export class BookingsService {
    constructor(@InjectModel(Booking) private bookingModel: typeof Booking,
                private redis: RedisService,
                private kafka: KafkaProducer) {
    }

    private readonly logger = new Logger(BookingsService.name);

    async create(dto: CreateBookingDto) {
        const booking = await this.bookingModel.create(dto);
        await this.redis.set(`booking:${booking.id}`, JSON.stringify(booking), 60);
        await this.emitBookingCreated(booking);
        return booking;
    }

    async emitBookingCreated(booking: Booking) {
        await this.kafka.emit(
            process.env.BOOKING_CREATED_TOPIC || 'booking.created',
            {
                bookingId: booking.id,
                restaurantId: booking.restaurantId,
                datetime: booking.datetime.toISOString(),
                durationMinutes: booking.durationMinutes,
                guests: booking.guests,
                tableNumber: booking.tableNumber,
                status: booking.status,
            },
        );
        this.logger.log(`Emitted booking.created for booking ${booking.id}`);
    }

    async findOne(id: string) {
        const cached = await this.redis.get(`booking:${id}`);
        if (cached) return JSON.parse(cached);
        const booking = await this.bookingModel.findByPk(id);
        if (booking) await this.redis.set(`booking:${id}`, JSON.stringify(booking), 60);
        return booking
    }

    async findAll() {
        return this.bookingModel.findAll();
    }
}
