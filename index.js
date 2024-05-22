require("dotenv").config();

let express = require("express");
let app = express();
let routeApi = require("./src/Http/Controllers/api");
let bodyParser = require("body-parser");
const cors = require("cors");
const Connection = require('./src/Http/Connections/mongo/mongo')

const connection = new Connection();
const port = process.env.PORT || 1337;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", routeApi);

connection.connect().then(() => {
    app.listen(port, () => console.log("listening on port " + port));
}).catch((err) => {
    console.error("Connection error: ", err)
})

module.exports = app;
