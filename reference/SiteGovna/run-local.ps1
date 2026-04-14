# Запуск референса Atelier Local (Node.js 20+).
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Установите Node.js 20+ с https://nodejs.org/ и повторите запуск." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    $secret = node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
    (Get-Content ".env" -Raw) -replace 'AUTH_SECRET="[^"]*"', "AUTH_SECRET=`"$secret`"" | Set-Content ".env" -NoNewline
    Write-Host "Создан .env из .env.example (новый AUTH_SECRET)." -ForegroundColor Green
}

npm install
npx prisma db push
npm run db:seed
Write-Host "Сервер: http://localhost:3000" -ForegroundColor Green
npm run dev
