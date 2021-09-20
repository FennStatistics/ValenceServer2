const mongoose = require('mongoose');
const coverImageBasePath = 'uploads/bookCovers';

const path = require('path');

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

bookSchema.virtual('coverImagePath').get(function(){ // using function to have access to the "this" property
   if(this.coverImageName != null){
    return path.join('/', coverImageBasePath, this.coverImageName); // roots folder is public: / 
   }
}) // derive its value from bookSchema

module.exports = mongoose.model('Book', bookSchema);
module.exports.coverImageBasePath = coverImageBasePath;



