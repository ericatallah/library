const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const db = require('../db');
require('dotenv').config();

let retrieveBooksSql = 
    `
    SELECT 
        book.id, book.author, book.title, 
        book_type.type,
        book_sub_type.sub_type,
        book_language.language,
        book_location.location
    FROM
        book, book_type, book_sub_type, book_language, book_location
    WHERE
        book.book_type_id = book_type.id AND
        book.book_sub_type_id = book_sub_type.id AND
        book.book_language_id = book_language.id AND
        book.book_location_id = book_location.id
    `;

router.get('/', (req, res) => {
    res.render('books');
});

// Get all books
router.get('/getbooks', (req, res) => {
    const query = db.query(retrieveBooksSql, (err, results) => {
        if(err) throw err;
        res.status(200).json({ fail: false, msg: 'Successfully retrieved data.', data: results });
    });
});

// Search books by query parameter string
router.get('/searchbooks', (req, res) => {
    const s = req.query.booksearch;

    if (!s) {
        res.render('books', { error: 'Please enter a search term first.' });
    } else {
        const sql = retrieveBooksSql + 
        `
        AND
        (
            book.author LIKE '%${s}%' OR 
            book.title LIKE '%${s}%' OR 
            book_type.type LIKE '%${s}%' OR 
            book_sub_type.sub_type LIKE '%${s}%' OR
            book_language.language LIKE '%${s}%' OR
            book_location.location LIKE '%${s}%'
        ) ORDER BY book_type.type, book_sub_type.sub_type;
        `;

        const query = db.query(sql, (err, results) => {
            if(err) {
                console.log('SQL Error: ', err);
                res.render('books', { books: [] });
                //throw err;
            } else {
                res.render('books', { books: results });
            }
        });
    }
});


// Get single book by id
router.get('/getbook/:id', (req, res) => {
    const sql = retrieveBooksSql + 
        `
        AND book.id = ${req.params.id};
        `;

    const query = db.query(sql, (err, result) => {
        if(err) {
            console.log('SQL Error: ', err);
            res.send('Error fetching book...');
            //throw err;
        } else {
            res.send('Book fetched...');
        }
    });
});

// Get book info (Google Books API)
router.get('/getbookinfo', async (req, res) => {
    const query = `${req.query.query}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
    const bookPromise = await fetch(`https://www.googleapis.com/books/v1/volumes?${query}`);
    const bookJson = await bookPromise.json();
    
    res.status(200).json({ 
        fail: bookJson.totalItems > 0 ? false : true, 
        msg: bookJson.totalItems > 0 ? 'Successfully retrieved book info.' : 'Sorry, could not find any details for this volume.', 
        data: bookJson.totalItems > 0 ? bookJson.items[0] : null
    });
});

// Insert book get and post
router.get('/addbook', (req, res) => {
    const sql = 
    `
    SELECT * FROM book_type;
    SELECT * FROM book_sub_type;
    SELECT * FROM book_language;
    SELECT * FROM book_location;
    `;

    const query = db.query(sql, (err, result) => {
        if(err) {
            console.log('SQL Error: ', err);
            res.render('books', { books: [], success: false, msg: 'There was an error, please try that action again.' });
        } else {
            const tplData = {
                resultMsg: req.query.s === '1' ? 'Book added.' : false,
                types: result[0],
                sub_types: result[1],
                languages: result[2],
                locations: result[3]
            };
    
            res.render('addbook', tplData);
        }
    });
});

router.post('/insertbook', (req, res) => {
    const book = { 
        author: req.body.author, 
        title: req.body.title, 
        book_type_id: +req.body.type, 
        book_sub_type_id: +req.body.sub_type, 
        book_language_id: +req.body.language,
        book_location_id: +req.body.location 
    };

    const sql = 'INSERT INTO book SET ?';
    const query = db.query(sql, book, (err, result) => {
        if(err) throw err;
        res.redirect('/books/addbook?s=1');
    });
});

// Update book GET and PUT (by id)
router.get('/updatebook', (req, res) => {
    const id = req.query.id;
    const sql = 
    `
    SELECT * FROM book WHERE id = ${id};
    SELECT * FROM book_type;
    SELECT * FROM book_sub_type;
    SELECT * FROM book_language;
    SELECT * FROM book_location;
    `;

    const query = db.query(sql, (err, result) => {
        if(err) throw err;

        const tplData = {
            resultMsg: req.query.s === '1' ? `${result[0][0].title} updated.` : false,
            book: result[0][0],
            types: result[1],
            sub_types: result[2],
            languages: result[3],
            locations: result[4]
        };

        res.render('updatebook', tplData);
    });
});

router.post('/updatebookbyid/:id', (req, res) => {
    const id = +req.params.id;
    const book = {
        id,
        author: req.body.author, 
        title: req.body.title, 
        book_type_id: +req.body.type, 
        book_sub_type_id: +req.body.sub_type, 
        book_language_id: +req.body.language,
        book_location_id: +req.body.location 
    };

    const sql = `UPDATE book SET ? WHERE id = ${id};`;
    const query = db.query(sql, book, (err, result) => {
        if(err) throw err;
        res.redirect(`/books/updatebook?id=${id}&s=1`);
    });
});

// Delete book by id
router.delete('/deletebook/:id', (req, res) => {
    const { id } = req.params;
    const sql = 
        `
        SELECT title FROM book WHERE id = ${id};
        DELETE FROM book WHERE id = ${id};
        `;
    
    const query = db.query(sql, (err, result) => {
        if(err) throw err;
        
        res.status(200).json({ fail: false, msg: `${result[0][0].title} has been removed.`, data: result[0][0] });
    });
});

module.exports = router;