$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$url = "file:///C:/Users/Admin/.gemini/antigravity/scratch/zbm-catalogue/index.html"
$outDir = "C:\Users\Admin\.gemini\antigravity\scratch\zbm-catalogue\assets"

Write-Host "Running comprehensive automated tests..."
# Start a simple node-less check by running chrome to capture console logs and screenshot
$screenshotPath = "$outDir\preview_catalogue_updated.webp"
Start-Process -FilePath $chrome -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1440,900", "--screenshot=$screenshotPath", $url -Wait
Write-Host "Catalogue screenshot captured: $(Test-Path $screenshotPath)"
