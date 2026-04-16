import Joi from 'joi';

export const myTransactionsValidation = Joi.object({
  query: Joi.object({
    page: Joi.number().optional().min(1),
    limit: Joi.number().optional().min(5).max(20),
  }),
});
export const getTransactionByIdValidation = Joi.object({
  params: Joi.object({
    id: Joi.string().hex().length(24).required().messages({
      'string.base': 'userId must be a string',
      'string.hex': 'invalid user id',
      'string.length': 'invalid user id',
      'any.required': 'userId is required',
    }),
  }),
});
export const depositValidation = Joi.object({
  body: Joi.object({
    amount: Joi.number().min(10).required().messages({
      'number.min': 'min money to deposit should be more than 10',
    }),
  }),
});
export const withdrawValidation = Joi.object({
  body: Joi.object({
    amount: Joi.number().min(200).required().messages({
      'number.min': 'min money to withdraw should be more than 10',
    }),
  }),
});
export const transferValidation = Joi.object({
  body: Joi.object({
    amount: Joi.number().min(200).required().messages({
      'number.min': 'min money to withdraw should be more than 10',
    }),
    accountNumber: Joi.string()
      .required()
      .messages({ 'any.required': 'accountNumber is required' }),
  }),
});
