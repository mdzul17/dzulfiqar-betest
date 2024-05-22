const express = require("express");
const app = express();

// Models
const accountModel = require("../Models/Accounts")
const authenticationModel = require("../Models/Authentications")
const userModel = require("../Models/Users")

// Services
const AuthenticationsServices = require("../Services/AuthenticationsServices")
const AccountsServices = require("../Services/AccountsServices")
const UsersServices = require("../Services/UsersServices")

// Controller
const UserController = require("./Users/UsersController");
const AccountController = require("./Accounts/AccountsController");
const AuthenticationController = require("./Authentications/AuthenticationsController");

// Utils
const CacheServices = require("../Utils/CacheServices")
const HttpResponse = require("../Utils/HttpResponse")
const JwtTokenManager = require("../Utils/JwtTokenManager")

const ApiAuth = require("../Middleware/ApiAuth")
const Validator = require("../Middleware/Validator")

// Initialize
const authenticationsServices = new AuthenticationsServices(authenticationModel)
const accountsServices = new AccountsServices(accountModel)
const cacheServices = new CacheServices()
const usersServices = new UsersServices(cacheServices, userModel)
const response = new HttpResponse()
const jwt = new JwtTokenManager()


app.use("/users", new UserController(usersServices, accountsServices, ApiAuth, response, Validator).registerRoute());
app.use("/accounts", new AccountController(usersServices, response, accountsServices, ApiAuth).registerRoute());
app.use("/authentications", new AuthenticationController(authenticationsServices, response, accountsServices, jwt, ApiAuth).registerRoute());

module.exports = app;
