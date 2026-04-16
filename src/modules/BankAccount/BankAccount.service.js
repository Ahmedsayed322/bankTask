import BankAccount from '../../DB/models/BankAccount.js';
import Transaction from '../../DB/models/transactions.js';
import { ApiError } from '../../utils/Error/ApiError.handler.js';

export const getBankAccountDetails = async (req) => {
  const details = await BankAccount.findOne({ userId: req.user._id });
  if (!details) throw new ApiError('BankAccount not found', 404);
  return details;
};
export const getStatement = async (req) => {
  const { from, to } = req.query;
  if (new Date(from) > new Date(to)) {
    throw new ApiError('from date must be before to date', 400);
  }
  const bankAccount = await BankAccount.findOne({ userId: req.user._id });

  if (!bankAccount) {
    throw new ApiError('cannot fin bank account', 404);
  }

  const transactions = await Transaction.find({
    accountId: bankAccount._id,
    createdAt: {
      $gte: new Date(from),
      $lte: new Date(to),
    },
  }).sort({ createdAt: -1 });
  return {
    balance: bankAccount.balance,
    numberOfTransactions: transactions.length,
    transactions,
  };
};
