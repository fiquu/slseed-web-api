/**
 * Mailer Component module.
 *
 * @module components/mailer
 */

const mailgun = require('mailgun.js');
const path = require('path');

const config = require('../configs/mailer');
const views = require('./views');

/**
 * Sends the message.
 *
 * @param {Object} message The message data to send.
 *
 * @returns {Promise} The send promise.
 */
function send(message) {
  const data = Object.assign({}, message);

  const mailer = mailgun.client({
    username: config.username,
    key: config.key
  });

  if (!message.from) {
    data.from = config.sender;
  }

  if (!Array.isArray(message.to)) {
    data.to = [data.to];
  }

  return mailer.messages.create(config.domain, data).then(
    res => {
      console.log(`${data.from} --> ${data.to}`, res);
      return res;
    },
    err => {
      console.error(err);
      throw err;
    }
  );
}

/**
 * Sends a welcome message to the user.
 *
 * This is an example on how to send an email template.
 *
 * @param {Object} user The User data.
 *
 * @returns {Promise} The Mailgun send promise.
 */
function sendWelcome(user) {
  const template = path.join('emails', 'confirmation'); // It actually doesn't exists
  const data = Object.assign({}, { data: user }); // Never pass raw data

  // TODO: Localize!
  const message = {
    subject: `Hello, ${user.name}!`,
    from: config.sender,
    to: user.citizen.email,
    html: views.render(template, data)
  };

  return send(message);
}

module.exports = {
  sendWelcome,
  send
};
