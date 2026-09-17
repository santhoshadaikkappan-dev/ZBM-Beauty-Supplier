# PowerShell script to run the local server and Chrome headless generator
$baseDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $baseDir

$port = 8989
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Output "HTTP server started on http://localhost:$port/"

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$chromeProcess = Start-Process -FilePath $chrome -ArgumentList "--headless=new", "http://localhost:$port/" -PassThru

$running = $true
$savedCount = 0

try {
    while ($running) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $url = $request.Url.LocalPath

        if ($url -eq "/" -or $url -eq "/generator.html") {
            $bytes = [System.IO.File]::ReadAllBytes("scripts\generator.html")
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
        } elseif ($url -eq "/js/products-data.js") {
            $bytes = [System.IO.File]::ReadAllBytes("js\products-data.js")
            $response.ContentType = "application/javascript; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
        } elseif ($url -eq "/save") {
            $id = $request.QueryString["id"]
            $target = "assets\images\products\product_$id.webp"
            $fs = [System.IO.File]::Create($target)
            $request.InputStream.CopyTo($fs)
            $fs.Close()
            $savedCount++
            if ($savedCount % 20 -eq 0 -or $savedCount -eq 202) {
                Write-Output "Progress: Saved $savedCount / 202 WebP images"
            }
            $buf = [System.Text.Encoding]::UTF8.GetBytes("OK")
            $response.ContentLength64 = $buf.Length
            $response.OutputStream.Write($buf, 0, $buf.Length)
            $response.Close()
        } elseif ($url -eq "/done") {
            Write-Output "All WebP images generated successfully!"
            $buf = [System.Text.Encoding]::UTF8.GetBytes("DONE")
            $response.ContentLength64 = $buf.Length
            $response.OutputStream.Write($buf, 0, $buf.Length)
            $response.Close()
            $running = $false
        } else {
            $response.StatusCode = 404
            $response.Close()
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
    if ($chromeProcess -and -not $chromeProcess.HasExited) {
        $chromeProcess.Kill()
    }
}
Write-Output "Finished! Total saved: $savedCount images."
