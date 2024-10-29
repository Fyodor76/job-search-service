'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Добавляем колонку chatId в таблицу users
    await queryInterface.addColumn('users', 'chatId', {
      type: Sequelize.STRING,
      allowNull: true, // Устанавливаем allowNull в true, если это поле не обязательно
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Удаляем колонку chatId из таблицы users
    await queryInterface.removeColumn('users', 'chatId');
  },
};
