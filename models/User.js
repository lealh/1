const mongoose = require('mongoose');

//PAGE SCHEMA
const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin:{
        type: Number,
    },

});

const User = mongoose.model('User', UserSchema); 

module.exports = User;
