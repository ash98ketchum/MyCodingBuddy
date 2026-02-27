# start-judge0.ps1
# Starts ONLY the Judge0 stack from docker-compose.yml.
# Run this before starting the backend in local development.
# Usage: .\start-judge0.ps1

Write-Host "`n🐳 Starting Judge0 stack..." -ForegroundColor Cyan

# Start all 4 Judge0 containers
docker compose up -d judge0-postgres judge0-redis judge0-server judge0-worker

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ docker compose failed. Make sure Docker Desktop is running." -ForegroundColor Red
    exit 1
}

Write-Host "`n⏳ Waiting for Judge0 to initialise (this takes ~30s on first run)..." -ForegroundColor Yellow
Write-Host "   Polling http://localhost:2358/languages ..." -ForegroundColor Gray

$maxAttempts = 30
$attempt     = 0
$ready       = $false

while ($attempt -lt $maxAttempts -and -not $ready) {
    Start-Sleep -Seconds 2
    $attempt++
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:2358/languages" -TimeoutSec 3 -ErrorAction Stop
        if ($resp.StatusCode -eq 200) {
            $ready = $true
        }
    } catch {
        # keep polling
    }
    Write-Host "   Attempt $attempt/$maxAttempts ..." -ForegroundColor Gray
}

if ($ready) {
    Write-Host "`n✅ Judge0 is ready at http://localhost:2358" -ForegroundColor Green
    Write-Host "   Languages endpoint: http://localhost:2358/languages" -ForegroundColor Gray
    Write-Host "   Submissions:        http://localhost:2358/submissions" -ForegroundColor Gray
    Write-Host "`n👉 Now start the backend:  cd backend && npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️  Judge0 did not respond after $maxAttempts attempts." -ForegroundColor Yellow
    Write-Host "   Check logs with: docker compose logs judge0-server" -ForegroundColor Gray
    Write-Host "   If this is first-time startup, wait another 30s and try:" -ForegroundColor Gray
    Write-Host "   Invoke-WebRequest http://localhost:2358/languages" -ForegroundColor Gray
}

Write-Host ""
