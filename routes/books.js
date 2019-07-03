const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
    res.render('books');
});

// Get all books
router.get('/getbooks', (req, res) => {
    const sql = 
    `
    SELECT * FROM books 
    `;
    const query = db.query(sql, (err, results) => {
        if(err) throw err;
        res.status(200).json({ fail: false, msg: 'Successfully retrieved data.', data: results });
    });
});

// Search books by query parameter string
router.get('/searchbooks', (req, res) => {
    const s = req.query.booksearch;
    console.log('s is: ', s);

    if (!s) {
        res.render('books', { error: 'Please enter a search term first.' });
    } else {
        const sql = 
        `
        SELECT * FROM books 
        WHERE 
        author LIKE '%${s}%' OR
        title LIKE '%${s}%' OR
        type LIKE '%${s}%' OR
        sub_type LIKE '%${s}%' OR
        location LIKE '%${s}%'
        `;
        const query = db.query(sql, (err, results) => {
            if(err) throw err;
            //res.status(200).json({ fail: false, msg: 'Successfully retrieved data.', data: results });
            res.render('books', { books: results });
        });
    }
});


// Get single book by id
router.get('/getbook/:id', (req, res) => {
    const sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
    const query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Post fetched...');
    });
});

// Insert book get and post
router.get('/addbook', (req, res) => {
    console.log('query: ', req.query);
    res.render('addbook', { resultMsg: req.query.s === '1' ? 'Book successfully added to your library.' : false });
});

router.post('/insertbook', (req, res) => {
    const book = { author: req.body.author, title: req.body.title, type: req.body.type, sub_type: req.body.sub_type, location: req.body.location };
    const sql = 'INSERT INTO books SET ?';
    const query = db.query(sql, book, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.redirect('/books/addbook?s=1');
    });
});

// Update book by id
router.put('/updatebook/:id', ({ body }, res) => {
    const { id } = body;
    const { author } = body;
    const { title } = body;
    const { type } = body;
    const { sub_type } = body;
    const { location } = body;

    const sql = `UPDATE books SET author = "${author}", title = "${title}", type = "${type}", sub_type = "${sub_type}", location = "${location}" WHERE id = ${id}`;
    const query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send(`Book: ${id} updated - Title: ${title}`);
    });
});

// Delete book
router.delete('/deletebook/:id', (req, res) => {
    const sql = `DELETE FROM books WHERE id = ${req.params.id}`;
    const query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send(`Book: ${id} deleted`);
    });
});

module.exports = router;