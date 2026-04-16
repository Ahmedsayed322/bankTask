import express from 'express';
import { envVars } from './config/config.service.js';
import connectDb from './DB/db.connection.js';
import { GlobalErrorHandler } from './middlewares/GlobalErrors.Handler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ApiError } from './utils/Error/ApiError.handler.js';
import userRouter from './modules/user/user.controller.js';
import bankAccountRouter from './modules/BankAccount/BankAccount.controller.js';
import transactionRouter from './modules/transactions/Transaction.controller.js';
import rateLimit from 'express-rate-limit';
import { GlobalRateLimit } from './utils/ratelimiter/ratelimit.js';
import adminRouter from './modules/admin/admin.controller.js';
import { authorize, UserAuth } from './middlewares/auth.js';

const bootstrap = async () => {
  const app = express();

  await connectDb();
  const port = envVars.port;
  const whiteList = ['http://localhost:4200'];

  const originConfig = {
    origin: (origin, cb) => {
      if (!origin || whiteList.includes(origin)) {
        return cb(null, true);
      }
      return cb(new ApiError('origin block', 403), false);
    },
    credentials: true,
  };

  app.use(cors(originConfig));
  app.use(express.json(), GlobalRateLimit);
  app.use(cookieParser());
  app.use('/auth', userRouter);
  app.use('/admin', UserAuth, authorize('admin'), adminRouter);
  app.use('/accounts', bankAccountRouter);
  app.use('/transaction', transactionRouter);
  app.use(GlobalErrorHandler);
  app.listen(port, () => console.log(`listening on http://localhost:${port}`));
};
export default bootstrap;
