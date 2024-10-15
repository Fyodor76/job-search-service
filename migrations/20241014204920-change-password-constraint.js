'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Изменяем колонку password, чтобы разрешить NULL
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    // Возвращаем обратно, если нужно
    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
