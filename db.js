const mysql = require('mysql');
require('dotenv').config();

// Create connection
let db;/* = mysql.createConnection({
    host     : process.env.DB_CONN_HOST,
    user     : process.env.DB_CONN_USER,
    password : process.env.DB_CONN_PW,
    database : process.env.DB_CONN_DBNAME,
    multipleStatements: true
});*/

// Connect
const handleDisconnect = () => {
    db = mysql.createConnection({
        host     : process.env.DB_CONN_HOST,
        user     : process.env.DB_CONN_USER,
        password : process.env.DB_CONN_PW,
        database : process.env.DB_CONN_DBNAME,
        multipleStatements: true
    });

    db.connect((err) => {
        if(err) {
            console.log('Error when connecting to db: ', err);
            setTimeout(handleDisconnect, 2000);
            //throw err;
        }
        console.log('MySql Connected...');
    });

    db.on('error', err => {
        console.log('DB error: ', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    })
};

handleDisconnect();

/*db.connect((err) => {
    if(err){
        console.log('Error when connecting to db: ', err);
        setTimeout(handleDisconnect, 2000);
        //throw err;
    }
    console.log('MySql Connected...');
});*/

module.exports = db;