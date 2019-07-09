const mysql = require('mysql');
require('dotenv').config();

// Create connection
const db = mysql.createConnection({
    host     : process.env.DB_CONN_HOST,
    user     : process.env.DB_CONN_USER,
    password : process.env.DB_CONN_PW,
    database : process.env.DB_CONN_DBNAME,
    multipleStatements: true
});

// Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected...');
});

module.exports = db;