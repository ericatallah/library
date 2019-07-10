const Sequelize = require('sequelize');
const conn = require('../database/connection');

module.exports = conn.define('BookLanguage', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    language: Sequelize.STRING(255),
});