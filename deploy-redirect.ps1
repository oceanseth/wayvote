# Script to deploy the redirect CloudFormation stack

Write-Host "Deploying redirect CloudFormation stack..." -ForegroundColor Green

# Deploy redirect CloudFront and Route53
Write-Host "Deploying redirect CloudFront distribution and Route53..." -ForegroundColor Yellow
Set-Location lambdas

aws cloudformation deploy --template-file redirect-template.yml --stack-name wayvote-redirect-production --parameter-overrides WeighvoteHostedZoneId="Z06182912S2R0YJ8WXV3U" Stage="production" --capabilities CAPABILITY_IAM

Write-Host "Redirect deployment completed successfully!" -ForegroundColor Green

# Get the redirect CloudFront distribution ID
Write-Host "Getting redirect CloudFront distribution ID..." -ForegroundColor Yellow
$REDIRECT_DISTRIBUTION_ID = aws cloudformation describe-stacks --stack-name wayvote-redirect-production --query 'Stacks[0].Outputs[?OutputKey==`RedirectCloudFrontDistributionId`].OutputValue' --output text

Write-Host "Redirect CloudFront Distribution ID: $REDIRECT_DISTRIBUTION_ID" -ForegroundColor Cyan

# Save the distribution ID
$REDIRECT_DISTRIBUTION_ID | Out-File -FilePath "../redirect-distribution-id.txt" -Encoding UTF8

Write-Host ""
Write-Host "Redirect deployment completed successfully!" -ForegroundColor Green
Write-Host "Redirect CloudFront Distribution ID: $REDIRECT_DISTRIBUTION_ID" -ForegroundColor Cyan
Write-Host ""
Write-Host "weighvote.org and www.weighvote.org will now redirect to www.wayvote.org" -ForegroundColor Yellow
