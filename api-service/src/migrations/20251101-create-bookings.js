'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bookings', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.literal('gen_random_uuid()') },
      restaurantId: { type: Sequelize.STRING },
      datetime: { type: Sequelize.DATE },
      durationMinutes: { type: Sequelize.INTEGER },
      guests: { type: Sequelize.INTEGER },
      status: { type: Sequelize.STRING },
      tableNumber: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') }
    });
    await queryInterface.createTable('restaurant_tables', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.literal('gen_random_uuid()') },
      restaurantId: { type: Sequelize.STRING },
      seats: { type: Sequelize.INTEGER },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('now()') }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('restaurant_tables');
    await queryInterface.dropTable('bookings');
  }
};
