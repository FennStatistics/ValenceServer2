const express = require('express');
const router = express.Router();

// all tests route
router.get('/', async (req, res) => {
    res.send("hallo Welt");
    //res.render('testsidebar.html')
});


module.exports = router;