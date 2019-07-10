require('dotenv').config();
module.exports = {
  "development": {
    "username": process.env.DB_CONN_USER,
    "password": process.env.DB_CONN_PW,
    "database": process.env.DB_CONN_DBNAME,
    "host": process.env.DB_CONN_HOST,
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "test": {
    "username": process.env.TEST_DB_CONN_USER,
    "password": process.env.TEST_DB_CONN_PW,
    "database": process.env.TEST_DB_CONN_DBNAME,
    "host": process.env.TEST_DB_CONN_HOST,
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "username": process.env.PROD_DB_CONN_USER,
    "password": process.env.PROD_DB_CONN_PW,
    "database": process.env.PROD_DB_CONN_DBNAME,
    "host": process.env.PROD_DB_CONN_HOST,
    "dialect": "mysql",
    "operatorsAliases": false
  }
};
