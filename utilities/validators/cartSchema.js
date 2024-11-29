const Joi = require("joi");

const STRING_SCHEMA = Joi.string().trim();
const EMAIL_SCHEMA = STRING_SCHEMA.email().required();
const NAME_SCHEMA = STRING_SCHEMA.min(3).max(25).required();
const OBJECT_ID_SCHEMA = STRING_SCHEMA.pattern(/^[0-9a-fA-F]{24}$/).required();
const NUMBER_SCHEMA = Joi.number().integer().positive().required();

const requiredSchema = (schema) => schema.required();

exports.cartsSchema = Joi.array().items({
  course_id: requiredSchema(NAME_SCHEMA),
  quantity: requiredSchema(NUMBER_SCHEMA),
});

exports.cartSchema = Joi.object({
  course_id: requiredSchema(NAME_SCHEMA),
  quantity: requiredSchema(NUMBER_SCHEMA),
});

exports.checkoutSchema = Joi.object({
  name: requiredSchema(NAME_SCHEMA),
  email: requiredSchema(EMAIL_SCHEMA),
  carts: this.cartsSchema,
});
