module.exports = {
  ...require('./database'),
  ...require('./cognito'),
  ...require('./mailer'),
  ...require('./app'),
  ...require('./iam')
};
