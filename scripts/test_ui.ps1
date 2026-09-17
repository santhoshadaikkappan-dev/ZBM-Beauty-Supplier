$baseDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $baseDir

$indexPath = [System.IO.Path]::Combine((Get-Location).Path, "index.html")
$screenshotPath = [System.IO.Path]::Combine((Get-Location).Path, "assets\preview_catalogue.webp")
$fileUrl = "file:///" + $indexPath.Replace("\", "/")
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"

$args = @(
    "--headless=new",
    "--screenshot=$screenshotPath",
    "--window-size=1440,1800",
    "--virtual-time-budget=5000",
    "$fileUrl"
)

$p = Start-Process -FilePath $chrome -ArgumentList $args -Wait -PassThru
Write-Output "Chrome Exit Code: $($p.ExitCode)"
Write-Output "Screenshot created: $(Test-Path $screenshotPath)"
if (Test-Path $screenshotPath) {
    Write-Output "Screenshot size: $((Get-Item $screenshotPath).Length) bytes"
}
