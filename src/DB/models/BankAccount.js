import mongoose, { Schema } from 'mongoose';
import { status } from '../../utils/enums/status.enum.js';

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(status),
      default: status.active,
    },
  },
  { timestamps: true },
);

const BankAccount = mongoose.model('BankAccount', schema);

export default BankAccount;
