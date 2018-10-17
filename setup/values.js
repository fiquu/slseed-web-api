/**
 * Main Stack Values.
 *
 * @module setup/values
 */

const inquirer = require('inquirer');

module.exports = inquirer.prompt([
  {
    name: 'db-uri',
    type: 'input',
    message: `Database Connection URI:`,
    validate: val => /^mongodb(\+srv)?:\/\/[-\w\d@:.,%/?&=]+$/.test(val)
  },
  {
    name: 'mailer-api-key',
    type: 'input',
    message: `Mailer API Key:`,
    validate: val => val.length > 5
  },
  {
    name: 'mailer-sender',
    type: 'input',
    message: `Mailer Sender:`,
    validate: val => /^.+\s<[^@]+@.+>$/.test(val)
  },
  {
    name: 'mailer-domain',
    type: 'input',
    message: `Mailer Domain:`,
    validate: val => /^([^.]+\.)?[^.]+\.[\w]{2,}$/.test(val)
  }
]);
