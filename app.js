const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const expressSanitizer = require('express-sanitizer');
const Sequelize = require('sequelize');
const { Op } = Sequelize;
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
