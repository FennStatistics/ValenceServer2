const express = require('express');
const router = express.Router();
const Author = require('../models/author')

// all authors route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') { // if it is an empty string we do not filter by it
        searchOptions.name = new RegExp(req.query.name, 'i'); // case insensitive
    }
    try {
        const authors = await Author.find(searchOptions); // no conditions
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        });

    } catch {
        res.redirect('/');
    }
});

// show new author
router.get('/new', (req, res) => {
    res.render('authors/new', {
        author: new Author()
    })
});

// create new author > render nothing just create
router.post('/', async (req, res) => {
    console.log("posted Author using form script:", req.body);

    const author = new Author({
        name: req.body.name
    })

    try {
        const newAuthor = await author.save();
        //res.redirect(`authors/${newAuthor.id}`); // using backticks because JS included
        res.redirect('authors');
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        })
    }



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