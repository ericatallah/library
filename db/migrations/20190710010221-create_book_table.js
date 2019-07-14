'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('book', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      author: Sequelize.STRING(255),
      title: Sequelize.STRING(255),
      book_type_id: {
        type: Sequelize.INTEGER(11),
        references: {
          model: 'book_type',
          key: 'id'
        },
        allowNull: false
      },
      book_sub_type_id: {
        type: Sequelize.INTEGER(11),
        references: {
          model: 'book_sub_type',
          key: 'id'
        },
        allowNull: true
      },
      book_language_id: {
        type: Sequelize.INTEGER(11),
        references: {
          model: 'book_language',
          key: 'id'
        },
        allowNull: false
      },
      book_location_id: {
        type: Sequelize.INTEGER(11),
        references: {
          model: 'book_location',
          key: 'id'
        },
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('book');
  }
};