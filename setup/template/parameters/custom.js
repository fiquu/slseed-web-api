module.exports = {
  DatabaseUri: {
    AllowedPattern: '^mongodb:\\/\\/[-\\w\\d@:.,%/?&=]+$',
    Description: 'Instance database connection URI',
    Type: 'String',
    NoEcho: true
  },
  MailerApiKey: {
    Description: 'Instance mailer API key',
    Type: 'String',
    MinLength: 5,
    NoEcho: true
  },
  MailerSender: {
    AllowedPattern: '^.+\\s<[^@]+@.+>$',
    Description: 'Instance mailer sender',
    Type: 'String'
  },
  MailerDomain: {
    AllowedPattern: '^([^.]+\\.)?[^.]+\\.[\\w]{2,}$',
    Description: 'Instance mailer domain',
    Type: 'String'
  }
};
