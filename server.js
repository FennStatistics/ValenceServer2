const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const bodyParser = require('body-parser'); // else sended data using postman is undefined
app.use(bodyParser.json());
require('dotenv/config'); // add hidden information, .load()? see video #1 Full Stack Web Development at 16:30

// include routes
const indexRouter = require('./routes/index');


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // server rendered views
app.set('layout', 'layouts/layout'); // defining layout globally

app.use(expressLayouts);
app.use(express.static('public')); // public files

// set up server

const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', error => {
    console.error(error);
});
db.once('open', () => { // only run one time
    console.log('Connected to Mongoose!');
});

/*
// connect to DB
mongoose.connect(
    process.env.DATABASE_URL, {
        useNewUrlParser: true
    },
    () => {
        console.log('connected to DB');
    }
);
*/

app.use('/', indexRouter);


app.listen(process.env.PORT || 3000); // default port 3000, else server is listening to server using ""