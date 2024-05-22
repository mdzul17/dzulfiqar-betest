const mongoose = require('mongoose')

const accountModel = new mongoose.Schema({
    accountId: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
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
        required: true,
        unique: true
    }
})

accountModel.index({accountId: 1, lastLoginDateTime: -1})

module.exports = mongoose.model('Accounts', accountModel)