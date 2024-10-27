'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'yandexId', {
      type: Sequelize.STRING, // Используйте Sequelize вместо DataTypes
      allowNull: true, // Устанавливаем allowNull в true, если это поле не обязательно
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'yandexId');
  },
};