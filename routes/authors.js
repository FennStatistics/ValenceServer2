const express = require('express');
const router = express.Router();

// all authors route
router.get('/', (req, res) => {
    res.render('authors/index');
});

// show new author
router.get('/new', (req, res) => {
    res.render('authors/new')
})

// create new author
router.post('/', (req, res) => {
    res.send('Create');
})



module.exports = router; 