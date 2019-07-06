const mysql = require('mysql');

// Create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'nodeuser',
    password : '3r1c-@nt01n3sb00ks1!!',
    database : 'library',
    multipleStatements: true
});

// Connect
db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySql Connected ya...');
});

module.exports = db;