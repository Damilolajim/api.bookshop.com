const throwError = require("../utilities/throwError");

const validatSchema = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  return error ? next(new throwError(error.message, 400)) : next();
};

module.exports = validatSchema;
