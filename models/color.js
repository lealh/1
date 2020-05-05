var mongoose = require('mongoose');

//PAGE SCHEMA
var ColorSchema = mongoose.Schema({

    color: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }

});

var Color = module.exports = mongoose.model('Color', ColorSchema); 
