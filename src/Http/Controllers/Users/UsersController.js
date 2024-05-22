const autoBind = require("auto-bind")
const Router = require("express").Router();
const Rules = require("../../Rules/Rules")

class UsersController {
    constructor(usersServices, accountsServices, ApiAuth, response, Validator){
        this.usersServices = usersServices
        this.response = response
        this.accountsServices = accountsServices
        this.Router = Router
        this.ApiAuth = ApiAuth
        this.Rules = Rules
        this.Validator = Validator

        autoBind(this)
    }

    registerRoute() {
        this.Router.get('/', [this.ApiAuth], this.getUsers)
        this.Router.get('/:id', [this.ApiAuth], this.getUserById)
        this.Router.post('/', [this.Rules.Register, this.Validator],this.addUser)
        this.Router.put('/:id', [this.ApiAuth], this.updateUser)
        this.Router.delete('/:id', [this.ApiAuth], this.deleteUser)        
        this.Router.get('/registration-number/:registrationNumber',[this.ApiAuth], this.getUserByRegistrationNumber)
        this.Router.get('/account-number/:accountNumber',[this.ApiAuth], this.getUserByAccountNumber)

        return this.Router
    }

    async getUsers(req, res) {
        try {
            const result = await this.usersServices.getUsers()

            return this.response.success(res, result)
        } catch (error) {
            console.error(error)
            return this.response.error(res, "Something went wrong!")
        }
    }

    async addUser(req, res){
        try {
        const accountPayload = {
            userName: req.body.userName,
            password: req.body.password
        }

        const userPayload = {
            fullName: req.body.fullName,
            accountNumber: req.body.accountNumber,
            emailAddress: req.body.emailAddress,
            registrationNumber: req.body.registrationNumber
        }
            const userResult = await this.usersServices.addUser( userPayload )
            const accountResult = await this.accountsServices.addAccount({ ...accountPayload, userId: userResult.userId})

            return this.response.success(res, `${accountResult.userName} has successfully added!`)
        } catch (error) {
            console.error(error)
            return this.response.error(res, "Something went wrong!")
        }
    }

    async getUserById(req, res) {
        try {
            const result = await this.usersServices.getUserById(req.params.id)

            return this.response.success(res, result)
        } catch (error) {
            console.error(error)
            return this.response.error(res, "Something went wrong!")
        }
    }

    async updateUser(req,res){
        try {
            const result = await this.usersServices.updateUser(req.params.id, req.body)

            return this.response.success(res, result)
        } catch (error) {
            console.error(error)
            return this.response.error(res, "Something went wrong!")
        }
    }

    async deleteUser(req, res){
        try {
            const result = await this.usersServices.deleteUser(req.params.id, req.body)

            return this.response.success(res, result)
        } catch (error) {
            console.error(error)
            return this.response.error(res, "Something went wrong!")
        }
    }

    async getUserByAccountNumber(req, res){
        try {
            const result = await this.usersServices.getUserByAccountNumber(req.params.accountNumber)

            return this.response.success(res, result)
        } catch (error) {
            console.error(error)
            return this.response.error(res, "Something went wrong!")
        }
    }

    async getUserByRegistrationNumber(req, res){
        try {
            const result = await this.usersServices.getUserByRegistrationNumber(req.params.registrationNumber)

            return this.response.success(res, result)
        } catch (error) {
            console.error(error)
            return this.response.error(res, "Something went wrong!")
        }
    }
}

module.exports = UsersController