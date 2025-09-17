const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user'
    }
},{timestamps: true});

const User = mongoose.models.User || mongoose.model('User', userScheme);
module.exports = User;
