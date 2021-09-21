const mongoose = require('mongoose');
const Book = require('./book'); // get book model

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date:  {
        type: Date, 
        default: Date.now
    }
});

authorSchema.pre('remove', function(next){ // runs method before action remove
    Book.find({ author: this.id }, (err, books) => {
        if(err){
            next(err); // if Mongoose cannot connect to database
        } else if(books.length > 0){
            next(new Error('This author has books still'));
        } else{
            next();
        }
    })
}) 
module.exports = mongoose.model('Author', authorSchema);
