import Joi from 'joi';

export const registerValidation = Joi.object({
  body: Joi.object({
    fullName: Joi.string().required().min(6).messages({
      'any.required': 'fullName is required',
      'string.empty': 'fullName cannot be empty',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'invalid email',
      'any.required': 'email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'any.required': 'password is required',
      'string.min': 'password must be at least 6 characters',
    }),
  }).required().messages({
    'any.required': 'body is required',
  }),
});
export const loginValidation = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'invalid email',
      'any.required': 'email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'any.required': 'password is required',
      'string.min': 'password must be at least 6 characters',
    }),
  })
    .required()
    .messages({
      'any.required': 'body is required',
    }),
});
