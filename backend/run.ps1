# run.ps1
# Sets local MySQL connection env vars and starts the Spring Boot backend.
# Usage: from the backend folder, run:  .\run.ps1
if (Test-Path "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot") {
    $env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot"
    $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
}

# Free port 8080 if an existing backend instance is currently holding it
$conn = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
if ($conn) {
    Write-Host "Port 8080 is already in use by PID $($conn.OwningProcess). Stopping existing process..." -ForegroundColor Yellow
    Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

$env:SERVER_PORT = "8080"
$env:DB_URL = "jdbc:mysql://127.0.0.1:3306/health_insurance_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "mysql123"
$env:DB_DRIVER = "com.mysql.cj.jdbc.Driver"

.\mvnw spring-boot:run

