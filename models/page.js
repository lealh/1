var mongoose = require('mongoose');

//PAGE SCHEMA
var PageSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
    },
    content: {
        type: String,
        required: true
    },
    sorting: {
        type: Number,
        required: true
    },
})

var Page = module.exports = mongoose.model('Page', PageSchema); 
