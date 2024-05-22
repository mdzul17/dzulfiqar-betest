const userModel = require("../Models/Users")
const { nanoid } = require("nanoid")

class UsersServices {
    constructor(CacheService, userModel) {
        this.cacheService = CacheService
        this.userModel= userModel
    }

    async getUsers() {
        try {
            const result = await this.cacheService.get(`all-user`)
            return JSON.parse(result)
        } catch (error) {
            const result = await userModel.find({})

            await this.cacheService.set(`all-user`, JSON.stringify(result))
            return result
        }
    }

    async getUserById(userId) {
        try {
            const result = await this.cacheService.get(`user:${userId}`)
            return JSON.parse(result)
        } catch (error) {
            const result = await this.userModel.findOne({ userId: userId }).exec()

            await this.cacheService.set(`user:${userId}`, JSON.stringify(result))
            return result
        }
    }

    async addUser(payload) {
        const id = `user-${nanoid(7)}`
        const result = await this.userModel.insertMany({ ...payload, userId: id })
        await this.cacheService.delete(`user-all`)

        return result[0]
    }

    async getIdByUsername(userName) {
        const result = await this.userModel.findOne({ userName: userName }).exec()
        return result
    }

    async updateUser(userId, payload) {
        const result = await this.userModel.findOneAndUpdate({ userId: userId }, { ...payload }, {
            new: true
        })

        await this.cacheService.delete(`user:${userId}`)

        return result
    }

    async deleteUser(userId) {
        const result = await this.userModel.deleteOne({ userId: userId });

        await this.cacheService.delete(`user:${userId}`)

        return result.deletedCount
    }

    async getUserByAccountNumber(accountNumber){
        const result = await this.userModel.findOne({accountNumber: accountNumber}).exec()

        return result
    }

    async getUserByRegistrationNumber(registrationNumber){
        const result = await this.userModel.findOne({registrationNumber: registrationNumber}).exec()

        return result
    }
}

module.exports = UsersServices