Write-Host "▶ Step 1: Pulling latest websites from Git..." -ForegroundColor Cyan
git pull origin main

Write-Host "`n▶ Step 2: Starting Docker container..." -ForegroundColor Cyan
docker compose up -d --force-recreate

Write-Host "`n✓ Success! Custom websites deployed on port 8080." -ForegroundColor Green
docker compose ps
pause
