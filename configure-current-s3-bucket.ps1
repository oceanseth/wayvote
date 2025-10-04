# Script to configure the current S3 bucket with policy and CORS

Write-Host "Configuring current S3 bucket..." -ForegroundColor Green

# Get the current bucket name from the saved file
if (Test-Path "s3-bucket-name.txt") {
    $BUCKET_NAME = Get-Content "s3-bucket-name.txt"
    Write-Host "Using bucket: $BUCKET_NAME" -ForegroundColor Cyan
} else {
    Write-Host "ERROR: s3-bucket-name.txt not found. Please run deploy-step1.ps1 first." -ForegroundColor Red
    exit 1
}

# Configure the bucket
Set-Location lambdas
.\configure-s3-bucket.ps1 -BucketName $BUCKET_NAME

Write-Host ""
Write-Host "S3 bucket configuration completed!" -ForegroundColor Green
