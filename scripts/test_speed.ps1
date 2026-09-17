# Test Chrome with Start-Process -Wait
$htmlPath = [System.IO.Path]::Combine((Get-Location).Path, "scripts\test_card.html")
$html = @"
<!DOCTYPE html>
<html>
<body style='margin:0; width:500px; height:500px; background:radial-gradient(circle, #2d3748, #1a202c); display:flex; align-items:center; justify-content:center;'>
  <div style='width:350px; height:350px; border:2px dashed #d4af37; border-radius:16px; display:flex; align-items:center; justify-content:center; color:#d4af37; font-size:28px; font-family:sans-serif;'>
    Logo here
  </div>
</body>
</html>
"@
[System.IO.File]::WriteAllText($htmlPath, $html, [System.Text.Encoding]::UTF8)

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outWebp = [System.IO.Path]::Combine((Get-Location).Path, "assets\images\products\test.webp")
$fileUrl = "file:///" + $htmlPath.Replace("\", "/")
$args = @("--headless=new", "--screenshot=$outWebp", "--window-size=500,500", "$fileUrl")

$proc = Start-Process -FilePath $chrome -ArgumentList $args -Wait -PassThru
Write-Output "Exit Code: $($proc.ExitCode)"
Write-Output "WebP exists: $(Test-Path $outWebp)"
if (Test-Path $outWebp) {
    Write-Output "Size: $((Get-Item $outWebp).Length) bytes"
}
Remove-Item $htmlPath, $outWebp -ErrorAction SilentlyContinue
