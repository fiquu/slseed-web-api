module.exports = {
  /**
   * App Origin SSM parameter.
   */
  AppOriginParam: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Type: 'String',
      Name: {
        'Fn::Sub': '/${ProjectName}/${Environment}/app-origin'
      },
      Description: {
        'Fn::Sub': '${ProjectTitle} App Origin [${Environment}]'
      },
      Value: {
        Ref: 'AppOrigin'
      }
    }
  }
};
