const database = require('./database');
const cognito = require('./cognito');
const mailer = require('./mailer');
const public = require('./public');

module.exports = {
  ...database,
  ...cognito,
  ...mailer,
  ...public
};
