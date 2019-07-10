'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('book_type', [
      { type: 'Architecture' },
      { type: 'Art' },
      { type: 'Biography' },
      { type: 'Cinema' },
      { type: 'Commun.' },
      { type: 'Cultural Studies' },
      { type: 'Engineering' },
      { type: 'Fiction' },
      { type: 'Food' },
      { type: 'Games' },
      { type: 'Geography' },
      { type: 'History' },
      { type: 'Humor' },
      { type: 'Literature' },
      { type: 'Management' },
      { type: 'Music' },
      { type: 'Pets' },
      { type: 'Philosophy' },
      { type: 'Photography' },
      { type: 'Politics' },
      { type: 'Psychology' },
      { type: 'Reference' },
      { type: 'Religion' },
      { type: 'Science' },
      { type: 'Travel' },
      { type: 'True Crime' }
    ], {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('book_type', null, {});
  }
};
