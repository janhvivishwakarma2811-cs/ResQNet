# ResQNet One-Click Startup Script
# Starts Spring Boot 3 Backend and Vite React Frontend

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting ResQNet Disaster Coordination System " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$javaHome = $env:JAVA_HOME
if ([string]::IsNullOrWhiteSpace($javaHome)) {
    $javaCommand = Get-Command java.exe -ErrorAction SilentlyContinue
    if ($null -eq $javaCommand) {
        Write-Error "Java 25 is required. Install a Java 25 JDK or set JAVA_HOME to its installation directory."
        exit 1
    }

    $javaHome = Split-Path -Parent (Split-Path -Parent $javaCommand.Source)
}

$javaExecutable = Join-Path $javaHome "bin\java.exe"
if (-not (Test-Path $javaExecutable)) {
    Write-Error "JAVA_HOME does not point to a JDK: $javaHome"
    exit 1
}

$javaVersionOutput = & $javaExecutable -version 2>&1 | Out-String
if ($javaVersionOutput -notmatch 'version "25(?:\.|")') {
    Write-Error "Java 25 is required. Found: $javaVersionOutput"
    exit 1
}

$env:JAVA_HOME = $javaHome
$env:Path = "$javaHome\bin;$env:Path"
Write-Host "Using Java 25 from $javaHome" -ForegroundColor Cyan

# Start Backend in new window
Write-Host "Launching Spring Boot 3 Backend on port 8080..." -ForegroundColor Green
Start-Process powershell -WorkingDirectory (Join-Path $projectRoot "backend") -ArgumentList "-NoExit", "-Command", "mvn spring-boot:run"

# Start Frontend in new window
Write-Host "Launching React Vite Frontend on port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\frontend'; npm run dev -- --host"

Write-Host "`nResQNet is starting up!" -ForegroundColor Cyan
Write-Host "Web Application: http://localhost:5173" -ForegroundColor White
Write-Host "API Swagger Docs: http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host "`nTest Accounts:" -ForegroundColor Yellow
Write-Host " - Citizen:   citizen@resqnet.org   / Citizen@123" -ForegroundColor White
Write-Host " - Responder: responder@resqnet.org / Responder@123" -ForegroundColor White
Write-Host " - EOC Admin: admin@resqnet.org     / Admin@123" -ForegroundColor White
