# Verifies a fine-grained token has Contents:write, then force-stores it for this repo.
# Run from the repo root:  .\set-gh-token.ps1
$ErrorActionPreference = 'Stop'

$sec = Read-Host "Paste your fine-grained token (input hidden)" -AsSecureString
$tok = ([System.Net.NetworkCredential]::new('', $sec).Password).Trim()
Write-Host ("Token: {0} chars, prefix {1}" -f $tok.Length, $tok.Substring(0,[Math]::Min(11,$tok.Length)))
$headers = @{ Authorization = "Bearer $tok"; "User-Agent" = "set-token"; Accept = "application/vnd.github+json" }

# 1) Who is it?
try { $login = (Invoke-RestMethod "https://api.github.com/user" -Headers $headers).login }
catch { Write-Host "X Token invalid/expired." -ForegroundColor Red; return }
Write-Host ("Authenticated as: {0}" -f $login)
if ($login -ne 'marcagnasr') { Write-Host "X Wrong account ($login). Need marcagnasr." -ForegroundColor Red; return }

# 2) Real Contents:write test - POST a ref with an all-zero sha.
#    403 => token lacks Contents:write. 422/409/404 => has write (just rejected the bogus sha).
$canWrite = $false
try {
    Invoke-RestMethod "https://api.github.com/repos/marcagnasr/nihongo-platform/git/refs" `
        -Method Post -Headers $headers `
        -Body '{"ref":"refs/heads/__probe__","sha":"0000000000000000000000000000000000000000"}' | Out-Null
    $canWrite = $true   # unexpected success
} catch {
    $code = [int]$_.Exception.Response.StatusCode
    if ($code -eq 403) { $canWrite = $false }
    elseif ($code -in 422,409,404,400) { $canWrite = $true }
    else { Write-Host ("Unexpected status {0}; treating as no-write." -f $code) -ForegroundColor Yellow; $canWrite = $false }
}

if (-not $canWrite) {
    Write-Host "X This token does NOT have 'Contents: Read and write'." -ForegroundColor Red
    Write-Host "  Fix it on GitHub (Fine-grained tokens > your token > Permissions > Contents = Read and write), then re-run." -ForegroundColor Yellow
    return
}
Write-Host "OK: token has Contents: write." -ForegroundColor Green

# 3) Force-overwrite the cached credential GCM serves to this repo.
$attrs = "protocol=https`nhost=github.com`npath=marcagnasr/nihongo-platform.git`nusername=marcagnasr"
$attrs | git credential reject 2>$null
"$attrs`npassword=$tok`n" | git credential approve
Write-Host "OK: stored token for marcagnasr@github.com/marcagnasr/nihongo-platform.git" -ForegroundColor Green
Write-Host "`nNow run:  git push -u origin master" -ForegroundColor Cyan
