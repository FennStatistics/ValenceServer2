const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/png'];



// all books route
router.get('/', async (req, res) => {
    let query = Book.find();
    // filter for title
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i')); // case insensitive
    }
    // filter for published after
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter); // greater equal
    }
    // filter for published before
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore); // less equal
    }
    try {
        const books = await query.exec();
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/');

    }

});

// show book route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book());
});

// create new book > render nothing just create
router.post('/', async (req, res) => {
    console.log("posted Book using form script with title:", req.body.title);

    const fileName = req.file != null ? req.file.filename : null;

    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        author: req.body.author
    })

    saveCover(book, req.body.cover); // save cover

    try {
        const newBook = await book.save();
        res.redirect(`books/${newBook.id}`);
    } catch {
        renderNewPage(res, book, true); // has error here

    }
});


// show book
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec(); // populate our book object with author information

        res.render('books/show', {
            book: book
        })
    } catch {
        res.redirect('/');
    }
})

// edit book
router.get('/:id/edit', async (req, res) => {

    try {
        const book = await Book.findById(req.params.id);
        renderEditPage(res, book);

    } catch (err) {
        console.log("err editing book:", err);
        res.redirect('/');
    }

})

// create new book > render nothing just create
router.put('/:id', async (req, res) => {
    let book; // if we want to have access to it inside the catch we need to define this variable here
    try {
        book = await Book.findById(req.params.id);
        // to change the single fields of book: 
        book.title = req.body.title;
        book.author = req.body.author;
        book.publishDate = new Date(req.body.publishDate);
        book.pageCount = req.body.pageCount;
        book.description = req.body.description;

        if (req.body.cover != null && req.body.cover != '') {
            saveCover(book, req.body.cover);
        }
        await book.save();
        res.redirect(`/books/${book.id}`);
    } catch {
        if (book != null) { // not sucessfully edited the book
            renderEditPage(res, book, true)
        } else {
            res.redirect('/')
        }
    }
});

// delete author
router.delete('/:id', async (req, res) => {
    let book; // if we want to have access to it inside the catch we need to define this variable here

    try {
        book = await Book.findById(req.params.id);
        // remove author from data base         
        await book.remove();
        res.redirect('/books'); // using backticks because JS included
    } catch {
        if (book != null) {
            res.render('book/show', {
                book: book,
                errorMessage: 'Could not remove book'
            });
            console.log("!!! Add additional informaton why book cannot be deleted")
        } else {
            res.redirect('/')
        }
    }
})



// ************************************

async function renderFormPage(res, book, form, hasError = false) { // new or existing book -> book variabe
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        };

        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error updating book';
            }
            if (form === 'new') {
                params.errorMessage = 'Error creating book';
            }
        };

        res.render(`books/${form}`, params);
    } catch {
        res.redirect('/books');

    }
}

async function renderNewPage(res, book, hasError = false) { // new or existing book -> book variabe
    renderFormPage(res, book, 'new', hasError);
}

async function renderEditPage(res, book, hasError = false) { // new or existing book -> book variabe
    renderFormPage(res, book, 'edit', hasError);
}



function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return;

    const cover = JSON.parse(coverEncoded); // returns null if empty string or badly encoded Java Script
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type;
    }
}



module.exports = router;


/*
router.post('/', (req, res) => {
    console.log("posted Author using form script:", req.body);

    const author = new Author({
        name: req.body.name
    })
    author.save((err, newAuthor) => { // using a callback
        if(err) {
            res.render('authors/new', {
                author: author,
                errorMessage: 'Error creating author'
            })
        } else {
            //res.redirect(`authors/${newAuthor.id}`); // using backticks because JS included
            res.redirect('authors');
        }
    })
});

*/