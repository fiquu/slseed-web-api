const is = require('fi-is');

const { name } = require('../../package.json');

module.exports = [
  {
    name: 'DatabaseUri',
    type: 'input',
    message: 'Database Connection URI',
    default: `mongodb://localhost:27017/${name}`,
    validate: val => /^mongodb(\+srv)?:\/\/[-\w\d@:.,%/?&=]+$/.test(val)
  },
  {
    name: 'MailerApiKey',
    type: 'input',
    message: 'Mailer API Key',
    default: 'key-0123456789abcdef0123456789abcdef',
    validate: val => /^key-[0-9a-f]{32,}$/.test(val)
  },
  {
    name: 'MailerSender',
    type: 'input',
    message: 'Mailer Sender',
    default: '"Name" <name@example.com>',
    validate: val => /^"[^"]+"\s<[^@]+@.+>$/.test(val)
  },
  {
    name: 'MailerDomain',
    type: 'input',
    message: 'Mailer Domain',
    default: 'mg.example.com',
    validate: val => is.domain(val)
  }
];
