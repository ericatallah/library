const express = require('express');
const router = express.Router();
const db = require('../db');

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
    console.log('s is: ', s);

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
        );
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
    const sql = retrieveBooksSql + 
        `
        AND book.id =  ${req.params.id};
        `;

    const query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Book fetched...');
    });
});

// Insert book get and post
router.get('/addbook', (req, res) => {
    console.log('query: ', req.query);

    const sql = 
    `
    SELECT * FROM book_type;
    SELECT * FROM book_sub_type;
    SELECT * FROM book_language;
    SELECT * FROM book_location;
    `;

    const query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        const tplData = {
            resultMsg: req.query.s === '1' ? 'Book successfully added to your library.' : false,
            types: result[0],
            sub_types: result[1],
            languages: result[2],
            locations: result[3]
        };

        res.render('addbook', tplData);
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

    console.log('book to be inserted: ', book);

    const sql = 'INSERT INTO book SET ?';
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
    const { language } = body;
    const { location } = body;

    const sql = 
        `
        UPDATE book 
        SET 
        author = "${author}", 
        title = "${title}", 
        type = "${type}", 
        sub_type = "${sub_type}", 
        language = "${language}",
        location = "${location}" 
        WHERE id = ${id}
        `;
    const query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send(`Book: ${id} updated - Title: ${title}`);
    });
});

// Delete book by id
router.delete('/deletebook/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM book WHERE id = ${id}`;
    res.status(200).json({ fail: false, msg: `Book: ${id} deleted`, data: 'hello' });
    /*
    const query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.status(200).json({ fail: false, msg: `Book: ${id} deleted`, data: result });
    });*/
});

module.exports = router;