const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/static', express.static('public'));

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: `${__dirname}/views/layouts/`,
    partialsDir: `${__dirname}/views/includes/`
}));

app.set('view engine', 'hbs');

const mainRoutes = require('./routes');
const musicRoutes = require('./routes/music');
const booksRoutes = require('./routes/books');

app.use(mainRoutes);
app.use('/music', musicRoutes);
app.use('/books', booksRoutes);

// Create DB
app.get('/createandseeddb', (req, res) => {
    const sql = 
    `
    CREATE DATABASE library;
    CREATE TABLE books(id INT AUTO_INCREMENT, author VARCHAR(255), title VARCHAR(255), type VARCHAR(255), sub_type VARCHAR(255), location VARCHAR(255), PRIMARY KEY(id));
    INSERT INTO books (id, author, title, type, sub_type, location) VALUES (DEFAULT, 'MORGAN, Gwyn', '69 A. D. - The Year of Four Emperors', 'History', 'Ancient', 'Main');
    INSERT INTO books (id, author, title, type, sub_type, location) VALUES (DEFAULT ,'MANN, Charles', '1491 - New Revelations of the Americas before Columbus', 'History', 'American', 'Main');
    `;

    db.query(sql, (err, results) => {
        if (err) throw err;

        console.log('results: ', results);
        res.send('Books table created and seeded..');
    });
});

// 404 route
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('error');
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
