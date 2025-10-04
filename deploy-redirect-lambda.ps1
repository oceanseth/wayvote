# Script to deploy the redirect Lambda@Edge function

Write-Host "Deploying redirect Lambda@Edge function..." -ForegroundColor Green

Set-Location lambdas/redirect-lambda

# Create the Lambda function
Write-Host "Creating Lambda function..." -ForegroundColor Yellow
aws lambda create-function `
  --function-name wayvote-redirect-production `
  --runtime nodejs18.x `
  --role arn:aws:iam::218827615080:role/lambda-execution-role `
  --handler index.handler `
  --zip-file fileb://redirect-function.zip `
  --description "Lambda@Edge function for redirecting weighvote.org to wayvote.org"

# If the function already exists, update it
if ($LASTEXITCODE -ne 0) {
    Write-Host "Function exists, updating code..." -ForegroundColor Yellow
    aws lambda update-function-code `
      --function-name wayvote-redirect-production `
      --zip-file fileb://redirect-function.zip
}

# Create a version
Write-Host "Creating function version..." -ForegroundColor Yellow
$VERSION = aws lambda publish-version --function-name wayvote-redirect-production --query 'Version' --output text

Write-Host "Lambda function deployed successfully!" -ForegroundColor Green
Write-Host "Function ARN: arn:aws:lambda:us-east-1:218827615080:function:wayvote-redirect-production:$VERSION" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Add the weighvote domains to the CloudFront distribution aliases" -ForegroundColor Gray
Write-Host "2. Associate this Lambda function with the CloudFront distribution" -ForegroundColor Gray
