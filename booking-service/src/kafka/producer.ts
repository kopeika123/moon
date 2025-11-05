import {Injectable} from '@nestjs/common';
import {Kafka, Producer} from 'kafkajs';

@Injectable()
export class KafkaProducer {
    private producer: Producer;

    constructor() {
        const broker = process.env.KAFKA_BROKER || 'localhost:9093';
        const kafka = new Kafka({brokers: [broker]});
        this.producer = kafka.producer();
        this.producer.connect().catch(e => console.error('kafka connect error', e));
    }

    async emit(topic: string, message: any) {
        await this.producer.send({topic, messages: [{value: JSON.stringify(message)}]});
    }
}
