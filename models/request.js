var mongoose = require('mongoose');

//PAGE SCHEMA
const RequestSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },

});

var Request = modules.export = mongoose.model('Request', RequestSchema); 

