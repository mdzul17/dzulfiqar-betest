const autoBind = require("auto-bind")
const Router = require("express").Router();

class AccountsController {
    constructor(usersServices, response, accountsServices, ApiAuth){
        this.usersServices = usersServices
        this.response = response
        this.accountsServices = accountsServices
        this.Router = Router
        this.ApiAuth = ApiAuth
        

        autoBind(this)
    }

    registerRoute() {
        this.Router.get('/', [this.ApiAuth], this.getAccounts)
        this.Router.get('/:id', [this.ApiAuth],this.getAccountById)
        this.Router.put('/:id',[this.ApiAuth], this.updateAccount)    
        this.Router.get('/3days/login',[this.ApiAuth], this.getAccountsLast3DaysLogin)

        return this.Router
    }

    async getAccounts(req, res) {
        try {
            const result = await this.accountsServices.getAccounts()

            return this.response.success(res, result)
        } catch (error) {
            console.error(error)
            return this.response.error(res, "Something went wrong!")
        }
    }

    async getAccountById(req, res) {
        try {
            const result = await this.accountsServices.getAccountById(req.params.id)

            return this.response.success(res, result)
        } catch (error) {
            console.error(error)
            return this.response.error(res, "Something went wrong!")
        }
    }

    async updateAccount(req,res){
        try {
            const result = await this.accountsServices.updateAccount(req.params.id, req.body)

            return this.response.success(res, result)
        } catch (error) {
            console.error(error)
            return this.response.error(res, "Something went wrong!")
        }
    }

    async getAccountsLast3DaysLogin(req, res){
        try {
            const result = await this.accountsServices.getLast3DaysLogin()
            return this.response.success(res, result)
        } catch (error) {
            console.error(error)
            return this.response.error(res, "Something went wrong!")
        }
    }
}

module.exports = AccountsController