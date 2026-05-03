$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

Write-Host "`n[seed-demo] Inserisco dati demo (prodotti, utenti, ordini)..." -ForegroundColor Cyan
docker-compose exec -w /app/apps/backend backend node scripts/seed-demo-data.mjs
if ($LASTEXITCODE -ne 0) {
    Write-Error "db:seed:demo fallito"
    exit 1
}

Write-Host "`nSeed demo completato." -ForegroundColor Green
