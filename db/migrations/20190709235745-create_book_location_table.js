'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('book_location', {
      id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
      },
      location: Sequelize.STRING(255),
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('book_location');
  }
};
