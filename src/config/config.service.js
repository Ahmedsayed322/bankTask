import { configDotenv } from 'dotenv';
import { resolve } from 'path';

configDotenv({ path: resolve('./src/config/.env') });
const port = process.env.PORT;
const DB_URI = process.env.DB_URI;
const NODE_ENV = process.env.NODE_ENV;
const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS;

export const envVars = {
  port,
  DB_URI,
  NODE_ENV,
  JWT_SECRET_ACCESS,
};
