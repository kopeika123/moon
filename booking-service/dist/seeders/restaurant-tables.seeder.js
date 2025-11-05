"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedRestaurantTables = seedRestaurantTables;
const table_model_1 = require("../bookings/availability/table.model");
async function seedRestaurantTables(sequelize) {
    try {
        // Проверяем, существует ли таблица
        await sequelize.getQueryInterface().describeTable('restaurant_tables');
        const count = await table_model_1.RestaurantTable.count();
        if (count > 0) {
            console.log('✅ Restaurant tables already seeded, skipping.');
            return;
        }
        const tables = [
            { restaurantId: 1, tableNumber: 1, seats: 2, capacity: 2, location: 'window', isActive: true },
            { restaurantId: 1, tableNumber: 2, seats: 4, capacity: 4, location: 'center', isActive: true },
            { restaurantId: 1, tableNumber: 3, seats: 6, capacity: 6, location: 'terrace', isActive: true },
            { restaurantId: 2, tableNumber: 1, seats: 2, capacity: 2, location: 'window', isActive: true },
            { restaurantId: 2, tableNumber: 2, seats: 4, capacity: 4, location: 'center', isActive: true },
            { restaurantId: 2, tableNumber: 3, seats: 8, capacity: 8, location: 'terrace', isActive: true },
        ];
        await table_model_1.RestaurantTable.bulkCreate(tables);
        console.log('✅ Restaurant tables seeded successfully!');
    }
    catch (err) {
        console.log('⚠️ Restaurant tables table does not exist yet, skipping seeding.');
    }
}
//# sourceMappingURL=restaurant-tables.seeder.js.map