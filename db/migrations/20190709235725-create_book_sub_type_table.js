'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('book_sub_type', {
      id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
      },
      sub_type: Sequelize.STRING(255),
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('book_sub_type');
  }
};
