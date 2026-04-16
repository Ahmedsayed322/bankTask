import rateLimit from 'express-rate-limit';

export const GlobalRateLimit = rateLimit({
  limit: 100,
  windowMs: 1000 * 60 * 15,
  message: { message: 'Too many requests, try again later' },
  standardHeaders: true,
});
export const authRateLimit = rateLimit({
  limit: 5,
  windowMs: 3 * 60 * 1000,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const bankOperationRateLimit = rateLimit({
  limit: 10,
  windowMs: 15 * 60 * 1000,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
