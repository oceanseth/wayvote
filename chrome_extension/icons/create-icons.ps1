# Create balance scale icons for WayVote
Add-Type -AssemblyName System.Drawing

Write-Host "Creating WayVote balance scale icons..." -ForegroundColor Green

 = @(16, 32, 48, 128)

foreach ( in ) {
     = New-Object System.Drawing.Bitmap(, )
     = [System.Drawing.Graphics]::FromImage()
    
    .SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    .CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    # Fill background with WayVote orange
     = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 69, 0))
    .FillEllipse(, 0, 0, , )
    
    # Add white border
     = New-Object System.Drawing.Pen([System.Drawing.Color]::White, [Math]::Max(1, /32))
    .DrawEllipse(, 1, 1, -2, -2)
    
    # Draw scale base
     = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
     = [Math]::Max(2, /8)
     = [Math]::Max(3, /4)
     = ( - ) / 2
     =  -  - 2
    .FillRectangle(, , , , )
    
    # Draw fulcrum
     = [Math]::Max(2, /20)
     = ( - ) / 2
     =  - 
    .FillEllipse(, , , , )
    
    # Draw beam
     = [Math]::Max(1, /32)
     =  - 8
     = 4
     =  - /2
    .FillRectangle(, , , , )
    
    # Draw pans for larger icons
    if ( -ge 32) {
         = [Math]::Max(3, /10)
         =  - 
        
        # Left pan
         =  + 
        .FillEllipse(, , , , /2)
        
        # Right pan
         =  -  - *2
        .FillEllipse(, , , , /2)
    }
    
    # Save the image
     = "icon.png"
    .Save(, [System.Drawing.Imaging.ImageFormat]::Png)
    
    Write-Host "Created " -ForegroundColor Cyan
    
    # Clean up
    .Dispose()
    .Dispose()
    .Dispose()
    .Dispose()
    .Dispose()
}

Write-Host "Balance scale icons created successfully!" -ForegroundColor Green
