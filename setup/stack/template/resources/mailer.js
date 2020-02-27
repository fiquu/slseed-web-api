module.exports = {
  /**
   * Mailer Sender SSM Parameter.
   */
  MailerSenderParam: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Type: 'String',
      Name: {
        'Fn::Sub': '/${GroupName}/${ProjectName}/${Environment}/mailer-sender'
      },
      Description: {
        'Fn::Sub': '${GroupTitle} ${ProjectTitle} Mailer Sender [${Environment}]'
      },
      Value: {
        Ref: 'MailerSender'
      }
    }
  }
};
