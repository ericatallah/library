module.exports = async () => {
    const Book = require('./models/Book');
    const BookType = require('./models/BookType');

    const errHandler = err => {
        console.error('Error: ', err);
    }

    const bookType = await BookType.create({type: 'Architecture'}).catch(errHandler);
}