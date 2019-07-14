const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const expressSanitizer = require('express-sanitizer');
//const db = require('./db');
const db = require('./db/database/connection');
const { Op } = require('sequelize');
const Book = require('./db/models/Book');
const BookType = require('./db/models/BookType');
const BookSubType = require('./db/models/BookSubType');
const BookLanguage = require('./db/models/BookLanguage');
const BookLocation = require('./db/models/BookLocation');

const { isEqualHelper } = require('./helpers/helpers');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressSanitizer());

// serve static assets in /public directory as /static route
app.use('/static', express.static('public'));

// setup handlebars template engine
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'main',
    helpers: {
        if_eq: isEqualHelper
    },
    layoutsDir: `./views/layouts/`,
    partialsDir: `./views/includes/`
}));

app.set('view engine', 'hbs');

// setup express routes
const mainRoutes = require('./routes');
const musicRoutes = require('./routes/music');
const booksRoutes = require('./routes/books');

app.use(mainRoutes);
app.use('/music', musicRoutes);
app.use('/books', booksRoutes);

app.get('/getbooks', async (req, res) => {
    /*
    const books = await db.query(
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
            book.book_location_id = book_location.id AND
            (
                book.author LIKE '%revolution%' OR
                book.title LIKE '%revolution%' OR
                book_type.type LIKE '%revolution%' OR
                book_sub_type.sub_type LIKE '%revolution%' OR
                book_language.language LIKE '%revolution%' OR
                book_location.location LIKE '%revolution%'
            );
        `
    );

    */

    /* This sort of works..
    const books = await BookType.findOne({
        where: {
            type: 'History'
        }
    }).then(type => type.getBooks());
    */

    // todo eric: get this shit to work!
    const books = await Book.findAll({
        where: {
            [Op.or]: [
                {author: { [Op.substring]: 'revolution' }},
                {title: { [Op.substring]: 'revolution' }}
            ]
        },
        attributes: ['id', 'author', 'title'],
        include: [
            { 
                model: BookType, 
                attributes: ['type'], 
                //where: {
                    //type: { [Op.substring]: 'revolution' }
                //} 
            },
            { 
                model: BookSubType, 
                attributes: ['sub_type'], 
                // where: {
                //     sub_type: { [Op.substring]: 'revolution' }
                // } 
            },
            { 
                model: BookLanguage, 
                attributes: ['language'], 
                // where: {
                //     language: { [Op.substring]: 'revolution' }
                // } 
            },
            { 
                model: BookLocation, 
                attributes: ['location'], 
                // where: {
                //     location: { [Op.substring]: 'revolution' }
                // }  
            },
        ]
    });
    

    res.status(200).json({ success: 'yes', data: books });

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
