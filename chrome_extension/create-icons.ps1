# PowerShell script to create simple PNG icons for Chrome extension
# This creates basic colored squares as placeholders

Write-Host "Creating WayVote Chrome extension icons..." -ForegroundColor Green

# Create a simple PNG file using .NET
Add-Type -AssemblyName System.Drawing

$sizes = @(16, 32, 48, 128)

foreach ($size in $sizes) {
    # Create a bitmap
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Set high quality rendering
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    # Fill background with WayVote orange
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 69, 0))
    $graphics.FillRectangle($brush, 0, 0, $size, $size)
    
    # Add white border
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, [Math]::Max(1, $size/32))
    $graphics.DrawEllipse($pen, 1, 1, $size-2, $size-2)
    
    # Add target circles
    $pen.Width = [Math]::Max(1, $size/42)
    $graphics.DrawEllipse($pen, $size/4, $size/4, $size/2, $size/2)
    $graphics.DrawEllipse($pen, $size/3, $size/3, $size/3, $size/3)
    
    # Add center dot
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $graphics.FillEllipse($whiteBrush, $size/2 - $size/16, $size/2 - $size/16, $size/8, $size/8)
    
    # Add arrow for larger icons
    if ($size -ge 32) {
        $arrowSize = $size/8
        $points = @(
            [System.Drawing.Point]::new($size/2, $size/4),
            [System.Drawing.Point]::new($size/2 - $arrowSize/2, $size/4 + $arrowSize),
            [System.Drawing.Point]::new($size/2 + $arrowSize/2, $size/4 + $arrowSize)
        )
        $graphics.FillPolygon($whiteBrush, $points)
    }
    
    # Save the image
    $filename = "icon$size.png"
    $bitmap.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    
    Write-Host "Created $filename" -ForegroundColor Cyan
    
    # Clean up
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $pen.Dispose()
    $whiteBrush.Dispose()
}

Write-Host "All icons created successfully!" -ForegroundColor Green
Write-Host "You can now load the extension in Chrome." -ForegroundColor Yellow
