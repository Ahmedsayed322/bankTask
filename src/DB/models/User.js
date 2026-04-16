import JWT from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';
import { envVars } from '../../config/config.service.js';

import { roles } from '../../utils/enums/roles.enum.js';

const schema = new Schema(
  {
    fullName: {
      type: String,
      minlength: 6,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.user,
    },
  },
  {
    timestamps: true,
  
  },
);

schema.methods.generateToken = function () {
  const { JWT_SECRET_ACCESS } = envVars;
  const token = JWT.sign(
    { _id: this._id, email: this.email, role: this.role },
    JWT_SECRET_ACCESS,
    {
      expiresIn: '7d',
    },
  );
  return token;
};

const User = mongoose.model('User', schema);

export default User;
