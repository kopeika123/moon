import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private client: RedisClient;

    constructor() {
        const url = process.env.REDIS_URL || 'redis://localhost:6379';
        this.client = new Redis(url);
        this.client.on('error', (e) => console.error('Redis error', e));
    }

    async get(key: string) {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttl?: number) {
        if (ttl) return this.client.set(key, value, 'EX', ttl);
        return this.client.set(key, value);
    }

    async del(key: string) {
        return this.client.del(key);
    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}
