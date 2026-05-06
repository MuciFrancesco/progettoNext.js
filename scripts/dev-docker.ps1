param(
  [switch]$Build,
  [switch]$ResetDb
)

$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

function Test-DockerDaemon {
  docker version --format '{{.Server.Version}}' *> $null
  return $LASTEXITCODE -eq 0
}

function Invoke-ComposeBuild {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Service
  )

  docker-compose build $Service
  if ($LASTEXITCODE -eq 0) { return }

  Write-Warning "Build Docker di $Service fallita. Pulisco la cache BuildKit e ritento una volta..."
  docker builder prune -f
  if ($LASTEXITCODE -ne 0) { Write-Error "docker builder prune fallito"; exit 1 }

  docker-compose build --no-cache $Service
  if ($LASTEXITCODE -ne 0) { Write-Error "docker-compose build $Service fallito"; exit 1 }
}

function Test-ServiceImage {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Service
  )

  $imageId = docker-compose images -q $Service 2>$null
  return -not [string]::IsNullOrWhiteSpace($imageId)
}

function Test-DatabaseInitialized {
  $probe = @'
const { Client } = require("pg");

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const result = await client.query("SELECT to_regclass('public.users') AS users_table");
  await client.end();
  process.exit(result.rows[0].users_table ? 0 : 2);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
'@

  $encodedProbe = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($probe))
  docker-compose exec -T -w /app/apps/backend backend node -e "eval(Buffer.from(process.argv[1], 'base64').toString('utf8'))" $encodedProbe
  if ($LASTEXITCODE -eq 0) { return $true }
  if ($LASTEXITCODE -eq 2) { return $false }

  Write-Error "Controllo inizializzazione database fallito."
  exit 1
}

Write-Host "`n[-1] Verifico Docker Desktop..." -ForegroundColor Cyan
if (-not (Test-DockerDaemon)) {
  Write-Error @"
Docker non e raggiungibile. Avvia Docker Desktop e aspetta che l'engine Linux sia pronto, poi rilancia:
  npm run dev:docker

Dettaglio: il daemon Docker non risponde su npipe:////./pipe/dockerDesktopLinuxEngine.
"@
  exit 1
}

Write-Host "`n[0] Preparo immagini Docker dev..." -ForegroundColor Cyan
if ($Build -or -not (Test-ServiceImage "backend")) {
  Invoke-ComposeBuild "backend"
}

if ($Build -or -not (Test-ServiceImage "frontend")) {
  Invoke-ComposeBuild "frontend"
}

Write-Host "`n[1] Avvio container dev con hot reload (DB + Backend + Frontend)..." -ForegroundColor Cyan
docker-compose up -d
if ($LASTEXITCODE -ne 0) { Write-Error "docker-compose up fallito"; exit 1 }

Write-Host "`n[2] Verifico database..." -ForegroundColor Cyan
$databaseReady = Test-DatabaseInitialized
if ($ResetDb -or -not $databaseReady) {
  if ($ResetDb) {
    Write-Host "Reset database richiesto: applico migration da zero." -ForegroundColor Yellow
  } else {
    Write-Host "Database non inizializzato: applico migration iniziali." -ForegroundColor Yellow
  }

  docker-compose exec -w /app/apps/backend backend node scripts/db-dev-restart.mjs
  if ($LASTEXITCODE -ne 0) { Write-Error "db migration fallita"; exit 1 }

  docker-compose exec -w /app/apps/backend backend npx prisma generate
  if ($LASTEXITCODE -ne 0) { Write-Warning "prisma generate fallito (probabilmente gia generato al build)" }

  docker-compose exec -w /app/apps/backend backend node scripts/seed-admin-once.mjs
  if ($LASTEXITCODE -ne 0) { Write-Error "seed admin fallito"; exit 1 }
} else {
  Write-Host "Database gia inizializzato: salto reset e seed." -ForegroundColor DarkGray
}

Write-Host "`nDocker dev avviato con hot reload." -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor DarkGray
Write-Host "  Backend:  http://localhost:3333" -ForegroundColor DarkGray
Write-Host "  Logs:     docker-compose logs -f backend frontend" -ForegroundColor DarkGray
Write-Host "`nQuando cambi dipendenze, Dockerfile o package-lock, rilancia:" -ForegroundColor DarkGray
Write-Host "  npm run dev:docker:build" -ForegroundColor DarkGray
Write-Host "`nPer resettare il DB dev:" -ForegroundColor DarkGray
Write-Host "  powershell -ExecutionPolicy Bypass -File scripts\dev-docker.ps1 -ResetDb" -ForegroundColor DarkGray
