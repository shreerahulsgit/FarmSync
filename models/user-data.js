// models/user-data.js
const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    uid:{
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, 
       
    },
    password: {
        type: String,
        required: true, 
    },
    channel: {
        type: String,
        required: true
    }
}); 

const user = mongoose.model('user', user_schema, 'users');

module.exports = user;