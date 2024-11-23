const Joi = require("joi");

const NUMBER_SCHEMA = Joi.number();
const STRING_SCHEMA = Joi.string().trim();
const NAME_SCHEMA = STRING_SCHEMA.required().min(3).max(25);

const requiredSchema = (schema) => schema.required();
const optionalSchema = (schema) => schema.optional();

exports.courseSchema = Joi.object({
  subject: requiredSchema(NAME_SCHEMA),
  location: requiredSchema(NAME_SCHEMA),
  price: requiredSchema(NUMBER_SCHEMA),
  spaces: requiredSchema(NUMBER_SCHEMA),
});

exports.updateCourseSchema = Joi.object({
  subject: optionalSchema(NAME_SCHEMA),
  location: optionalSchema(NAME_SCHEMA),
  price: optionalSchema(NUMBER_SCHEMA),
  spaces: optionalSchema(NUMBER_SCHEMA),
});
