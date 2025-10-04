# Step 1: Deploy basic infrastructure (Lambda + S3 + API Gateway)

Write-Host "🚀 Step 1: Deploying basic infrastructure..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "README.md")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Deploy Lambda functions and basic infrastructure
Write-Host "📦 Deploying Lambda functions and basic infrastructure..." -ForegroundColor Yellow
Set-Location lambdas
npx serverless deploy --config serverless-basic.yml --stage production
Write-Host "✅ Basic infrastructure deployed successfully" -ForegroundColor Green

# Get the API Gateway URL
Write-Host "🔍 Getting API Gateway URL..." -ForegroundColor Yellow
$API_URL = aws cloudformation describe-stacks --stack-name wayvote-api-production --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayUrl`].OutputValue' --output text

Write-Host "📡 API Gateway URL: $API_URL" -ForegroundColor Cyan

# Save the API URL for step 2
$API_URL | Out-File -FilePath "../api-gateway-url.txt" -Encoding UTF8
Write-Host "💾 API Gateway URL saved to api-gateway-url.txt" -ForegroundColor Green

Write-Host ""
Write-Host "✅ Step 1 completed successfully!" -ForegroundColor Green
Write-Host "📡 API Gateway URL: $API_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Run .\deploy-step2.ps1 to deploy CloudFront and Route53" -ForegroundColor Yellow
