import {Sequelize} from 'sequelize-typescript';
import {RestaurantTable} from "../bookings/availability/table.model";
import {seedRestaurantTables} from "./restaurant-tables.seeder";
import {Booking} from "../bookings/booking.model";


async function runSeeder() {
    const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST || 'postgres',
        port: +process.env.POSTGRES_PORT || 5432,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        models: [Booking, RestaurantTable],
        logging: false
    });

    await sequelize.authenticate();
    await seedRestaurantTables(sequelize);
    await sequelize.close();
}

runSeeder().catch(err => {
    console.error('Seeder failed:', err);
    process.exit(1);
});
