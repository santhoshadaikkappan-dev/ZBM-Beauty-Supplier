$raw = Get-Content -Raw -Path "js\products-data.js"
$startIdx = $raw.IndexOf('[')
$lastIdx = $raw.LastIndexOf(']')
$jsonStr = $raw.Substring($startIdx, $lastIdx - $startIdx + 1)
$items = $jsonStr | ConvertFrom-Json
Write-Output "Total Items: $($items.Count)"
$cats = $items | Group-Object category | Select-Object Name, Count
Write-Output "Total Categories: $($cats.Count)"
$cats | Format-Table -AutoSize
