const Joi = require("joi");

const NUMBER_SCHEMA = Joi.number();
const STRING_SCHEMA = Joi.string().trim();
const NAME_SCHEMA = STRING_SCHEMA.required().min(3).max(25);

const requiredSchema = (schema) => schema.required();

exports.cartsSchema = Joi.array().items({
  course_id: requiredSchema(NAME_SCHEMA),
  quantity: requiredSchema(NUMBER_SCHEMA),
});

exports.cartSchema = Joi.object({
  course_id: requiredSchema(NAME_SCHEMA),
  quantity: requiredSchema(NUMBER_SCHEMA),
});
