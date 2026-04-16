import JWT from 'jsonwebtoken';
import { ApiError } from '../utils/Error/ApiError.handler.js';
import { envVars } from '../config/config.service.js';
import User from '../DB/models/User.js';



export const UserAuth = async (req, res, next) => {
  try {
    if (!req.cookies.accessToken) {
      throw new ApiError('missing access Token', 401);
    }
    const { JWT_SECRET_ACCESS } = envVars;

    const decoded = JWT.verify(req.cookies.accessToken, JWT_SECRET_ACCESS);

    const user =await User.findById(decoded._id);
    
    if (!user) {
      throw new ApiError('Unauthorized', 401);
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError('Token has expired', 401));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError('Invalid token', 401));
    }
    return next(error);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError('Unauthorized', 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError('Forbidden', 403));
    }
    next();
  };
};
