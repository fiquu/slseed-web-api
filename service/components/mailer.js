/**
 * Mailer component module.
 *
 * @module components/mailer
 */

const AWS = require('aws-sdk');
const log = require('./logger')('Mailer');

const config = require('../configs/mailer');

AWS.config.update({ region: config.region });

/**
 * Sends the message.
 *
 * @param {Object} message The message data to send.
 *
 * @returns {Promise} The send promise.
 */
async function send (message) {
  const data = { ...message }; // Clone source

  if (!data.from) {
    data.from = [config.sender];
  }

  if (!Array.isArray(data.to)) {
    data.to = [data.to];
  }

  // Create sendEmail params
  const params = {
    ReplyToAddresses: data.from,
    Source: config.sender,
    Destination: {
      CcAddresses: data.cc || [],
      ToAddresses: data.to
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: data.body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: data.subject
      }
    }
  };

  const ses = new AWS.SES({
    apiVersion: '2010-12-01'
  });

  try {
    const res = await ses.sendEmail(params).promise();

    log.debug(`Sent message from "${data.from}" to "${data.to}" with ID "${data.MessageId}"`);

    return res;
  } catch (err) {
    log.error(err);
    throw err;
  }
}

module.exports = {
  send
};
