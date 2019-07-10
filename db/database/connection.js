const Sequelize = require('sequelize');
require('dotenv').config();

// Create connection
const sequelize = new Sequelize(
    process.env.DB_CONN_DBNAME, 
    process.env.DB_CONN_USER, 
    process.env.DB_CONN_PW, 
    { 
        host: process.env.DB_CONN_HOST, 
        dialect: 'mysql', 
        operatorsAliases: false,
        define: {
            timestamps: false,
            freezeTableName: true,
            underscored: true,
        }
    }
);

module.exports = sequelize;