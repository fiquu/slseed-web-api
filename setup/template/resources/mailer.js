module.exports = {
  // Mailer API Key SSM Parameter
  MailerApiKeyParam: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Type: 'String',
      Name: {
        'Fn::Sub': '/${GroupName}/${Environment}/mailer-api-key'
      },
      Description: {
        'Fn::Sub': '${GroupTitle} Mailer API Key [${Environment}]'
      },
      Value: {
        Ref: 'MailerApiKey'
      }
    }
  },

  // Mailer Sender SSM Parameter
  MailerSenderParam: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Type: 'String',
      Name: {
        'Fn::Sub': '/${GroupName}/${Environment}/mailer-sender'
      },
      Description: {
        'Fn::Sub': '${GroupTitle} Mailer Sender [${Environment}]'
      },
      Value: {
        Ref: 'MailerSender'
      }
    }
  },

  // Mailer Domain SSM Parameter
  MailerDomainParam: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Type: 'String',
      Name: {
        'Fn::Sub': '/${GroupName}/${Environment}/mailer-domain'
      },
      Description: {
        'Fn::Sub': '${GroupTitle} Mailer Domain [${Environment}]'
      },
      Value: {
        Ref: 'MailerDomain'
      }
    }
  }
};
