# Step 1: Deploy basic infrastructure (Lambda + S3 + API Gateway)

Write-Host "Step 1: Deploying basic infrastructure..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "README.md")) {
    Write-Host "ERROR: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Deploy Lambda functions and basic infrastructure
Write-Host "Deploying Lambda functions and basic infrastructure..." -ForegroundColor Yellow
Set-Location lambdas
npx serverless deploy --config serverless-basic.yml --stage production
Write-Host "Basic infrastructure deployed successfully" -ForegroundColor Green

# Get the API Gateway Rest API ID
Write-Host "Getting API Gateway Rest API ID..." -ForegroundColor Yellow
$API_ID = aws cloudformation describe-stacks --stack-name wayvote-api-production --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayRestApi`].OutputValue' --output text

Write-Host "API Gateway Rest API ID: $API_ID" -ForegroundColor Cyan

# Get the S3 Bucket Name
Write-Host "Getting S3 Bucket Name..." -ForegroundColor Yellow
$BUCKET_NAME = aws cloudformation describe-stacks --stack-name wayvote-api-production --query 'Stacks[0].Outputs[?OutputKey==`WayvoteWebsiteBucketName`].OutputValue' --output text

Write-Host "S3 Bucket Name: $BUCKET_NAME" -ForegroundColor Cyan

# Save the values for step 2
$API_ID | Out-File -FilePath "../api-gateway-id.txt" -Encoding UTF8
$BUCKET_NAME | Out-File -FilePath "../s3-bucket-name.txt" -Encoding UTF8
Write-Host "API Gateway Rest API ID and S3 Bucket Name saved" -ForegroundColor Green

Write-Host ""
Write-Host "Step 1 completed successfully!" -ForegroundColor Green
Write-Host "API Gateway Rest API ID: $API_ID" -ForegroundColor Cyan
Write-Host "S3 Bucket Name: $BUCKET_NAME" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Run .\deploy-step2.ps1 to deploy CloudFront and Route53" -ForegroundColor Yellow
