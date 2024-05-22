const mongoose = require('mongoose')

const authenticationModel = new mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
        unique: true
    }
})

authenticationModel.index({refreshToken: 1})

module.exports = mongoose.model('Authentications', authenticationModel)