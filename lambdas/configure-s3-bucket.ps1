# Script to configure S3 bucket with policy and CORS

param(
    [Parameter(Mandatory=$true)]
    [string]$BucketName
)

Write-Host "Configuring S3 bucket: $BucketName" -ForegroundColor Green

# Apply bucket policy
Write-Host "Applying bucket policy..." -ForegroundColor Yellow
aws s3api put-bucket-policy --bucket $BucketName --policy file://s3-bucket-policy.json

Write-Host "Bucket policy applied successfully" -ForegroundColor Green

# Apply CORS configuration
Write-Host "Applying CORS configuration..." -ForegroundColor Yellow
aws s3api put-bucket-cors --bucket $BucketName --cors-configuration file://s3-cors-config.json

Write-Host "CORS configuration applied successfully" -ForegroundColor Green

Write-Host ""
Write-Host "S3 bucket configuration completed!" -ForegroundColor Green
Write-Host "Bucket: $BucketName" -ForegroundColor Cyan
Write-Host "Policy: Public read access enabled" -ForegroundColor Cyan
Write-Host "CORS: Configured for localhost:3003 and www.wayvote.org" -ForegroundColor Cyan
