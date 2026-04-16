import BankAccount from '../../DB/models/BankAccount.js';
import User from '../../DB/models/User.js';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { ApiError } from '../../utils/Error/ApiError.handler.js';

export const createUser = async (req) => {
  const { fullName, email, password } = req.body;
  const chk = await User.findOne({ email });
  if (chk) throw new ApiError('user already exist ', 409);
  const user = await User.create({
    fullName,
    email,
    password: await bcrypt.hash(password, 10),
  });
  const accountNumber = randomUUID();
  await BankAccount.create({ userId: user._id, accountNumber });
 const token = user.generateToken();
  return token;
};
export const logIn = async (req) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError('invalid email or password', 401);
  }
  const chkPassword = await bcrypt.compare(password, user.password);
  if (!chkPassword) {
    throw new ApiError('invalid email or password', 401);
  }
  const accessToken = user.generateToken();
  return accessToken;
};
