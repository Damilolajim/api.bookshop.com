const throwError = require("../utilities/throwError");

exports.validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  return error ? next(new throwError(error.message, 400)) : next();
};
