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

# Get the S3 Bucket Name
echo "🔍 Getting S3 Bucket Name..."
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name wayvote-api-production \
  --query 'Stacks[0].Outputs[?OutputKey==`WayvoteWebsiteBucketName`].OutputValue' \
  --output text)

echo "📡 S3 Bucket Name: $BUCKET_NAME"

# Save the values for step 2
echo "$API_ID" > ../api-gateway-id.txt
echo "$BUCKET_NAME" > ../s3-bucket-name.txt
echo "💾 API Gateway Rest API ID and S3 Bucket Name saved"

echo ""
echo "✅ Step 1 completed successfully!"
echo "📡 API Gateway Rest API ID: $API_ID"
echo "📡 S3 Bucket Name: $BUCKET_NAME"
echo ""
echo "Next: Run ./deploy-step2.sh to deploy CloudFront and Route53"
