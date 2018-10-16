/**
 * Main Stack Public Template.
 *
 * @module setup/template/public
 */

const package = require('../../package.json');

module.exports = {
  // Public Assets S3 Bucket
  PublicAssetsBucket: {
    Type: 'AWS::S3::Bucket'
  },

  // Public Assets CloudFront Origin Access Identity
  PublicAssetsBucketAccess: {
    Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
    Properties: {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: `${package.group.title} Public Assets Access Origin Identity [${process.env.NODE_ENV}]`
      }
    }
  },

  // Public Assets CloudFront Distribution
  PublicAssetsDist: {
    Type: 'AWS::CloudFront::Distribution',
    DependsOn: ['PublicAssetsBucket', 'PublicAssetsBucketAccess'],
    Properties: {
      DistributionConfig: {
        Comment: `${package.group.title} Public Assets [${process.env.NODE_ENV}]`,
        PriceClass: 'PriceClass_All',
        Enabled: true,
        Origins: [
          {
            DomainName: {
              'Fn::GetAtt': ['PublicAssetsBucket', 'DomainName']
            },
            Id: {
              Ref: 'PublicAssetsBucket'
            },
            S3OriginConfig: {
              OriginAccessIdentity: {
                'Fn::Sub': 'origin-access-identity/cloudfront/${PublicAssetsBucketAccess}'
              }
            }
          }
        ],
        DefaultCacheBehavior: {
          ViewerProtocolPolicy: 'redirect-to-https',
          Compress: true,
          ForwardedValues: {
            QueryString: false
          },
          TargetOriginId: {
            Ref: 'PublicAssetsBucket'
          }
        }
      }
    }
  }
};
