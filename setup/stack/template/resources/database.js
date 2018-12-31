module.exports = {
  /**
   * Database URI SSM parameter.
   */
  DatabaseUriParam: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Type: 'String',
      Name: {
        'Fn::Sub': '/${ProjectName}/${Environment}/db-uri'
      },
      Description: {
        'Fn::Sub': '${ProjectTitle} Database URI [${Environment}]'
      },
      Value: {
        Ref: 'DatabaseUri'
      }
    }
  }
};
