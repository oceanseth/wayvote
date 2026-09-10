# Script to fix DNS records by copying from CloudFormation-created hosted zones to original ones

Write-Host "Fixing DNS records..." -ForegroundColor Green

# Original hosted zone IDs (the ones that existed before our stack)
$ORIGINAL_WAYVOTE_ZONE = "Z03190542Q3Q8WQPEER6Q"
$ORIGINAL_WEIGHVOTE_ZONE = "Z06182912S2R0YJ8WXV3U"

# CloudFormation-created hosted zone IDs (the ones we want to copy from)
$CF_WAYVOTE_ZONE = "Z07617671P643UU0DHH6P"
$CF_WEIGHVOTE_ZONE = "Z047634412XV556MMGMPO"

# Get CloudFront distribution domain name
$CLOUDFRONT_DOMAIN = "ddtlzrdidujlm.cloudfront.net"

Write-Host "Adding DNS records to original hosted zones..." -ForegroundColor Yellow

# Create change batch for wayvote.org hosted zone
$wayvoteChangeBatch = @{
    Changes = @(
        @{
            Action = "UPSERT"
            ResourceRecordSet = @{
                Name = "wayvote.org"
                Type = "A"
                AliasTarget = @{
                    DNSName = $CLOUDFRONT_DOMAIN
                    EvaluateTargetHealth = $false
                    HostedZoneId = "Z2FDTNDATAQYW2"
                }
            }
        },
        @{
            Action = "UPSERT"
            ResourceRecordSet = @{
                Name = "www.wayvote.org"
                Type = "A"
                AliasTarget = @{
                    DNSName = $CLOUDFRONT_DOMAIN
                    EvaluateTargetHealth = $false
                    HostedZoneId = "Z2FDTNDATAQYW2"
                }
            }
        }
    )
}

# Create change batch for weighvote.org hosted zone
$weighvoteChangeBatch = @{
    Changes = @(
        @{
            Action = "UPSERT"
            ResourceRecordSet = @{
                Name = "weighvote.org"
                Type = "A"
                AliasTarget = @{
                    DNSName = $CLOUDFRONT_DOMAIN
                    EvaluateTargetHealth = $false
                    HostedZoneId = "Z2FDTNDATAQYW2"
                }
            }
        }
    )
}

# Apply changes to wayvote.org hosted zone
Write-Host "Updating wayvote.org hosted zone..." -ForegroundColor Yellow
$wayvoteChangeBatchJson = $wayvoteChangeBatch | ConvertTo-Json -Depth 10
aws route53 change-resource-record-sets --hosted-zone-id $ORIGINAL_WAYVOTE_ZONE --change-batch $wayvoteChangeBatchJson

# Apply changes to weighvote.org hosted zone
Write-Host "Updating weighvote.org hosted zone..." -ForegroundColor Yellow
$weighvoteChangeBatchJson = $weighvoteChangeBatch | ConvertTo-Json -Depth 10
aws route53 change-resource-record-sets --hosted-zone-id $ORIGINAL_WEIGHVOTE_ZONE --change-batch $weighvoteChangeBatchJson

Write-Host "DNS records updated successfully!" -ForegroundColor Green
Write-Host "Original hosted zones now point to CloudFront distribution" -ForegroundColor Cyan
