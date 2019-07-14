const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const db = global.db || require('../db');
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
/*
router.get('/getbooks', (req, res) => {
    const query = db.query(retrieveBooksSql, (err, results) => {
        if(err) throw err;
        res.status(200).json({ fail: false, msg: 'Successfully retrieved data.', data: results });
    });
});
*/

// Search books by query parameter string
router.get('/searchbooks', (req, res) => {
    const s = req.sanitize(db.escape(`%${req.query.booksearch}%`));

    if (!s) {
        res.render('books', { errorMsg: 'Please enter a search term first.' });
    } else {
        const sql = retrieveBooksSql + 
            `
            AND
            (
                book.author LIKE ${s} OR 
                book.title LIKE ${s} OR 
                book_type.type LIKE ${s} OR 
                book_sub_type.sub_type LIKE ${s} OR
                book_language.language LIKE ${s} OR
                book_location.location LIKE ${s}
            ) ORDER BY book_type.type, book_sub_type.sub_type;
            `;

        db.getConnection((e, conn) => {
            if (e) {
                conn.release();
                console.log('Error getting connection from pool: ', e);
                throw e;
            }

            conn.query(sql, (err, results) => {
                conn.release();
                if(err) {
                    console.log('SQL Query Error: ', err);
                    res.render('books', { books: [], errorMsg: 'There was an error with that search, please try again.' });
                } else {
                    res.render('books', { books: results });
                }
            });
        });
    }
});

// Get single book by id
router.get('/getbook/:id', (req, res) => {
    const id = db.escape(req.sanitize(req.params.id));
    const sql = retrieveBooksSql + 
        `
        AND book.id = ${id};
        `;

    db.getConnection((e, conn) => {
        if (e) {
            conn.release();
            console.log('Error getting connection from pool: ', e);
            throw e;
        }
        conn.query(sql, (err, result) => {
            conn.release();
            if(err) {
                console.log('SQL Error: ', err);
                res.send('Error fetching book...');
                //throw err;
            } else {
                res.send('Book fetched...');
            }
        });
    });
});

// Get book info (Google Books API)
router.get('/getbookinfo', async (req, res) => {
    const bq = req.sanitize(req.query.query);
    const query = `${bq}&key=${process.env.GOOGLE_BOOKS_API_KEY}`;
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

    db.getConnection((e, conn) => {
        if (e) {
            conn.release();
            console.log('Error getting connection from pool: ', e);
            throw e;
        }
        conn.query(sql, (err, result) => {
            conn.release();
            if(err) {
                console.log('SQL Error: ', err);
                const tplData = {
                    errorMsg: 'There was an error, please try that action again.',
                    books: []
                };
                res.render('books', tplData);
            } else {
                const tplData = {
                    resultMsg: req.query.s === '1' ? 'Book added.' : false,
                    errorMsg: req.query.s === '0' ? 'There was an error adding this book, please try again.' : false,
                    types: result[0],
                    sub_types: result[1],
                    languages: result[2],
                    locations: result[3]
                };
        
                res.render('addbook', tplData);
            }
        });
    });
});

router.post('/insertbook', (req, res) => {
    const bookTypeId = +req.body.type;
    const bookSubTypeId = +req.body.sub_type;
    const bookLanguageId = +req.body.language;
    const bookLocationId = +req.body.location;

    const book = { 
        author: req.sanitize(req.body.author), 
        title: req.sanitize(req.body.title), 
        book_type_id: req.sanitize(bookTypeId), 
        book_sub_type_id: req.sanitize(bookSubTypeId), 
        book_language_id: req.sanitize(bookLanguageId),
        book_location_id: req.sanitize(bookLocationId) 
    };

    const sql = 'INSERT INTO book SET ?';

    db.getConnection((e, conn) => {
        if (e) {
            conn.release();
            console.log('Error getting connection from pool: ', e);
            throw e;
        }
        conn.query(sql, book, (err, result) => {
            conn.release();
            if(err) {
                console.log('SQL Error: ', err);
                res.redirect('/books/addbook?s=0');
            } else {
                res.redirect('/books/addbook?s=1');
            }
        });
    });
});

// Update book GET and PUT (by id)
router.get('/updatebook', (req, res) => {
    const id = db.escape(req.sanitize(req.query.id));
    const sql = 
        `
        SELECT * FROM book WHERE id = ${id};
        SELECT * FROM book_type;
        SELECT * FROM book_sub_type;
        SELECT * FROM book_language;
        SELECT * FROM book_location;
        `;

    db.getConnection((e, conn) => {
        if (e) {
            conn.release();
            console.log('Error getting connection from pool: ', e);
            throw e;
        }
        conn.query(sql, (err, result) => {
            conn.release();
            if(err) {
                console.log('SQL Error: ', err);
                const tplData = {
                    errorMsg: 'There was an error, please try that action again.',
                    books: []
                };
                res.render('books', tplData);
            } else {
                const tplData = {
                    resultMsg: req.query.s === '1' ? `${result[0][0].title} updated.` : false,
                    errorMsg: req.query.s === '0' ? 'There was an error trying to update this book, please try again.' : false,
                    book: result[0][0],
                    types: result[1],
                    sub_types: result[2],
                    languages: result[3],
                    locations: result[4]
                };

                res.render('updatebook', tplData);
            }
        });
    });
});

router.post('/updatebookbyid/:id', (req, res) => {
    const id = req.sanitize(+req.params.id);
    const bookTypeId = +req.body.type;
    const bookSubTypeId = +req.body.sub_type;
    const bookLanguageId = +req.body.language;
    const bookLocationId = +req.body.location;

    const book = {
        id,
        author: req.body.author, 
        title: req.body.title, 
        book_type_id: bookTypeId, 
        book_sub_type_id: bookSubTypeId, 
        book_language_id: bookLanguageId,
        book_location_id: bookLocationId
    };

    const sql = `UPDATE book SET ? WHERE id = ${db.escape(id)};`;

    db.getConnection((e, conn) => {
        if (e) {
            conn.release();
            console.log('Error getting connection from pool: ', e);
            throw e;
        }
        conn.query(sql, book, (err, result) => {
            conn.release();
            if(err) {
                console.log('SQL Error: ', err);
                res.redirect(`/books/updatebook?id=${id}&s=0`);
            } else {
                res.redirect(`/books/updatebook?id=${id}&s=1`);
            }
        });
    });
});

// Delete book by id
router.delete('/deletebook/:id', (req, res) => {
    const id = db.escape(req.sanitize(req.params.id));
    const sql = 
        `
        SELECT title FROM book WHERE id = ${id};
        DELETE FROM book WHERE id = ${id};
        `;
    
    db.getConnection((e, conn) => {
        if (e) {
            conn.release();
            console.log('Error getting connection from pool: ', e);
            throw e;
        }
        conn.query(sql, (err, result) => {
            conn.release();
            if(err) {
                console.log('SQL Error: ', err);
                res.status(500).json({ fail: true, msg: 'There was a problem attempting to delete this book, please try again.', data: [] });
            } else {
                res.status(200).json({ fail: false, msg: `${result[0][0].title} has been removed.`, data: result[0][0] });
            }
        });
    });
});

module.exports = router;