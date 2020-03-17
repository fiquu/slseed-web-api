import { DatabaseClientConfig } from '@fiquu/database-manager-mongoose';
import mongoose from 'mongoose';

const { NODE_ENV } = process.env;

mongoose.set('debug', !['production', 'testing'].includes(NODE_ENV));

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
    bufferMaxEntries: 0, // Disable MongoDB driver buffering
    autoIndex: false, // You should use the db-indexes setup script to create the database indexes
    poolSize: NODE_ENV === 'local'
      ? 10 // Allow for some concurrency while developing
      : 1 // We don't need more for each function on production environments
  }
};

export default config;
