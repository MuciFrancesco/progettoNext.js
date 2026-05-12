$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

Write-Host "`n[seed-thinkshop] Inserisco dati ThinkShop (prodotti, gallery, recensioni, ordini multi-prodotto)..." -ForegroundColor Cyan
docker-compose exec -T -w /app/apps/backend backend node scripts/seed-thinkshop-data.mjs
if ($LASTEXITCODE -ne 0) {
    Write-Error "db:seed:thinkshop fallito"
    exit 1
}

Write-Host "`nSeed ThinkShop completato." -ForegroundColor Green
