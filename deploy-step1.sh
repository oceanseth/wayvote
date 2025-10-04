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
npx serverless deploy --config serverless-basic.yml --stage production
echo "✅ Basic infrastructure deployed successfully"

# Get the API Gateway Rest API ID
echo "🔍 Getting API Gateway Rest API ID..."
API_ID=$(aws cloudformation describe-stacks \
  --stack-name wayvote-api-production \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayRestApi`].OutputValue' \
  --output text)

echo "📡 API Gateway Rest API ID: $API_ID"

# Save the API ID for step 2
echo "$API_ID" > ../api-gateway-id.txt
echo "💾 API Gateway Rest API ID saved to api-gateway-id.txt"

echo ""
echo "✅ Step 1 completed successfully!"
echo "📡 API Gateway Rest API ID: $API_ID"
echo ""
echo "Next: Run ./deploy-step2.sh to deploy CloudFront and Route53"
