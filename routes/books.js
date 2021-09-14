const express = require('express');
const router = express.Router();
const Book = require('../models/book')
const Author = require('../models/author');


// all books route
router.get('/', async (req, res) => {
   res.send('All books');
});

// show book route
router.get('/new', async (req, res) => {
    try{
        const authors = await Author.find({});
        const book = new Book();
        res.render('books/new', {
            authors: authors, 
            book: book
        })
    } catch {
        res.redirect('/books')

    }
});

// create new book > render nothing just create
router.post('/', async (req, res) => {
    res.send('create book');
});



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