import { Router } from 'express';
import successResponse from '../../utils/responses/success.response.js';
import { UserAuth } from '../../middlewares/auth.js';
import {
  accountSummary,
  deposit,
  getMyTransactions,
  getTransaction,
  transfer,
  withdraw,
} from './Transaction.service.js';
import Validation from '../../middlewares/auth.validation.js';
import {
  depositValidation,
  getTransactionByIdValidation,
  myTransactionsValidation,
  transferValidation,
  withdrawValidation,
} from './Transaction.validation.js';
import { bankOperationRateLimit } from '../../utils/ratelimiter/ratelimit.js';

const transactionRouter = Router();
transactionRouter.get(
  '/my',
  Validation(myTransactionsValidation),
  UserAuth,
  async (req, res, next) => {
    const myTransactions = await getMyTransactions(req);
    return successResponse(res, {
      statusCode: 200,
      message: 'done',
      data: { myTransactions },
    });
  },
);
transactionRouter.get(
  '/:id',
  Validation(getTransactionByIdValidation),
  UserAuth,
  async (req, res, next) => {
    const transaction = await getTransaction(req);
    return successResponse(res, {
      statusCode: 200,
      message: 'done',
      data: { transaction },
    });
  },
);
transactionRouter.post(
  '/deposit',
  bankOperationRateLimit,
  UserAuth,
  Validation(depositValidation),
  async (req, res, next) => {
    const transaction = await deposit(req);
    return successResponse(res, {
      statusCode: 200,
      message: 'done',
      data: { transaction },
    });
  },
);
transactionRouter.post(
  '/withdraw',
  bankOperationRateLimit,
  UserAuth,
  Validation(withdrawValidation),
  async (req, res, next) => {
    const transaction = await withdraw(req);
    return successResponse(res, {
      statusCode: 200,
      message: 'done',
      data: { transaction },
    });
  },
);
transactionRouter.post(
  '/transfer',
  bankOperationRateLimit,
  Validation(transferValidation),
  UserAuth,
  async (req, res, next) => {
    const transaction = await transfer(req);
    return successResponse(res, {
      statusCode: 200,
      message: 'done',
      data: { transaction },
    });
  },
);
transactionRouter.get(
  '/my/summery',
  Validation(transferValidation),
  UserAuth,
  async (req, res, next) => {
    const transaction = await accountSummary(req);
    return successResponse(res, {
      statusCode: 200,
      message: 'done',
      data: { transaction },
    });
  },
);

export default transactionRouter;
