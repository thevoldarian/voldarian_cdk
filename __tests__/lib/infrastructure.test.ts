import { describe, it } from 'vitest';
import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { InfrastructureStack } from '../../lib/infrastructure-stack';

describe('InfrastructureStack', () => {
  it('creates S3 bucket', () => {
    const app = new App();
    const stack = new InfrastructureStack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::S3::Bucket', 1);
  });

  it('creates CloudFront distribution', () => {
    const app = new App();
    const stack = new InfrastructureStack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    });
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::CloudFront::Distribution', 1);
  });
});
