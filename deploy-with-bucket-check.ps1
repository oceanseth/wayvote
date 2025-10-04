# Enhanced deployment script that handles existing buckets gracefully

Write-Host "🚀 Starting WayVote deployment with bucket management..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "README.md")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

$STAGE = "production"
$BUCKET_NAME = "wayvote-website-$STAGE"

# Check if bucket exists
Write-Host "🔍 Checking if S3 bucket exists..." -ForegroundColor Yellow
try {
    aws s3 ls "s3://$BUCKET_NAME" 2>$null
    Write-Host "✅ Bucket $BUCKET_NAME already exists - will reuse it" -ForegroundColor Green
    $BUCKET_EXISTS = $true
} catch {
    Write-Host "📦 Bucket $BUCKET_NAME does not exist - will create it" -ForegroundColor Yellow
    $BUCKET_EXISTS = $false
}

# Deploy Lambda functions and basic infrastructure
Write-Host "📦 Deploying Lambda functions and basic infrastructure..." -ForegroundColor Yellow
Set-Location lambdas

if ($BUCKET_EXISTS) {
    Write-Host "⚠️ Skipping bucket creation since it already exists" -ForegroundColor Yellow
    # Deploy without the bucket resource
    npx serverless deploy --config serverless-basic.yml --stage production --skip-resources WayvoteWebsiteBucket,WayvoteWebsiteBucketPolicy
} else {
    # Deploy normally (will create the bucket)
    npx serverless deploy --config serverless-basic.yml --stage production
}

Write-Host "✅ Basic infrastructure deployed successfully" -ForegroundColor Green

# Get the API Gateway Rest API ID
Write-Host "🔍 Getting API Gateway Rest API ID..." -ForegroundColor Yellow
$API_ID = aws cloudformation describe-stacks --stack-name wayvote-api-production --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayRestApi`].OutputValue' --output text

Write-Host "📡 API Gateway Rest API ID: $API_ID" -ForegroundColor Cyan

# Get the S3 Bucket Name (use the known bucket name)
Write-Host "📡 Using S3 Bucket Name: $BUCKET_NAME" -ForegroundColor Cyan

# Save the values for step 2
$API_ID | Out-File -FilePath "../api-gateway-id.txt" -Encoding UTF8
$BUCKET_NAME | Out-File -FilePath "../s3-bucket-name.txt" -Encoding UTF8
Write-Host "💾 API Gateway Rest API ID and S3 Bucket Name saved" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Step 1 completed successfully!" -ForegroundColor Green
Write-Host "📡 API Gateway Rest API ID: $API_ID" -ForegroundColor Cyan
Write-Host "📡 S3 Bucket Name: $BUCKET_NAME" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Run .\deploy-step2.ps1 to deploy CloudFront and Route53" -ForegroundColor Yellow
