'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('book_language', {
      id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
      },
      language: Sequelize.STRING(255),
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('book_language');
  }
};
