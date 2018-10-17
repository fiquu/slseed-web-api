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
        Comment: {
          'Fn::Sub': '${GroupTitle} Public Assets Access Origin Identity [${Environment}]'
        }
      }
    }
  },

  // Public Assets CloudFront Distribution
  PublicAssetsDist: {
    Type: 'AWS::CloudFront::Distribution',
    DependsOn: ['PublicAssetsBucket', 'PublicAssetsBucketAccess'],
    Properties: {
      DistributionConfig: {
        PriceClass: 'PriceClass_All',
        Enabled: true,
        Comment: {
          'Fn::Sub': '${GroupTitle} Public Assets [${Environment}]'
        },
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
