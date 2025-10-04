# Step 2: Deploy CloudFront distribution and Route53

Write-Host "🚀 Step 2: Deploying CloudFront and Route53..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "README.md")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Check if API Gateway URL exists
if (-not (Test-Path "api-gateway-url.txt")) {
    Write-Host "❌ api-gateway-url.txt not found. Please run deploy-step1.ps1 first" -ForegroundColor Red
    exit 1
}

$API_URL = Get-Content "api-gateway-url.txt"
Write-Host "📡 Using API Gateway URL: $API_URL" -ForegroundColor Cyan

# Deploy CloudFront and Route53
Write-Host "☁️ Deploying CloudFront distribution and Route53..." -ForegroundColor Yellow
Set-Location lambdas

aws cloudformation deploy --template-file cloudfront-template.yml --stack-name wayvote-cloudfront-production --parameter-overrides ApiGatewayUrl="$API_URL" Stage="production" --capabilities CAPABILITY_IAM

Write-Host "✅ CloudFront and Route53 deployed successfully" -ForegroundColor Green

# Get the CloudFront distribution ID
Write-Host "🔍 Getting CloudFront distribution ID..." -ForegroundColor Yellow
$DISTRIBUTION_ID = aws cloudformation describe-stacks --stack-name wayvote-cloudfront-production --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' --output text

Write-Host "📡 CloudFront Distribution ID: $DISTRIBUTION_ID" -ForegroundColor Cyan

# Save the distribution ID
$DISTRIBUTION_ID | Out-File -FilePath "../cloudfront-distribution-id.txt" -Encoding UTF8
Write-Host "💾 CloudFront Distribution ID saved to cloudfront-distribution-id.txt" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Step 2 completed successfully!" -ForegroundColor Green
Write-Host "📡 CloudFront Distribution ID: $DISTRIBUTION_ID" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Run .\deploy-step3.ps1 to deploy the frontend" -ForegroundColor Yellow
