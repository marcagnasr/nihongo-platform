# Securely tests a GitHub fine-grained token without echoing it.
# Run in your terminal:  .\test-gh-token.ps1
$sec = Read-Host "Paste your fine-grained token (input hidden)" -AsSecureString
$tok = [System.Net.NetworkCredential]::new('', $sec).Password
$tok = $tok.Trim()
Write-Host ("Token length: {0} chars; starts with: {1}" -f $tok.Length, $tok.Substring(0, [Math]::Min(11, $tok.Length)))

$headers = @{ Authorization = "Bearer $tok"; "User-Agent" = "token-test"; Accept = "application/vnd.github+json" }

Write-Host "`n--- Who does this token belong to? ---"
try {
    $u = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $headers
    Write-Host ("OK: authenticated as {0}" -f $u.login)
} catch {
    Write-Host ("FAILED ({0}): token is invalid/expired/malformed" -f $_.Exception.Response.StatusCode.value__)
    return
}

Write-Host "`n--- Access to marcagnasr/nihongo-platform? ---"
try {
    $r = Invoke-RestMethod -Uri "https://api.github.com/repos/marcagnasr/nihongo-platform" -Headers $headers
    Write-Host ("OK: can see {0}  (push permission = {1})" -f $r.full_name, $r.permissions.push)
    if (-not $r.permissions.push) { Write-Host "  -> Token can READ but NOT push. Add 'Contents: Read and write'." }
} catch {
    Write-Host ("FAILED ({0}): token cannot access this repo (not granted to it, or wrong resource owner)" -f $_.Exception.Response.StatusCode.value__)
}
