# Voldarian CDK Infrastructure

[![CI](https://github.com/thevoldarian/voldarian_cdk/actions/workflows/ci.yml/badge.svg)](https://github.com/thevoldarian/voldarian_cdk/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![AWS CDK](https://img.shields.io/badge/AWS%20CDK-2.237-orange.svg)](https://aws.amazon.com/cdk/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AWS CDK infrastructure for deploying a React website with CloudFront, S3, Route53, and ACM certificate.

## Features

- 🚀 Automated infrastructure deployment
- 🔒 HTTPS with automatic SSL certificate management
- 🌍 Global CDN via CloudFront
- 📦 S3 static hosting with Origin Access Control
- 🔄 Automatic cache invalidation on deployment
- 🎯 SPA routing support (404 → index.html)

## Architecture

- **S3**: Static website hosting with private access
- **CloudFront**: Global CDN with HTTPS and custom domain
- **Route53**: DNS management for apex and www domains
- **ACM**: Automatic SSL/TLS certificate with DNS validation
- **Origin Access Control**: Secure S3 bucket access
- **BucketDeployment**: Automated deployment with cache invalidation

## Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js 18+
- AWS CDK CLI: `npm install -g aws-cdk`
- Route53 hosted zone for your domain
- Domain nameservers pointing to Route53

## Setup

```bash
npm install
```

## Configuration

Update the domain name in `lib/infrastructure-stack.ts`:

```typescript
const domainName = 'your-domain.com';
```

## Commands

* `npm run build` - Compile TypeScript
* `npm run watch` - Watch mode
* `npm test` - Run Vitest tests
* `npm run test:ui` - Vitest UI
* `npm test -- --coverage` - Run tests with coverage
* `npm run format` - Format code with Prettier
* `npm run lint` - Lint code
* `cdk deploy` - Deploy to AWS
* `cdk diff` - Show changes
* `cdk synth` - Generate CloudFormation template

## Deployment

### First Time Setup

```bash
# Bootstrap CDK (one-time per account/region)
cdk bootstrap

# Deploy infrastructure
npm run build
cdk deploy
```

### Updating the Website

```bash
# Build your React app first
cd ../thevoldarian
npm run build

# Deploy infrastructure (includes website update)
cd ../infrastructure
cdk deploy
```

## Cost Estimate

- Route53 Hosted Zone: $0.50/month
- S3 Storage: ~$0.023/GB/month
- CloudFront: Free tier includes 1TB data transfer
- ACM Certificate: Free

Typical monthly cost for a small website: **< $1**

## License

MIT
