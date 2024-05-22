const mongoose = require('mongoose')

const accountModel = new mongoose.Schema({
    accountId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    lastLoginDateTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    userId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Accounts', accountModel)