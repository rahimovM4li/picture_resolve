# Lokaler, getrennt geschützter Zugang für die Abnahme auf diesem Rechner.
param([string]$Caddy = ".local/caddy/caddy.exe")
$ErrorActionPreference = "Stop"
$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$dir = Join-Path $root ".local/caddy"
$bin = (Resolve-Path $Caddy).Path
New-Item -ItemType Directory -Force $dir | Out-Null
$file = Join-Path $dir "testzugang.txt"
if (!(Test-Path -LiteralPath $file)) {
  $password = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(24))
  @("abnahme", $password) | Set-Content -LiteralPath $file
}
$credentials = Get-Content -LiteralPath $file
$hash = ($credentials[1] | & $bin hash-password).Trim()
if ($LASTEXITCODE -ne 0) { throw "Das Zugangspasswort konnte nicht gehasht werden." }
# Die lokale CA bleibt im Projekt. Caddy verändert keinen Zertifikatsspeicher.
$config = @"
{
  admin off
  skip_install_trust
  auto_https disable_redirects
  storage file_system {
    root .local/caddy/pki-storage
  }
}
https://localhost:4443 {
  bind 127.0.0.1 ::1
  tls internal
  basic_auth {
    abnahme $hash
  }
  header X-Robots-Tag "noindex, nofollow, noarchive"
  request_body {
    max_size 66MB
  }
  reverse_proxy 127.0.0.1:4281 {
    header_up X-Real-IP {remote_host}
  }
}
"@
$config | Set-Content -LiteralPath (Join-Path $dir "Caddyfile") -Encoding utf8NoBOM
Start-Process -FilePath $bin -WorkingDirectory $root -ArgumentList "run","--config",".local/caddy/Caddyfile" -WindowStyle Hidden -RedirectStandardOutput (Join-Path $dir "out.log") -RedirectStandardError (Join-Path $dir "err.log")
Write-Output "Lokaler Testzugang: https://localhost:4443/ (Anmeldung in .local/caddy/testzugang.txt)"
