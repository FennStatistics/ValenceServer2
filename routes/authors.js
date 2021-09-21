const express = require('express');
const router = express.Router();
const Author = require('../models/author')
const Book = require('../models/book')

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
    console.log("posted Author using form script with name:", req.body.name);

    const author = new Author({
        name: req.body.name
    })

    try {
        const newAuthor = await author.save();
        res.redirect(`/authors/${newAuthor.id}`); // using backticks because JS included
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating author'
        })
    }
});


// show author
router.get('/:id', async (req, res) => {
    try{
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: author.id }).limit(6).exec(); // limit to 6
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    }catch{
        res.redirect('/');
    }
})

// edit author
router.get('/:id/edit', async (req, res) => {

    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {
            author: author
        })
    } catch {
        res.redirect('/authors');
    }

})

// > library "method-override" -> add parameter so browser recognize if we update or delete
// update author
router.put('/:id', async (req, res) => {
    let author; // if we want to have access to it inside the catch we need to define this variable here

    try {
        author = await Author.findById(req.params.id);
        // to change the single fields of author: 
        author.name = req.body.name;

        await author.save();
        res.redirect(`/authors/${author.id}`); // using backticks because JS included
    } catch {
        if (author == null) { // if no author find
            res.redirect('/')
        } else {
            res.render('/authors/edit', {
                author: author,
                errorMessage: 'Error updating author'
            })
        }
    }
})

// delete author
router.delete('/:id', async (req, res) => {
    let author; // if we want to have access to it inside the catch we need to define this variable here

    try {
        author = await Author.findById(req.params.id);
        // remove author from data base         
        await author.remove();
        res.redirect('/authors'); // using backticks because JS included
    } catch {
        if (author == null) { // if no author found
            res.redirect('/')
        } else {
            console.log("!!! Add additional informaton why author cannot be deleted")
            res.redirect(`/authors/${author.id}`);
        }
    }
})

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