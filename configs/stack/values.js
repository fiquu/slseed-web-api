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
    name: 'MailerSender',
    type: 'input',
    message: 'Mailer Sender',
    default: '"Name" <name@example.com>',
    validate: val => /^"[^"]+"\s<[^@]+@.+>$/.test(val)
  },
  {
    name: 'AppOrigin',
    type: 'input',
    message: 'App Origin (CORS)',
    default: '*',
    validate: val => /^https?:\/\/[-_\w.]+(\:\d+)?|\*$/.test(val)
  }
];
