# run.ps1
# Sets local MySQL connection env vars and starts the Spring Boot backend.
# Usage: from the backend folder, run:  .\run.ps1

$env:DB_URL      = "jdbc:mysql://127.0.0.1:3306/health_insurance_db?useSSL=false&serverTimezone=UTC"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "Shanuka123"
$env:DB_DRIVER   = "com.mysql.cj.jdbc.Driver"

.\mvnw spring-boot:run
