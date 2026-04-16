import BankAccount from '../../DB/models/BankAccount.js';

import { ApiError } from '../../utils/Error/ApiError.handler.js';

export const changeStatus = async (req) => {
  const { accountNumber, status } = req.body;
  const account = await BankAccount.findOneAndUpdate(
    { accountNumber },
    { status },
    { new: true },
  );
  if (!account) throw new ApiError('account not found', 404);
  return account;
};
