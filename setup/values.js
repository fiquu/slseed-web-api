/**
 * Main Stack Values.
 *
 * @module setup/values
 */

module.exports = () => [
  {
    name: 'dbUri',
    type: 'input',
    message: 'Database Connection URI:'
  },
  {
    name: 'mailerApiKey',
    type: 'input',
    message: 'Mailer API Key:'
  },
  {
    name: 'mailerSender',
    type: 'input',
    message: 'Mailer Sender:'
  },
  {
    name: 'mailerDomain',
    type: 'input',
    message: 'Mailer Domain:'
  }
];
