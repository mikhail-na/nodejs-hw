const joi = require("joi");

const emailRegexp = /^[\w-/.]+@([\w-]+\.)+[\w-]{2,4}$/;

const SUBSCRIPTIONS = ["starter", "pro", "business"];


const registerSchema = joi.object({
  name: joi.string().required().messages({
    "any.required": `Missing required name field`,
  }),

  email: joi.string().pattern(emailRegexp).required().messages({
    "any.required": `Missing required email field`,
  }),

  password: joi.string().required().messages({
    "any.required": `Missing required password field`,
  }),

});

const loginSchema = joi.object({
  email: joi.string().pattern(emailRegexp).required().messages({
    "any.required": `Missing required email field`,
  }),

  password: joi.string().required().messages({
    "any.required": `Missing required password field`,
  }),

});

const updSubscriptionSchema = joi.object({
  subscription: joi
    .string()
    .valid(...SUBSCRIPTIONS)
    .required(),
});

const emailSchema = joi.object({
  email: joi.string().pattern(emailRegexp).required().messages({
    "any.required": `Missing required email field`,
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  updSubscriptionSchema,
  emailSchema,
};