import mongoose from 'mongoose';
import BankAccount from '../../DB/models/BankAccount.js';
import Transaction from '../../DB/models/transactions.js';
import { status } from '../../utils/enums/status.enum.js';
import { transactionTypes } from '../../utils/enums/trans.enum.js';
import { ApiError } from '../../utils/Error/ApiError.handler.js';

export const getMyTransactions = async (req) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const skip = (page - 1) * limit;
  const myBankAccount = await BankAccount.findOne({ userId: req.user._id });
  if (!myBankAccount) {
    throw new ApiError('cannot find Bank Account', 404);
  }
  const trans = await Transaction.find({ accountId: myBankAccount._id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  if (!trans.length) {
    throw new ApiError('no previous transactions', 404);
  }
  return trans;
};
export const getTransaction = async (req) => {
  const { id } = req.params;
  const myBankAccount = await BankAccount.findOne({ userId: req.user._id });
  if (!myBankAccount) {
    throw new ApiError('cannot find bank account', 404);
  }
  const transaction = await Transaction.findById(id);
  if (!transaction || !transaction.accountId.equals(myBankAccount._id)) {
    throw new ApiError('transaction not found', 404);
  }

  return transaction;
};
export const deposit = async (req) => {
  const { amount } = req.body;
  const myBankAccount = await BankAccount.findOne({ userId: req.user._id });
  if (!myBankAccount) {
    throw new ApiError('cannot find bank account', 404);
  }
  if (
    myBankAccount.status === status.frozen ||
    myBankAccount.status === status.inActive
  ) {
    throw new ApiError('your account is frozen or its inactive', 400);
  }
  const balanceBefore = myBankAccount.balance;
  const balanceAfter = myBankAccount.balance + amount;
  const transaction = await Transaction.create({
    amount,
    accountId: myBankAccount._id,
    type: transactionTypes.deposit,
    balanceBefore,
    balanceAfter,
  });
  await BankAccount.updateOne(
    { _id: myBankAccount._id },
    { balance: balanceAfter },
  );
  return transaction;
};
export const withdraw = async (req) => {
  const { amount } = req.body;
  const myBankAccount = await BankAccount.findOne({ userId: req.user._id });
  if (!myBankAccount) {
    throw new ApiError('cannot find bank account', 404);
  }
  if (
    myBankAccount.status === status.frozen ||
    myBankAccount.status === status.inActive
  ) {
    throw new ApiError('your account is frozen or its inactive', 400);
  }
  if (amount > myBankAccount.balance) {
    throw new ApiError('insufficient balance', 400);
  }
  const balanceBefore = myBankAccount.balance;
  const balanceAfter = myBankAccount.balance - amount;
  const transaction = await Transaction.create({
    amount,
    accountId: myBankAccount._id,
    type: transactionTypes.withdraw,
    balanceBefore,
    balanceAfter,
  });
  myBankAccount.balance = balanceAfter;
  await BankAccount.updateOne(
    { _id: myBankAccount._id },
    { balance: balanceAfter },
  );
  return transaction;
};
export const transfer = async (req) => {
  const { amount, accountNumber } = req.body;
  const myBankAccount = await BankAccount.findOne({ userId: req.user._id });
  if (!myBankAccount) {
    throw new ApiError('cannot find bank account', 404);
  }
  if (accountNumber === myBankAccount.accountNumber) {
    throw new ApiError('you cant send money to yourself', 400);
  }

  if (
    myBankAccount.status === status.frozen ||
    myBankAccount.status === status.inActive
  ) {
    throw new ApiError('your account is frozen or its inactive', 400);
  }
  if (amount > myBankAccount.balance) {
    throw new ApiError('insufficient balance', 400);
  }
  const receiver = await BankAccount.findOne({ accountNumber });
  if (!receiver) {
    throw new ApiError('account not found', 404);
  }
  if (
    receiver.status === status.frozen ||
    receiver.status === status.inActive
  ) {
    throw new ApiError('receiver account is frozen or its inactive', 400);
  }
  const senderBalanceBefore = myBankAccount.balance;
  const senderBalanceAfter = myBankAccount.balance - amount;
  const receiverBalanceBefore = receiver.balance;
  const receiverBalanceAfter = receiver.balance + amount;
  const [senderTransaction, receiverTransaction] = await Promise.all([
    Transaction.create({
      amount,
      accountId: myBankAccount._id,
      type: transactionTypes.transferOut,
      balanceBefore: senderBalanceBefore,
      balanceAfter: senderBalanceAfter,
    }),
    Transaction.create({
      amount,
      accountId: receiver._id,
      type: transactionTypes.transferIn,
      balanceBefore: receiverBalanceBefore,
      balanceAfter: receiverBalanceAfter,
    }),
  ]);
  await Promise.all([
    BankAccount.updateOne(
      { _id: myBankAccount._id },
      { balance: senderBalanceAfter },
    ),
    BankAccount.updateOne(
      { _id: receiver._id },
      { balance: receiverBalanceAfter },
    ),
  ]);
  return senderTransaction;
};
export const accountSummary = async (req) => {
  const myBankAccount = await BankAccount.findOne({ userId: req.user._id });
  if (!myBankAccount) {
    throw new ApiError('cannot find bank account', 404);
  }
  const transactions = await Transaction.find({
    accountId: myBankAccount._id,
  });
  let totalDeposits = 0;
  let totalWithdraw = 0;
  let totalTransferIn = 0;
  let totalTransferOut = 0;
  for (const transaction of transactions) {
    if (transaction.type === transactionTypes.deposit) {
      totalDeposits += transaction.amount;
    } else if (transaction.type === transactionTypes.withdraw) {
      totalWithdraw += transaction.amount;
    } else if (transaction.type === transactionTypes.transferIn) {
      totalTransferIn += transaction.amount;
    } else if (transaction.type === transactionTypes.transferOut) {
      totalTransferOut += transaction.amount;
    }
  }
  return {
    balance: myBankAccount.balance,
    totalDeposits,
    totalWithdraw,
    totalTransferIn,
    totalTransferOut,
  };
};
