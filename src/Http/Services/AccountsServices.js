// const accountModel = require("../Models/Accounts")
const {nanoid} = require("nanoid")
const bcrypt = require("bcrypt")

class AccountsServices {
    constructor(accountModel) {
        this.accountModel = accountModel
        // console.log(accountModel)

    }
    async getAccounts() {
        const result = await this.accountModel.find({})
        return result
    }

    async getAccountById(accountId) {
        const result = await this.accountModel.findOne({ accountId: accountId }).exec()

        return result
    }

    async addAccount(payload) {
        const id = `account-${nanoid(7)}`
        const hashedPassword = await bcrypt.hash(payload.password, 10)
        const result = await this.accountModel.insertMany({ ...payload, accountId: id, password: hashedPassword })

        return result[0]
    }

    async getIdByUsername(userName) {
        const result = await this.accountModel.findOne({ userName: userName }).exec()

        return result
    }

    async updateAccount(accountId, payload) {
        const hashedPassword = await bcrypt.hash(payload.password, 10)
        const result = await this.accountModel.findOneAndUpdate({ accountId: accountId }, { ...payload, password: hashedPassword }, {
            new: true
          })

        return result
    }

    async updateLoginDate(userName){
        const result = await this.accountModel.findOneAndUpdate({userName: userName}, { $currentDate: {
            lastLoginDateTime: true
        }})
        return result
    }

    async deleteAccount(accountId){
        const result = await this.accountModel.deleteOne({accountId:accountId});

        return result.deletedCount
    }

    async verifyUserCredential(userName, password){
        const result = await this.accountModel.findOne({ userName: userName }).exec()

        if(!result){
            throw new Error("Wrong password!")
        }

        const hashedPassword = result.password

        const match = await bcrypt.compare(password, hashedPassword)

        if(!match){
            throw new Error("Wrong password!")
        }

        return result.accountId
    }

    async getLast3DaysLogin(){
        let threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

        const result = await this.accountModel.find({lastLoginDateTime: {$lt: threeDaysAgo }}).exec()
        console.log(result)
        return result
    }
}

module.exports = AccountsServices