const Sequelize = require('sequelize');
const conn = require('../database/connection');

module.exports = conn.define('BookType', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    type: Sequelize.STRING(255),
},
{
    tableName: 'book_type'
});