#!/bin/bash

# WayVote Deployment Script
# This script deploys both the Lambda functions and frontend

set -e

echo "🚀 Starting WayVote deployment..."

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Deploy Lambda functions
echo "📦 Deploying Lambda functions..."
cd lambdas
npm run deploy:prod
echo "✅ Lambda functions deployed successfully"

# Build and deploy frontend
echo "🏗️ Building frontend..."
cd ../frontend
npm run build
echo "✅ Frontend built successfully"

# Deploy to S3
echo "☁️ Deploying frontend to S3..."
cd ../lambdas
npx serverless s3sync --stage production
echo "✅ Frontend deployed to S3"

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
npx serverless cloudfrontInvalidate --stage production
echo "✅ CloudFront cache invalidated"

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
