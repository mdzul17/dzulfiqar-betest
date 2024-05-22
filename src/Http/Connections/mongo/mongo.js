const Connections = require("../Connections");
const mongoose = require("mongoose")
require("dotenv").config()

class Mongo extends Connections {
    async connect() {
        try {
            return mongoose.connect(process.env.MONGO_SERVER);
        } catch (error) {
            throw new Error("MONGODB_CONNECTION.FAILED_TO_CONNECT")
        }
    }
}

module.exports = Mongo