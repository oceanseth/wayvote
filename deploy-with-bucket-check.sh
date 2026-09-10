#!/bin/bash

# Enhanced deployment script that handles existing buckets gracefully

set -e

echo "🚀 Starting WayVote deployment with bucket management..."

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

STAGE="production"
BUCKET_NAME="wayvote-website-${STAGE}"

# Check if bucket exists
echo "🔍 Checking if S3 bucket exists..."
if aws s3 ls "s3://${BUCKET_NAME}" 2>/dev/null; then
    echo "✅ Bucket ${BUCKET_NAME} already exists - will reuse it"
    BUCKET_EXISTS=true
else
    echo "📦 Bucket ${BUCKET_NAME} does not exist - will create it"
    BUCKET_EXISTS=false
fi

# Deploy Lambda functions and basic infrastructure
echo "📦 Deploying Lambda functions and basic infrastructure..."
cd lambdas

if [ "$BUCKET_EXISTS" = true ]; then
    echo "⚠️ Skipping bucket creation since it already exists"
    # Deploy without the bucket resource
    npx serverless deploy --config serverless-basic.yml --stage production --skip-resources WayvoteWebsiteBucket,WayvoteWebsiteBucketPolicy
else
    # Deploy normally (will create the bucket)
    npx serverless deploy --config serverless-basic.yml --stage production
fi

echo "✅ Basic infrastructure deployed successfully"

# Get the API Gateway Rest API ID
echo "🔍 Getting API Gateway Rest API ID..."
API_ID=$(aws cloudformation describe-stacks \
  --stack-name wayvote-api-production \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayRestApi`].OutputValue' \
  --output text)

echo "📡 API Gateway Rest API ID: $API_ID"

# Get the S3 Bucket Name (use the known bucket name)
echo "📡 Using S3 Bucket Name: $BUCKET_NAME"

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
