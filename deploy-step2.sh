#!/bin/bash

# Step 2: Deploy CloudFront distribution and Route53

set -e

echo "🚀 Step 2: Deploying CloudFront and Route53..."

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Check if API Gateway URL exists
if [ ! -f "api-gateway-url.txt" ]; then
    echo "❌ api-gateway-url.txt not found. Please run deploy-step1.sh first"
    exit 1
fi

API_URL=$(cat api-gateway-url.txt)
echo "📡 Using API Gateway URL: $API_URL"

# Deploy CloudFront and Route53
echo "☁️ Deploying CloudFront distribution and Route53..."
cd lambdas

aws cloudformation deploy \
  --template-file cloudfront-template.yml \
  --stack-name wayvote-cloudfront-production \
  --parameter-overrides \
    ApiGatewayUrl="$API_URL" \
    Stage="production" \
  --capabilities CAPABILITY_IAM

echo "✅ CloudFront and Route53 deployed successfully"

# Get the CloudFront distribution ID
echo "🔍 Getting CloudFront distribution ID..."
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name wayvote-cloudfront-production \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
  --output text)

echo "📡 CloudFront Distribution ID: $DISTRIBUTION_ID"

# Save the distribution ID
echo "$DISTRIBUTION_ID" > ../cloudfront-distribution-id.txt
echo "💾 CloudFront Distribution ID saved to cloudfront-distribution-id.txt"

echo ""
echo "✅ Step 2 completed successfully!"
echo "📡 CloudFront Distribution ID: $DISTRIBUTION_ID"
echo ""
echo "Next: Run ./deploy-step3.sh to deploy the frontend"
