$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

Write-Host "`n[0] Build TypeScript frontend (type-check + Next.js build)..." -ForegroundColor Cyan
Set-Location "$root/apps/frontend"
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Build frontend fallita. Correggi gli errori prima di avviare i container."; exit 1 }
Set-Location $root

Write-Host "`n[1] Pulizia container orfani..." -ForegroundColor DarkGray
docker-compose down --remove-orphans 2>$null

Write-Host "`n[2] Build e avvio di tutti i container (DB + Backend + Frontend)..." -ForegroundColor Cyan
docker-compose up --build -d
if ($LASTEXITCODE -ne 0) { Write-Error "docker-compose up fallito"; exit 1 }

Write-Host "`n[3] Attendo che il backend sia pronto e applico migration + seed admin..." -ForegroundColor Cyan
docker-compose exec -w /app/apps/backend backend node scripts/db-dev-restart.mjs
if ($LASTEXITCODE -ne 0) { Write-Error "db migration fallita"; exit 1 }

docker-compose exec -w /app/apps/backend backend npx prisma generate
if ($LASTEXITCODE -ne 0) { Write-Warning "prisma generate fallito (probabilmente gia generato al build)" }

docker-compose exec -w /app/apps/backend backend node scripts/seed-admin-once.mjs
if ($LASTEXITCODE -ne 0) { Write-Error "seed admin fallito"; exit 1 }

Write-Host "`nTutto avviato! Logs: docker-compose logs -f" -ForegroundColor Green
Write-Host "  DB:       localhost:5432" -ForegroundColor DarkGray
Write-Host "  Backend:  http://localhost:3333" -ForegroundColor DarkGray
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor DarkGray
