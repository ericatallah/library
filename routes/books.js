const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const pool = require('../db');
require('dotenv').config();

const retrieveBooksSql = 
    `
    SELECT 
        book.id,
        book.author,
        book.title,
        book_type.type,
        book_sub_type.sub_type,
        book_location.location,
        book_language.language
    FROM book
    INNER JOIN book_type ON book.book_type_id = book_type.id
    INNER JOIN book_sub_type ON book.book_sub_type_id = book_sub_type.id
    INNER JOIN book_location ON book.book_location_id = book_location.id
    INNER JOIN book_language ON book.book_language_id = book_language.id
    `;

const getJson = (sqlResult) => {
    const jsonArr = [];

    const checkType = (item) => {
        if (item.constructor.name.toLowerCase() === 'array') {
            item.forEach(obj => {
                checkType(obj);
            });
        } else if (item.constructor.name.toLowerCase() === 'rowdatapacket') {
            jsonArr.push(item);
        }
    };
    
    checkType(sqlResult);
    return jsonArr;
};

router.get('/', async (req, res) => {
    const sql = `${retrieveBooksSql} LIMIT 30;`;
    
    let err;
    const books = await pool.query(sql).catch(e => err = e);
    if (err) {
        console.error('Sql error: ', err);
        res.render('books', { books: [], errorMsg: 'There was an error retrieving your books, please reload this page.' });
    } else {
        res.render('books', { books });
    }
});

// Search books by query parameter string
router.get('/searchbooks', async (req, res) => {
    const s = req.sanitize(pool.escape(`%${req.query.booksearch.trim()}%`));

    if (!s) {
        res.render('books', { errorMsg: 'Please enter a search term first.' });
    } else {
        const sql = 
            `${retrieveBooksSql}
            WHERE
                book.author LIKE ${s} OR book.title LIKE ${s} OR book_type.type LIKE ${s} OR book_sub_type.sub_type LIKE ${s} OR book_language.language LIKE ${s} OR book_location.location LIKE ${s} ORDER BY book_type.type, book_sub_type.sub_type, book.author`;

        let err;
        let booksResult = await pool.query(sql).catch(e => err = e);
        let books = getJson(booksResult);
        
        if (err) {
            console.error('Sql error: ', err);
            res.render('books', { books: [], errorMsg: 'There was an error with that search, please try again.' });
        } else {
            res.render('books', { books });
        }
    }
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
router.get('/addbook', async (req, res) => {
    const sql = 
        `
        SELECT * FROM book_type;
        SELECT * FROM book_sub_type;
        SELECT * FROM book_language;
        SELECT * FROM book_location;
        `;

    let err;
    const result = await pool.query(sql).catch(e => err = e);
    if (err) {
        console.error('SQL Error: ', err);
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

router.post('/insertbook', async (req, res) => {
    const bookTypeId = +req.body.type;
    const bookSubTypeId = +req.body.sub_type;
    const bookLanguageId = +req.body.language;
    const bookLocationId = +req.body.location;

    const book = { 
        author: req.sanitize(req.body.author.trim()), 
        title: req.sanitize(req.body.title.trim()), 
        book_type_id: req.sanitize(bookTypeId), 
        book_sub_type_id: req.sanitize(bookSubTypeId), 
        book_language_id: req.sanitize(bookLanguageId),
        book_location_id: req.sanitize(bookLocationId) 
    };

    const sql = 'INSERT INTO book SET ?';

    const result = await pool.query(sql, book).catch(e => err = e);
    
    if (err) {
        console.error('SQL Error: ', err);
        res.redirect('/books/addbook?s=0');
    } else {
        res.redirect('/books/addbook?s=1');
    }
});

// Update book GET and PUT (by id)
router.get('/updatebook', async (req, res) => {
    const id = pool.escape(req.sanitize(req.query.id));
    const sql = 
        `
        SELECT * FROM book WHERE id = ${id};
        SELECT * FROM book_type;
        SELECT * FROM book_sub_type;
        SELECT * FROM book_language;
        SELECT * FROM book_location;
        `;

    let err;
    const result = await pool.query(sql).catch(e => err = e);

    if (err) {
        console.error('SQL Error: ', err);
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

router.post('/updatebookbyid/:id', async (req, res) => {
    const id = req.sanitize(+req.params.id);
    const bookTypeId = +req.body.type;
    const bookSubTypeId = +req.body.sub_type;
    const bookLanguageId = +req.body.language;
    const bookLocationId = +req.body.location;

    const book = {
        id,
        author: req.sanitize(req.body.author.trim()), 
        title: req.sanitize(req.body.title.trim()), 
        book_type_id: req.sanitize(bookTypeId), 
        book_sub_type_id: req.sanitize(bookSubTypeId), 
        book_language_id: req.sanitize(bookLanguageId),
        book_location_id: req.sanitize(bookLocationId)
    };

    const sql = `UPDATE book SET ? WHERE id = ${pool.escape(id)};`;
    let err;
    const result = await pool.query(sql, book).catch(e => err = e);

    if (err) {
        console.error('SQL Error: ', err);
        res.redirect(`/books/updatebook?id=${id}&s=0`);
    } else {
        res.redirect(`/books/updatebook?id=${id}&s=1`);
    }
});

// Delete book by id
router.delete('/deletebook/:id', async (req, res) => {
    const id = pool.escape(req.sanitize(req.params.id));
    const sql = 
        `
        SELECT title FROM book WHERE id = ${id};
        DELETE FROM book WHERE id = ${id};
        `;
    
    let err;
    const result = await pool.query(sql).catch(e => err = e);

    if (err) {
        console.error('SQL Error: ', err);
        res.status(500).json({ fail: true, msg: 'There was a problem attempting to delete this book, please try again.' });
    } else {
        res.status(200).json({ fail: false, msg: `${result[0][0].title} has been removed.` });
    }
});

module.exports = router;