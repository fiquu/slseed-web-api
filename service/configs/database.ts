import { DatabaseClientConfig } from '@fiquu/database-manager-mongoose';
import mongoose from 'mongoose';

const { NODE_ENV, LOG_LEVEL } = process.env;

mongoose.set('debug', LOG_LEVEL === 'debug');

/**
 * Defaults have been set according to the official recommendations.
 *
 * @see https://mongoosejs.com/docs/lambda.html
 */
const config: DatabaseClientConfig = {
  uri: process.env.DB_URI,
  options: {
    promiseLibrary: Promise, // Set the native promise library
    connectTimeoutMS: 3000, // Fail quickly if can't connect
    bufferCommands: false, // Disable Mongoose buffering
    useNewUrlParser: true, // Use the new URL parser
    useCreateIndex: true, // Ensure indexes are deprecated
    bufferMaxEntries: 0, // Disable MongoDB driver buffering
    autoIndex: false, // You should use the db resync script to create the database indexes
    poolSize: NODE_ENV === 'local'
      ? 10 // Allow for some concurrency on local environments
      : 1 // We don't need more for each function on serverless environments
  }
};

export default config;
