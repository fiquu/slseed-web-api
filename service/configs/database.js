/**
 * Database Config module.
 *
 * @module configs/database
 */

module.exports = {
  uri: process.env.DB_URI,
  options: {
    promiseLibrary: Promise,
    connectTimeoutMS: 30000, // Match default HTTP timeout
    socketTimeoutMS: 30000, // Match default HTTP timeout
    useNewUrlParser: true,
    autoIndex: false, // You should use the db-indexes script to create the database indexes
    poolSize: 1 // We don't need more for each function
  }
};
