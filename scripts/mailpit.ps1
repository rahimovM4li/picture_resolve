# Lokales, ausschließlich an Loopback gebundenes Testpostfach für Windows x64.
$ErrorActionPreference = "Stop"
if ($env:PROCESSOR_ARCHITECTURE -ne "AMD64") { throw "Andere Architekturen siehe docs/qa/anfrageversand.md." }
$version = "v1.34.0"
$expected = "8f080d41374bf22686606374a0a483c8563c1bf29ae078179792392ff8c911d7"
$location = Join-Path $env:LOCALAPPDATA "PictureResolve\Mailpit"
New-Item -ItemType Directory -Path $location -Force | Out-Null
try {
  $existing = Invoke-RestMethod "http://127.0.0.1:8025/api/v1/info" -TimeoutSec 2
} catch { $existing = $null }
if ($existing.Version -eq $version) { Write-Output "Mailpit läuft auf http://127.0.0.1:8025."; return }
$archive = Join-Path $location "mailpit-windows-amd64.zip"
if (!(Test-Path -LiteralPath $archive) -or (Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash -ne $expected) {
  Invoke-WebRequest "https://github.com/axllent/mailpit/releases/download/$version/mailpit-windows-amd64.zip" -OutFile $archive
}
if ((Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash -ne $expected) { throw "Mailpit-Prüfsumme stimmt nicht." }
Expand-Archive -LiteralPath $archive -DestinationPath $location -Force
$database = Join-Path $location "inbox.db"
Start-Process -FilePath (Join-Path $location "mailpit.exe") -WindowStyle Hidden -ArgumentList '--listen','127.0.0.1:8025','--smtp','127.0.0.1:4125','--database',('"' + $database + '"'),'--max','100','--max-age','7d','--disable-version-check'
Start-Sleep -Milliseconds 600
$info = Invoke-RestMethod "http://127.0.0.1:8025/api/v1/info" -TimeoutSec 5
Write-Output "Mailpit $($info.Version) läuft auf http://127.0.0.1:8025 (SMTP 127.0.0.1:4125)."
