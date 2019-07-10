const Sequelize = require('sequelize');
const conn = require('../database/connection');

module.exports = conn.define('BookLocation', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    location: Sequelize.STRING(255),
},
{
    tableName: 'book_location'
});