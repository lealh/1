var mongoose = require('mongoose');

//Found Items SCHEMA
var FoundItemsSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    place:{
        type: String,
        required:true
    },
    image:{
        type: String
    }
})

var foundItems = module.exports = mongoose.model('foundItems', FoundItemsSchema); 
