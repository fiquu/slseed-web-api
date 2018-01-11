/**
 * Database Config module.
 *
 * @module configs/database
 */

module.exports = {
  uri: process.env.SLSEED_DB_URI,
  options: {
    connectTimeoutMS: 3000,
    socketTimeoutMS: 3000,
    useMongoClient: true
  }
};
