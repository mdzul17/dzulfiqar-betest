const authenticationModel = require("../Models/Authentications")

class AuthenticationsServices {
    constructor(authenticationModel) {
        this.authenticationModel = authenticationModel
    }

    async checkAvailabilityToken(token) {
        await this.authenticationModel.findOne({ refreshToken: token }).exec()
    }

    async addToken(token) {
        const result = await this.authenticationModel.insertMany({ refreshToken: token })

        return result[0]
    }
}

module.exports = AuthenticationsServices