import { parseOneAddress, ParsedMailbox } from 'email-addresses';
import { SendTemplatedEmailRequest } from 'aws-sdk/clients/ses';
import { SES } from 'aws-sdk';

import config from '../configs/mailer';

/**
 * @param {string} input The input friendly email address.
 *
 * @returns {string} The encoded friendly email address.
 */
function encodeFriendlyAddress(input: string): string {
  const params: emailAddresses.Options = {
    simple: true,
    input
  };

  const { address, name } = parseOneAddress(params) as ParsedMailbox;

  if (name) {
    const base64Name = Buffer.from(name).toString('base64');

    return `=?UTF-8?B?${base64Name}?= <${address}>`;
  }

  return address;
}

/**
 * Sends an email message.
 *
 * @param {object} params The params to send the email with.
 *
 * @returns {Promise<object>} A promise to the sending.
 */
export function send(params: SendTemplatedEmailRequest) {
  const sender = new SES();
  const _params: SendTemplatedEmailRequest = {
    ...params,
    Source: encodeFriendlyAddress(config.sender)
  };

  // Encode special characters on friendly email addresses.
  _params.Destination.ToAddresses = params.Destination.ToAddresses.map(addr => {
    return encodeFriendlyAddress(addr);
  });

  return sender.sendTemplatedEmail(_params).promise();
}

/**
 * Here you could add convenience methods like `sendWelcome` or `sendPasswordChanged` with predefined params and then
 * call the `send` method with such params.
 */
