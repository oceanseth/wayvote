# Step 3: Build and deploy frontend to S3

Write-Host "Step 3: Building and deploying frontend..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "README.md")) {
    Write-Host "ERROR: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm run build
Write-Host "Frontend built successfully" -ForegroundColor Green

# Deploy to S3
Write-Host "Deploying frontend to S3..." -ForegroundColor Yellow
$BUCKET_NAME = Get-Content "../s3-bucket-name.txt"

# Configure S3 bucket with policy and CORS
Write-Host "Configuring S3 bucket..." -ForegroundColor Yellow
Set-Location ../lambdas
.\configure-s3-bucket.ps1 -BucketName $BUCKET_NAME

# Deploy frontend files
Write-Host "Uploading frontend files..." -ForegroundColor Yellow
aws s3 sync ../frontend/dist "s3://$BUCKET_NAME" --delete
Write-Host "Frontend deployed to S3" -ForegroundColor Green

# Invalidate CloudFront cache if distribution ID exists
if (Test-Path "../cloudfront-distribution-id.txt") {
    $DISTRIBUTION_ID = Get-Content "../cloudfront-distribution-id.txt"
    Write-Host "Invalidating CloudFront cache..." -ForegroundColor Yellow
    aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"
    Write-Host "CloudFront cache invalidated" -ForegroundColor Green
} else {
    Write-Host "CloudFront distribution ID not found, skipping cache invalidation" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Frontend: https://wayvote.org" -ForegroundColor Cyan
Write-Host "API: https://api.wayvote.org" -ForegroundColor Cyan
Write-Host "API Test: https://wayvote.org/api-test" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can test the API with:" -ForegroundColor Yellow
Write-Host "curl -X POST https://api.wayvote.org/helloworld \`" -ForegroundColor Gray
Write-Host "  -H `"Content-Type: application/json`" \`" -ForegroundColor Gray
Write-Host "  -d '{\`"message\`": \`"Hello from deployment!\`"}'" -ForegroundColor Gray
