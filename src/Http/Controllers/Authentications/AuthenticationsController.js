const autoBind = require("auto-bind")
const Router = require("express").Router();

class AuthenticationsController {
    constructor(authenticationsServices, response, accountsServices, jwt, ApiAuth){
        this.authenticationsServices = authenticationsServices
        this.response = response
        this.accountsServices = accountsServices
        this.Router = Router
        this.jwt = jwt
        this.ApiAuth = ApiAuth

        autoBind(this)
    }

    registerRoute() {
        this.Router.post('/login', this.login)
        this.Router.put('/logout', [this.ApiAuth], this.logout)

        return this.Router
    }

    async login(req, res) {
        try {
            const id = await this.accountsServices.verifyUserCredential(req.body.userName, req.body.password)

            const accessToken = await this.jwt.createAccessToken({id})
            const refreshToken = await this.jwt.createRefreshToken({id})

            await this.authenticationsServices.addToken(refreshToken)

            return this.response.success(res, {
                accessToken, refreshToken
            })
        } catch (error) {
            console.error(error)
            return this.response.error(res, "Something went wrong!")
        }
    }

    async logout(req,res){
        try {
            await this.accountsServices.updateLoginDate(req.body.userName)
            return this.response.success(res)
        } catch (error) {
            console.error(error)
            return this.response.error(res, "Something went wrong!")
        }
    }
}

module.exports = AuthenticationsController