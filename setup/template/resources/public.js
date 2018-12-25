module.exports = {
  /**
   * Public Assets S3 Bucket.
   */
  PublicAssetsS3Bucket: {
    Type: 'AWS::S3::Bucket'
  },

  /**
   * Public Assets CloudFront Origin Access Identity.
   */
  PublicAssetsS3BucketAccess: {
    Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
    Properties: {
      CloudFrontOriginAccessIdentityConfig: {
        Comment: {
          'Fn::Sub': '${ProjectTitle} Public Assets Access Origin Identity [${Environment}]'
        }
      }
    }
  },

  /**
   * Public Assets CloudFront Distribution.
   */
  PublicAssetsDist: {
    Type: 'AWS::CloudFront::Distribution',
    DependsOn: ['PublicAssetsS3Bucket', 'PublicAssetsS3BucketAccess'],
    Properties: {
      DistributionConfig: {
        PriceClass: 'PriceClass_All',
        Enabled: true,
        Comment: {
          'Fn::Sub': '${ProjectTitle} Public Assets [${Environment}]'
        },
        Origins: [
          {
            DomainName: {
              'Fn::GetAtt': ['PublicAssetsS3Bucket', 'DomainName']
            },
            Id: {
              Ref: 'PublicAssetsS3Bucket'
            },
            S3OriginConfig: {
              OriginAccessIdentity: {
                'Fn::Sub': 'origin-access-identity/cloudfront/${PublicAssetsS3BucketAccess}'
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
            Ref: 'PublicAssetsS3Bucket'
          }
        }
      }
    }
  }
};
