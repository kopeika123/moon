"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const dotenv = __importStar(require("dotenv"));
const sequelize_typescript_1 = require("sequelize-typescript");
const table_model_1 = require("./bookings/availability/table.model");
const restaurant_tables_seeder_1 = require("./seeders/restaurant-tables.seeder");
async function bootstrap() {
    dotenv.config();
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Получаем Sequelize
    const sequelize = app.get(sequelize_typescript_1.Sequelize);
    // Создаём таблицы (если их ещё нет)
    await sequelize.sync();
    // Seeder: заполняем restaurant_tables только если таблица пустая
    const count = await table_model_1.RestaurantTable.count();
    if (count === 0) {
        await (0, restaurant_tables_seeder_1.seedRestaurantTables)(sequelize); // твоя функция для заполнения
        console.log('Restaurant tables seeded');
    }
    // Настройка Kafka
    const kafkaBroker = process.env.KAFKA_BROKER || 'localhost:9093';
    app.connectMicroservice({
        transport: microservices_1.Transport.KAFKA,
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
//# sourceMappingURL=main.js.map