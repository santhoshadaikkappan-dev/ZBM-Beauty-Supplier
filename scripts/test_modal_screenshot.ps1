$baseDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $baseDir

$indexPath = [System.IO.Path]::Combine((Get-Location).Path, "index.html")
$screenshotPath = [System.IO.Path]::Combine((Get-Location).Path, "assets\preview_modal.webp")

# Create a test runner that triggers openProductModal(1) automatically on load
$testHtml = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
$modified = $testHtml.Replace("</body>", "<script>setTimeout(() => { openProductModal(1); }, 600);</script></body>")
[System.IO.File]::WriteAllText("test_modal.html", $modified, [System.Text.Encoding]::UTF8)

$testUrl = "file:///" + [System.IO.Path]::Combine((Get-Location).Path, "test_modal.html").Replace("\", "/")
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"

$args = @(
    "--headless=new",
    "--screenshot=$screenshotPath",
    "--window-size=1440,1100",
    "--virtual-time-budget=4000",
    "$testUrl"
)

$p = Start-Process -FilePath $chrome -ArgumentList $args -Wait -PassThru
Remove-Item "test_modal.html" -ErrorAction SilentlyContinue
Write-Output "Modal screenshot created: $(Test-Path $screenshotPath)"
