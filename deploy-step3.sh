#!/bin/bash

# Step 3: Build and deploy frontend to S3

set -e

echo "🚀 Step 3: Building and deploying frontend..."

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm run build
echo "✅ Frontend built successfully"

# Deploy to S3
echo "☁️ Deploying frontend to S3..."
BUCKET_NAME=$(cat ../s3-bucket-name.txt)

# Configure S3 bucket with policy and CORS
echo "🔧 Configuring S3 bucket..."
cd ../lambdas
chmod +x configure-s3-bucket.sh
./configure-s3-bucket.sh $BUCKET_NAME

# Deploy frontend files
echo "📦 Uploading frontend files..."
aws s3 sync ../frontend/dist s3://$BUCKET_NAME --delete
echo "✅ Frontend deployed to S3"

# Invalidate CloudFront cache if distribution ID exists
if [ -f "../cloudfront-distribution-id.txt" ]; then
    DISTRIBUTION_ID=$(cat ../cloudfront-distribution-id.txt)
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
      --distribution-id "$DISTRIBUTION_ID" \
      --paths "/*"
    echo "✅ CloudFront cache invalidated"
else
    echo "⚠️ CloudFront distribution ID not found, skipping cache invalidation"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "🌐 Frontend: https://wayvote.org"
echo "🔗 API: https://api.wayvote.org"
echo "📊 API Test: https://wayvote.org/api-test"
echo ""
echo "💡 You can test the API with:"
echo "curl -X POST https://api.wayvote.org/helloworld \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"message\": \"Hello from deployment!\"}'"
