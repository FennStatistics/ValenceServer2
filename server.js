const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');

const bodyParser = require('body-parser'); // else sended data using postman is undefined
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {limit: '10mb', extended: false} ));


if(process.env.NODE_ENV !== 'production'){
    require('dotenv/config'); // add hidden information, using if condition to set false if not uploaded on heroku
}



// include routes
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');


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

// use included routes
app.use('/', indexRouter);
app.use('/authors', authorRouter);


app.listen(process.env.PORT || 3000); // default port 3000, else server is listening to server using ""