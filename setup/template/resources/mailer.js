module.exports = {
  /**
   * Mailer API Key SSM Parameter.
   */
  MailerApiKeyParam: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Type: 'String',
      Name: {
        'Fn::Sub': '/${ProjectName}/${Environment}/mailer-api-key'
      },
      Description: {
        'Fn::Sub': '${ProjectTitle} Mailer API Key [${Environment}]'
      },
      Value: {
        Ref: 'MailerApiKey'
      }
    }
  },

  /**
   * Mailer Sender SSM Parameter.
   */
  MailerSenderParam: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Type: 'String',
      Name: {
        'Fn::Sub': '/${ProjectName}/${Environment}/mailer-sender'
      },
      Description: {
        'Fn::Sub': '${ProjectTitle} Mailer Sender [${Environment}]'
      },
      Value: {
        Ref: 'MailerSender'
      }
    }
  },

  /**
   * Mailer Domain SSM Parameter.
   */
  MailerDomainParam: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Type: 'String',
      Name: {
        'Fn::Sub': '/${ProjectName}/${Environment}/mailer-domain'
      },
      Description: {
        'Fn::Sub': '${ProjectTitle} Mailer Domain [${Environment}]'
      },
      Value: {
        Ref: 'MailerDomain'
      }
    }
  }
};
