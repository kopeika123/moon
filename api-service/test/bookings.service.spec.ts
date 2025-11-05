import {Sequelize} from 'sequelize-typescript';
import {Booking} from '../src/bookings/booking.model';
import {BookingsService} from '../src/bookings/bookings.service';
import {RedisService} from '../src/cache/redis.service';
import {KafkaProducer} from '../src/kafka/producer';

describe('BookingsService (unit)', () => {
    let sequelize: Sequelize;
    let service: BookingsService;

    beforeAll(async () => {
        sequelize = new Sequelize({dialect: 'sqlite', storage: ':memory:', models: [Booking], logging: false});
        await sequelize.sync();
        const redis = {get: async () => null, set: async () => null, del: async () => null} as unknown as RedisService;
        const kafka = {emit: async () => null} as unknown as KafkaProducer;
        service = new BookingsService(sequelize.model('Booking') as any, redis, kafka);
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('creates booking and sets CREATED status', async () => {
        const b = await service.create({restaurantId: 'r1', datetime: new Date(), guests: 2});
        expect(b.status).toBe('CREATED');
    });
});
