/**
 * Main Stack Database Template.
 *
 * @module setup/template/database
 */

const package = require('../../package.json');

module.exports = {
  // Database URI SSM parameter
  ApiEndpointParam: {
    Type: 'AWS::SSM::Parameter',
    Properties: {
      Name: `/${package.group.name}/${process.env.NODE_ENV}/api-endpoint`,
      Description: `${package.group.title} Database URI [${process.env.NODE_ENV}]`,
      Type: 'String',
      Value: 'EMPTY'
    }
  }
};
