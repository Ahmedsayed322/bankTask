import Joi from 'joi';
import { status } from '../../utils/enums/status.enum.js';

export const changeStatusValidation = Joi.object({
  body: Joi.object({
    accountNumber: Joi.string().required().messages({
      'any.required': 'accountNumber is required',
    }),

    status: Joi.string()
      .valid(...Object.values(status))
      .required()
      .messages({
        'any.only': 'invalid status value',
        'any.required': 'status is required',
      }),
  })
    .required()
    .messages({ 'any.required': 'body is required' }),
});
