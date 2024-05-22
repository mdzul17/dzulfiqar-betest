const HttpResponse = require("../Utils/HttpResponse");
const { validationResult } = require("express-validator");
const httpResponse = new HttpResponse()

const validator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return httpResponse.validationError(res, errors.array());
  }
  next();
};

module.exports = validator;