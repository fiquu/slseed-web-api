/**
 * Mailer Config module.
 *
 * @module configs/mailer
 */

module.exports = {
  sender: process.env.SLSEED_MAILER_SENDER,
  domain: process.env.SLSEED_MAILER_DOMAIN,
  key: process.env.SLSEED_MAILER_API_KEY,
  username: 'api' // Shouldn't change
};
