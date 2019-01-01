/**
 * Mailer config module.
 *
 * @module configs/mailer
 */

module.exports = {
  testMode: process.env.NODE_ENV === 'testing',
  sender: process.env.MAILER_SENDER,
  domain: process.env.MAILER_DOMAIN,
  apiKey: process.env.MAILER_API_KEY
};
