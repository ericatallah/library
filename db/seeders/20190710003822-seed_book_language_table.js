'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('book_language', [
      { language: 'Arabic' },
      { language: 'English' },
      { language: 'French' },
      { language: 'German' },
      { language: 'Italian' },
      { language: 'Spanish' }
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('book_language', null, {});
  }
};
