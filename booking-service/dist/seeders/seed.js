"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const table_model_1 = require("../bookings/availability/table.model");
const restaurant_tables_seeder_1 = require("./restaurant-tables.seeder");
const booking_model_1 = require("../bookings/booking.model");
async function runSeeder() {
    const sequelize = new sequelize_typescript_1.Sequelize({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST || 'postgres',
        port: +process.env.POSTGRES_PORT || 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        models: [booking_model_1.Booking, table_model_1.RestaurantTable],
        logging: false
    });
    await sequelize.authenticate();
    await (0, restaurant_tables_seeder_1.seedRestaurantTables)(sequelize);
    await sequelize.close();
}
runSeeder().catch(err => {
    console.error('Seeder failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map