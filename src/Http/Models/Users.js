const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: Number,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Users', userModel)