const mysql = require('mysql');
require('dotenv').config();

// Create global connection object
global.db = global.db || false;

// Connect
const handleDisconnect = () => {
    //db = mysql.createConnection({
    db = mysql.createPool({
        connectionLimit: 1000,
        host: process.env.DB_CONN_HOST,
        user: process.env.DB_CONN_USER,
        password: process.env.DB_CONN_PW,
        database: process.env.DB_CONN_DBNAME,
        multipleStatements: true
    });

    // db.connect((err) => {
    //     if(err) {
    //         console.log('Error when connecting to db: ', err);
    //         setTimeout(handleDisconnect, 2000);
    //         //throw err;
    //     }
    //     console.log('MySql Connected...');
    // });

    db.on('error', err => {
        console.log('DB error: ', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            console.log('Some other DB error: ', err);
            throw err;
        }
    });
};

if (!global.db) handleDisconnect();

module.exports = db;