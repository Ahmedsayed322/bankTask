import Joi from 'joi';
export const statementValidation = Joi.object({
  query: Joi.object({
    from: Joi.date().required(),
    to: Joi.date().required(),
  }),
});
