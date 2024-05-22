const mongoose = require('mongoose')

const authenticationModel = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Authentications', authenticationModel)