const Sequelize = require('sequelize');
const conn = require('../database/connection');
const BookType = require('./BookType');
const BookSubType = require('./BookSubType');
const BookLanguage = require('./BookLanguage');
const BookLocation = require('./BookLocation');

const Book = conn.define('Book', {
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
        //field: 'book_type_id',
        references: {
            model: 'book_type',
            key: 'id'
        },
        allowNull: false
    },
    book_sub_type_id: {
        type: Sequelize.INTEGER(11),
        //field: 'book_sub_type_id',
        references: {
            model: 'book_sub_type',
            key: 'id'
        },
        allowNull: true
    },
    book_language_id: {
        type: Sequelize.INTEGER(11),
        //field: 'book_language_id',
        references: {
            model: 'book_language',
            key: 'id'
        },
        allowNull: false
    },
    book_location_id: {
        type: Sequelize.INTEGER(11),
        //field: 'book_location_id',
        references: {
            model: 'book_location',
            key: 'id'
        },
        allowNull: false
    },
},
{
    tableName: 'book'
});

Book.belongsTo(BookType);
Book.belongsTo(BookSubType);
Book.belongsTo(BookLanguage);
Book.belongsTo(BookLocation);
BookType.hasMany(Book);
BookSubType.hasMany(Book);
BookLanguage.hasMany(Book);
BookLocation.hasMany(Book);

module.exports = Book;