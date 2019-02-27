module.exports = {
  ...require('./database'),
  ...require('./cognito'),
  ...require('./mailer'),
  ...require('./public'),
  ...require('./iam')
};
