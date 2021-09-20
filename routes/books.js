const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');

const fs = require('fs'); // to delete files witin file system
const path = require('path'); // to combine public and path created within book model
const uploadPath = path.join('public', Book.coverImageBasePath);
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/png'];
const multer = require('multer');
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});


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
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    console.log("posted Book using form script:", req.body);

    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        author: req.body.author,
        coverImageName: fileName
        // for file first save file in our file system and get name from there and save it to book
    })
    try {
        const newBook = await book.save();
        //res.redirect('books/${newBook.id}')
        res.redirect('/books');
    } catch {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName);
        }
        renderNewPage(res, book, true); // has error here

    }
    //res.send('create book');
});

async function renderNewPage(res, book, hasError = false) { // new or existing book -> book variabe
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book
        };

        if (hasError) {
            params.errorMessage = 'Error creating book';
        };

        res.render('books/new', params);
    } catch {
        res.redirect('/books');

    }
}


function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) {
            console.err(err); // only internal error not relevant for user
        }
    })
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