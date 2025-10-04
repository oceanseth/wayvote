# WayVote Deployment Script for PowerShell
# This script deploys both the Lambda functions and frontend

Write-Host "🚀 Starting WayVote deployment..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "README.md")) {
    Write-Host "❌ Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Deploy Lambda functions
Write-Host "📦 Deploying Lambda functions..." -ForegroundColor Yellow
Set-Location lambdas
npm run deploy:prod
Write-Host "✅ Lambda functions deployed successfully" -ForegroundColor Green

# Build and deploy frontend
Write-Host "🏗️ Building frontend..." -ForegroundColor Yellow
Set-Location ../frontend
npm run build
Write-Host "✅ Frontend built successfully" -ForegroundColor Green

# Deploy to S3
Write-Host "☁️ Deploying frontend to S3..." -ForegroundColor Yellow
Set-Location ../lambdas
npx serverless s3sync --stage production
Write-Host "✅ Frontend deployed to S3" -ForegroundColor Green

# Invalidate CloudFront cache
Write-Host "🔄 Invalidating CloudFront cache..." -ForegroundColor Yellow
npx serverless cloudfrontInvalidate --stage production
Write-Host "✅ CloudFront cache invalidated" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "🌐 Frontend: https://wayvote.org" -ForegroundColor Cyan
Write-Host "🔗 API: https://api.wayvote.org" -ForegroundColor Cyan
Write-Host "📊 API Test: https://wayvote.org/api-test" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 You can test the API with:" -ForegroundColor Yellow
Write-Host "curl -X POST https://api.wayvote.org/helloworld \`" -ForegroundColor Gray
Write-Host "  -H `"Content-Type: application/json`" \`" -ForegroundColor Gray
Write-Host "  -d '{\`"message\`": \`"Hello from deployment!\`"}'" -ForegroundColor Gray
