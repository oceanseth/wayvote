#!/bin/bash

# Script to configure S3 bucket with policy and CORS

set -e

BUCKET_NAME="$1"

if [ -z "$BUCKET_NAME" ]; then
    echo "Usage: $0 <bucket-name>"
    echo "Example: $0 wayvote-website-production"
    exit 1
fi

echo "🔧 Configuring S3 bucket: $BUCKET_NAME"

# Apply bucket policy
echo "📋 Applying bucket policy..."
aws s3api put-bucket-policy \
    --bucket "$BUCKET_NAME" \
    --policy file://s3-bucket-policy.json

echo "✅ Bucket policy applied successfully"

# Apply CORS configuration
echo "🌐 Applying CORS configuration..."
aws s3api put-bucket-cors \
    --bucket "$BUCKET_NAME" \
    --cors-configuration file://s3-cors-config.json

echo "✅ CORS configuration applied successfully"

echo ""
echo "🎉 S3 bucket configuration completed!"
echo "📦 Bucket: $BUCKET_NAME"
echo "🔗 Policy: Public read access enabled"
echo "🌐 CORS: Configured for localhost:3003 and www.wayvote.org"
