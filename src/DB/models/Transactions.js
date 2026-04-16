import mongoose, { Schema } from 'mongoose';
import { transactionTypes } from '../../utils/enums/trans.enum.js';
const schema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'BankAccount',
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(transactionTypes),
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceBefore: {
      type: Number,
      min: 0,
      required: true,
    },
    balanceAfter: {
      type: Number,
      min: 0,
      required: true,
    },
  },
  { timestamps: true },
);


const Transaction = mongoose.model('Transaction', schema);

export default Transaction;
