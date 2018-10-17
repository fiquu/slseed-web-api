module.exports = {
  ApiEndpointParam: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Name: {
        'Fn::Sub': '/${GroupName}/${Environment}/api-endpoint'
      },
      Description: {
        'Fn::Sub': '${GroupTitle} Database URI [${Environment}]'
      },
      Type: 'String',
      Value: {
        Ref: 'ApiEndpoint'
      }
    }
  }
};
