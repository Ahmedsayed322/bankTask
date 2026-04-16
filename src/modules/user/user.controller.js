import { Router } from 'express';
import successResponse from '../../utils/responses/success.response.js';
import { createUser, logIn } from './user.service.js';
import Validation from '../../middlewares/auth.validation.js';
import { loginValidation, registerValidation } from './user.validation.js';
import { authRateLimit } from '../../utils/ratelimiter/ratelimit.js';

const userRouter = Router();
userRouter.post(
  '/register',
  authRateLimit,
  Validation(registerValidation),
  async (req, res, next) => {
    await createUser(req);
    return successResponse(res, {
      statusCode: 201,
      message: 'user created.',
    });
  },
);
userRouter.post(
  '/login',
  authRateLimit,
  Validation(loginValidation),
  async (req, res, next) => {
    const accessToken = await logIn(req);
    res.cookie('accessToken', accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return successResponse(res, {
      statusCode: 200,
      message: 'user logged in',
    });
  },
);
export default userRouter;
