'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('book_location', [
      { location: 'Barrister' },
      { location: 'Blue Room' },
      { location: 'Garage' },
      { location: 'Kitchen' },
      { location: 'Living Room' },
      { location: 'Main' },
      { location: 'Office' },
      { location: 'Purple Room' },
      { location: 'White Room' },
      { location: 'Exiled' }
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('book_location', null, {});
  }
};
