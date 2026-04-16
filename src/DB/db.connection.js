import { connect } from 'mongoose';
import { envVars } from '../config/config.service.js';

const connectDb = async () => {
  try {
    const { DB_URI } = envVars;
    await connect(DB_URI);
    console.log('db connected successfully');
  } catch (e) {
    console.log('db connection fail', e);
  }
};
export default connectDb;
