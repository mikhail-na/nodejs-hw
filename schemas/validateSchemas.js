const joi = require("joi");

const addSchema = joi.object({
  name: joi.string().required().messages({
    "any.required": `Missing required name field`,
  }),

  email: joi.string().required().messages({
    "any.required": `Missing required email field`,
  }),

  phone: joi.string().required().messages({
    "any.required": `Missing required phone field`,
  }),
  favorite: joi.boolean(),
});

const addUpdSchema = joi.object({
  name: joi.string(),
  email: joi.string(),
  phone: joi.string(),
});

const updFavoriteSchema = joi.object({
  favorite: joi.boolean().required().messages({
    "any.required": `Missing required favorite field`,
  }),
});


module.exports = {
  addSchema,
  addUpdSchema,
  updFavoriteSchema,
};
