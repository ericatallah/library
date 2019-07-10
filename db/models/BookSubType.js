const Sequelize = require('sequelize');
const conn = require('../database/connection');

module.exports = conn.define('BookSubType', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    sub_type: Sequelize.STRING(255),
});