// models/message-data.js
const mongoose = require('mongoose');

const message_schema = new mongoose.Schema({
    uid:{
        type: String,
        required: true,
        unique: true
    },
    user:{
        type: String,
        required: true,
    },
    content: {
        type: String
    },
    channel: {
        type: String,
    },
    timestamp: {
        type: Date,
    }
}); 

const user = mongoose.model('message', message_schema, 'messages');

module.exports = user;