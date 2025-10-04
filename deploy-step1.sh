#!/bin/bash

# Step 1: Deploy basic infrastructure (Lambda + S3 + API Gateway)

set -e

echo "🚀 Step 1: Deploying basic infrastructure..."

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Deploy Lambda functions and basic infrastructure
echo "📦 Deploying Lambda functions and basic infrastructure..."
cd lambdas
serverless deploy --config serverless-basic.yml --stage production
echo "✅ Basic infrastructure deployed successfully"

# Get the API Gateway URL
echo "🔍 Getting API Gateway URL..."
API_URL=$(aws cloudformation describe-stacks \
  --stack-name wayvote-api-production \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' \
  --output text)

echo "📡 API Gateway URL: $API_URL"

# Save the API URL for step 2
echo "$API_URL" > ../api-gateway-url.txt
echo "💾 API Gateway URL saved to api-gateway-url.txt"

echo ""
echo "✅ Step 1 completed successfully!"
echo "📡 API Gateway URL: $API_URL"
echo ""
echo "Next: Run ./deploy-step2.sh to deploy CloudFront and Route53"
