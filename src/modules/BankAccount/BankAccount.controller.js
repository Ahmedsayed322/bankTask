import { Router } from 'express';
import { UserAuth } from '../../middlewares/auth.js';
import successResponse from '../../utils/responses/success.response.js';
import { getBankAccountDetails, getStatement } from './BankAccount.service.js';
import Validation from '../../middlewares/auth.validation.js';
import { statementValidation } from './BankAccount.validation.js';
const bankAccountRouter = Router();
bankAccountRouter.get('/me', UserAuth, async (req, res, next) => {
  const details = await getBankAccountDetails(req);
  return successResponse(res, {
    statusCode: 200,
    message: 'done',
    data: { details },
  });
});
bankAccountRouter.get(
  '/me/statement',
  Validation(statementValidation),
  UserAuth,
  async (req, res, next) => {
    const transactions = await getStatement(req);
    return successResponse(res, {
      statusCode: 200,
      message: 'done',
      data: { transactions },
    });
  },
);
export default bankAccountRouter;
