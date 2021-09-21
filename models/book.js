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
    coverImage: { // only name, files are stored in the file system
    type: Buffer, 
    required: true          
    },
    coverImageType: { // only name, files are stored in the file system
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
   if(this.coverImage != null && this.coverImageType != null){
    return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
   }
}) // derive its value from bookSchema

module.exports = mongoose.model('Book', bookSchema);