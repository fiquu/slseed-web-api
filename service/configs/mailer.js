/**
 * Mailer Config module.
 *
 * @module configs/mailer
 */

module.exports = {
  sender: process.env.MAILER_SENDER,
  domain: process.env.MAILER_DOMAIN,
  key: process.env.MAILER_API_KEY,
  username: 'api' // Shouldn't change
};
