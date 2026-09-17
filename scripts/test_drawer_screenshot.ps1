$baseDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $baseDir

$indexPath = [System.IO.Path]::Combine((Get-Location).Path, "index.html")
$screenshotPath = [System.IO.Path]::Combine((Get-Location).Path, "assets\preview_drawer.webp")

$testHtml = [System.IO.File]::ReadAllText($indexPath, [System.Text.Encoding]::UTF8)
$scriptToInject = @"
<script>
setTimeout(() => {
  toggleInquiry(1);
  toggleInquiry(2);
  toggleInquiry(14);
  document.getElementById('inquiryDrawer').classList.add('open');
}, 600);
</script>
"@
$modified = $testHtml.Replace("</body>", "$scriptToInject</body>")
[System.IO.File]::WriteAllText("test_drawer.html", $modified, [System.Text.Encoding]::UTF8)

$testUrl = "file:///" + [System.IO.Path]::Combine((Get-Location).Path, "test_drawer.html").Replace("\", "/")
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"

$args = @(
    "--headless=new",
    "--screenshot=$screenshotPath",
    "--window-size=1440,1100",
    "--virtual-time-budget=4000",
    "$testUrl"
)

$p = Start-Process -FilePath $chrome -ArgumentList $args -Wait -PassThru
Remove-Item "test_drawer.html" -ErrorAction SilentlyContinue
Write-Output "Drawer screenshot created: $(Test-Path $screenshotPath)"
