$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

Write-Host "`n[1/1] Fermo tutti i container Docker (DB + Backend + Frontend)..." -ForegroundColor Yellow
docker-compose down -v
if ($LASTEXITCODE -ne 0) { Write-Warning "docker-compose down ha restituito un errore (potrebbe essere gia fermo)." }
else { Write-Host "Tutti i container fermati e volumi rimossi." -ForegroundColor Green }

Write-Host "`nTutto fermato." -ForegroundColor Cyan
exit 0
