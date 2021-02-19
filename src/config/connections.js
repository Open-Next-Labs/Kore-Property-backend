import 'dotenv/config';
import mongoose from 'mongoose';
import logger from '../helpers/logger';

const { NODE_ENV, DATABASE_URL, DATABASE_URL_TEST } = process.env;

const envs = {
  test: DATABASE_URL_TEST,
  development: DATABASE_URL,
  production: DATABASE_URL,
};

const connect = async () => {
  try {
    await mongoose.connect(envs[NODE_ENV] || envs.development, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    logger.info('Database connected');
  } catch (error) {
    logger.error(error);
  }
};

export default {
  connect,
};
