module.exports = {
  DatabaseUri: {
    Description: 'Project database connection URI',
    AllowedPattern: '^mongodb(\\+srv)?:\\/\\/[-\\w\\d@:.,%/?&=]+$',
    Type: 'String',
    NoEcho: true
  },
  MailerApiKey: {
    Description: 'Project mailer API key',
    Type: 'String',
    MinLength: 5,
    NoEcho: true
  },
  MailerSender: {
    Description: 'Project mailer sender',
    AllowedPattern: '^.+\\s<[^@]+@.+>$',
    Type: 'String'
  },
  MailerDomain: {
    Description: 'Project mailer domain',
    AllowedPattern: '^([^.]+\\.)?[^.]+\\.[\\w]{2,}$',
    Type: 'String'
  }
};
