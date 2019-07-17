const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const SqlString = require('sequelize/lib/sql-string');
const Book = require('../db/models/Book');
const BookType = require('../db/models/BookType');
const BookSubType = require('../db/models/BookSubType');
const BookLanguage = require('../db/models/BookLanguage');
const BookLocation = require('../db/models/BookLocation');
require('dotenv').config();

router.get('/', (req, res) => {
    const s = req.sanitize(req.query.s);
    res.render('books', { errorMsg: s === '0' ? 'There was an error, please try that action again.' : false });
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
router.get('/searchbooks', async (req, res) => {
    const sRaw = req.sanitize(SqlString.escape(`%${req.query.booksearch}%`));
    const s = req.sanitize(req.query.booksearch);

    if (!s) {
        res.render('books', { errorMsg: 'Please enter a search term first.' });
    } else {
        const books = await Book.findAll({
            where: {
                [Op.or]: [
                    {author: { [Op.substring]: s }},
                    {title: { [Op.substring]: s }},
                    {a: Sequelize.literal(`BookType.type LIKE ${sRaw}`)},
                    {b: Sequelize.literal(`BookSubType.sub_type LIKE ${sRaw}`)},
                    {c: Sequelize.literal(`BookLocation.location LIKE ${sRaw}`)},
                    {d: Sequelize.literal(`BookLanguage.language LIKE ${sRaw}`)},
                ]
            },
            order: Sequelize.literal(`BookType.type, BookSubType.sub_type, Book.author`),
            attributes: [
                'id', 'author', 'title',
                [Sequelize.col('BookType.type'), 'type'],
                [Sequelize.col('BookSubType.sub_type'), 'sub_type'],
                [Sequelize.col('BookLanguage.language'), 'language'],
                [Sequelize.col('BookLocation.location'), 'location'],
            ],
            include: [
                { 
                    model: BookType, 
                    attributes: [],
                },
                { 
                    model: BookSubType, 
                    attributes: [],
                },
                { 
                    model: BookLanguage, 
                    attributes: [],
                },
                { 
                    model: BookLocation, 
                    attributes: [],
                },
            ],
        }).catch(e => {
            console.log('Sequelize Error: ', e);
            res.render('books', { books: [], errorMsg: 'There was an error with that search, please try again.' });
        });

        res.render('books', { books: JSON.parse(JSON.stringify(books)) });
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
    let err = false;
    const tableData = [];
    tableData.push(await BookType.findAll().catch(e => err = e));
    tableData.push(await BookSubType.findAll().catch(e => err = e));
    tableData.push(await BookLanguage.findAll().catch(e => err = e));
    tableData.push(await BookLocation.findAll().catch(e => err = e));
    
    if (err) {
        console.log('Sequelize Error: ', err);
        res.redirect('/books?s=0');
    } else {
        const tplData = {
            resultMsg: req.query.s === '1' ? 'Book added.' : false,
            errorMsg: req.query.s === '0' ? 'There was an error adding this book, please try again.' : false,
            types: tableData[0],
            sub_types: tableData[1],
            languages: tableData[2],
            locations: tableData[3]
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
        author: req.sanitize(req.body.author), 
        title: req.sanitize(req.body.title), 
        book_type_id: req.sanitize(bookTypeId), 
        book_sub_type_id: req.sanitize(bookSubTypeId), 
        book_language_id: req.sanitize(bookLanguageId),
        book_location_id: req.sanitize(bookLocationId) 
    };

    const bookInstance = await Book.create(book).catch(e => {
        console.log('Sequelize Insert Error: ', e);
        res.redirect('/books/addbook?s=0');
    });

    if (bookInstance) {
        res.redirect('/books/addbook?s=1');
    }
});

// Update book GET and PUT (by id)
router.get('/updatebook', async (req, res) => {
    const id = req.sanitize(req.query.id);
    let err = false;

    // todo eric: need to redirect back to /books after a successful update, and display success message there instead..
    const tableData = [];
    tableData.push(await Book.findByPk(id).catch(e => err = e));
    tableData.push(await BookType.findAll().catch(e => err = e));
    tableData.push(await BookSubType.findAll().catch(e => err = e));
    tableData.push(await BookLanguage.findAll().catch(e => err = e));
    tableData.push(await BookLocation.findAll().catch(e => err = e));

    if (err) {
        console.log('SQL Error: ', err);
        res.redirect('/books?s=0');
    } else {
        const tplData = {
            resultMsg: req.query.s === '1' ? `${tableData[0].title} updated.` : false,
            errorMsg: req.query.s === '0' ? 'There was an error trying to update this book, please try again.' : false,
            book: tableData[0],
            types: tableData[1],
            sub_types: tableData[2],
            languages: tableData[3],
            locations: tableData[4]
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
    let err = false;

    const book = {
        id,
        author: req.body.author, 
        title: req.body.title, 
        book_type_id: bookTypeId, 
        book_sub_type_id: bookSubTypeId, 
        book_language_id: bookLanguageId,
        book_location_id: bookLocationId
    };

    const bookInstance = await Book.findByPk(id).catch(e => err = e);
    bookInstance.update(book).catch(e => err = e);

    if(err) {
        console.log('Sequelize Error: ', err);
        res.redirect(`/books/updatebook?id=${id}&s=0`);
    } else {
        res.redirect(`/books/updatebook?id=${id}&s=1`);
    }
});

// Delete book by id
router.delete('/deletebook/:id', async (req, res) => {
    const id = req.sanitize(req.params.id);
    let err;

    const bookInstance = await Book.findByPk(id).catch(e => err = e);
    const deleteBook = await Book.destroy({
        where: { id }
    }).catch(e => err = e);
    
    if(err) {
        console.log('Sequelize Error: ', err);
        res.status(500).json({ fail: true, msg: 'There was a problem attempting to delete this book, please try again.', data: [] });
    } else {
        res.status(200).json({ fail: false, msg: `${bookInstance.title} has been removed.`, data: bookInstance });
    }
});

module.exports = router;