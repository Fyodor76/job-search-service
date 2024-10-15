'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Удаляем столбец accessToken из таблицы tokens
    await queryInterface.removeColumn('tokens', 'accessToken');
  },

  down: async (queryInterface, Sequelize) => {
    // Восстанавливаем столбец accessToken, если нужно
    await queryInterface.addColumn('tokens', 'accessToken', {
      type: Sequelize.STRING,
      allowNull: true, // Или false, если вы хотите, чтобы столбец не мог быть NULL
    });
  },
};
