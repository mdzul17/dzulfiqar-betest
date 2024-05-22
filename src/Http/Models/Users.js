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

userModel.index({userId: 1, fullName: 1, accountNumber: 1, registrationNumber: 1})

module.exports = mongoose.model('Users', userModel)