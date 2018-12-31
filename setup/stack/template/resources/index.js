const database = require('./database');
const cognito = require('./cognito');
const mailer = require('./mailer');
const public = require('./public');
const iam = require('./iam');

module.exports = {
  ...database,
  ...cognito,
  ...mailer,
  ...public,
  ...iam
};
