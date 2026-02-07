import { Stack, StackProps, RemovalPolicy, CfnOutput } from 'aws-cdk-lib';
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { HostedZone, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import * as fs from 'fs';

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const domainName = 'thevoldarian.com';
    const siteDomain = 'www.' + domainName;

    // Get hosted zone
    const zone = HostedZone.fromLookup(this, 'Zone', {
      domainName: domainName,
    });

    // SSL Certificate (must be in us-east-1 for CloudFront)
    const certificate = new Certificate(this, 'SiteCertificate', {
      domainName: siteDomain,
      subjectAlternativeNames: [domainName],
      validation: CertificateValidation.fromDns(zone),
    });

    // S3 bucket for website content
    const siteBucket = new Bucket(this, 'SiteBucket', {
      bucketName: siteDomain,
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // CloudFront distribution
    const distribution = new Distribution(this, 'SiteDistribution', {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [siteDomain, domainName],
      certificate: certificate,
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
    });

    // Route53 alias records
    new ARecord(this, 'SiteAliasRecord', {
      recordName: siteDomain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone,
    });

    new ARecord(this, 'RootAliasRecord', {
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone,
    });

    // Deploy site contents to S3 (only if build folder exists)
    const buildPath = '../thevoldarian/build';
    if (fs.existsSync(buildPath)) {
      new BucketDeployment(this, 'DeployWebsite', {
        sources: [Source.asset(buildPath)],
        destinationBucket: siteBucket,
        distribution,
        distributionPaths: ['/*'],
      });
    }

    // Outputs
    new CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
    });
    new CfnOutput(this, 'WebsiteURL', {
      value: 'https://' + siteDomain,
    });
  }
}
