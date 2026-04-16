import { envVars } from '../config/config.service.js';

export const GlobalErrorHandler = async (err, req, res, next) => {


  const statusCode = err.statusCode || 500;

  const message = statusCode < 500 ? err.message : 'Internal Server Error';

  const response = { message };

  if (statusCode >= 500 && envVars.NODE_ENV === 'development') {
    response.name = err.name;
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};
