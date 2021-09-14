const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description:  {
        type: String, 
        required: false
    },
    publishDate:  {
        type: Date, 
        required: true
    },
    pageCount:  {
        type: Number, 
        required: true
    },
    createdAtDate:  {
        type: Date, 
        required: true,
        default: Date.now()
    },
    coverImageName: { // only name, files are stored in the file system
    type: String, 
    required: true          
    },
    author: {
    type: mongoose.Schema.Types.ObjectId, // reference to another object in our collection
    required: true,
    ref: 'Author' // referencing author collection       
    }
});


module.exports = mongoose.model('Book', bookSchema);
