$baseDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $baseDir

$indexPath = [System.IO.Path]::Combine((Get-Location).Path, "index.html")
$screenshotPath = [System.IO.Path]::Combine((Get-Location).Path, "assets\preview_refresher.webp")

$testHtml = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
$modified = $testHtml.Replace("</body>", "<script>setTimeout(() => { openRefresherForProduct(2); }, 600);</script></body>")
[System.IO.File]::WriteAllText("test_refresher.html", $modified, [System.Text.Encoding]::UTF8)

$testUrl = "file:///" + [System.IO.Path]::Combine((Get-Location).Path, "test_refresher.html").Replace("\", "/")
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"

$args = @(
    "--headless=new",
    "--screenshot=$screenshotPath",
    "--window-size=1440,1100",
    "--virtual-time-budget=4000",
    "$testUrl"
)

$p = Start-Process -FilePath $chrome -ArgumentList $args -Wait -PassThru
Remove-Item "test_refresher.html" -ErrorAction SilentlyContinue
Write-Output "Refresher screenshot created: $(Test-Path $screenshotPath)"
