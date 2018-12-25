const inquirer = require('inquirer');

module.exports = inquirer.prompt([
  {
    name: 'DatabaseUri',
    type: 'input',
    message: `Database Connection URI:`,
    validate: val => /^mongodb(\+srv)?:\/\/[-\w\d@:.,%/?&=]+$/.test(val)
  },
  {
    name: 'MailerApiKey',
    type: 'input',
    message: `Mailer API Key:`,
    validate: val => val.length > 5
  },
  {
    name: 'MailerSender',
    type: 'input',
    message: `Mailer Sender:`,
    validate: val => /^.+\s<[^@]+@.+>$/.test(val)
  },
  {
    name: 'MailerDomain',
    type: 'input',
    message: `Mailer Domain:`,
    validate: val => /^([^.]+\.)?[^.]+\.[\w]{2,}$/.test(val)
  }
]);
