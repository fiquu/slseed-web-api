/**
 * Mailer component module.
 *
 * @module components/mailer
 */

const mailgun = require('mailgun-js');
const path = require('path');

const config = require('../configs/mailer');
const views = require('./views');

/**
 * Mailer class.
 *
 * @class Mailer
 */
class Mailer {
  /**
   * Sends the message.
   *
   * @param {Object} message The message data to send.
   *
   * @returns {Promise} The send promise.
   */
  static async send(message) {
    const data = { ...message }; // Clone source

    if (!message.from) {
      data.from = config.sender;
    }

    if (!Array.isArray(message.to)) {
      data.to = [data.to];
    }

    try {
      const res = await mailgun(config)
        .messages()
        .send(config.domain, data);

      console.log(`${data.from} --> ${data.to}`, res);

      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * Sends a message to the target email address.
   *
   * This is an example on how to send an email template.
   *
   * @param {Object} recipient The recipient's data.
   *
   * @returns {Promise} The Mailgun send promise.
   */
  static async sendMessage(recipient) {
    const template = path.join('emails', 'default');

    // TODO: Localize!
    const message = {
      subject: `Hello, ${recipient.name}!`,
      from: config.sender,
      to: recipient.email,
      html: views.render(template, {
        data: {
          ...recipient // Never pass raw data
        }
      })
    };

    return await this.send(message);
  }
}

module.exports = Mailer;
