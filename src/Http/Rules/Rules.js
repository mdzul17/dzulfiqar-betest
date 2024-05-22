const { body } = require("express-validator");

const Login = [
  body("userName", "field email is null or bad input").exists().isString(),
  body("password", "field password is null or bad input").exists(),
];

const Register = [
  body("userName", "field email is null or bad input").exists().isString(),
  body("password", "field password is null or bad input").exists(),
  body("fullName", "field fullname is null or bad input").exists().isString(),
  body("emailAddress", "field email is null or bad input").exists().isEmail(),
  body("registrationNumber", "field registrationNumber is null or bad input").exists().isNumeric(),
  body("accountNumber", "field accountNumber is null or bad input").exists().isNumeric()
];

module.exports = { Login, Register };