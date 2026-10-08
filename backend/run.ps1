# run.ps1
# Sets local MySQL connection env vars and starts the Spring Boot backend.
# Usage: from the backend folder, run:  .\run.ps1


$env:JAVA_HOME = "C:\Program Files\Java\jdk-21.0.12.1"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
$env:SERVER_PORT = "8080"
$env:DB_URL = "jdbc:mysql://127.0.0.1:3306/health_insurance_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "Shanuka123"
$env:DB_DRIVER = "com.mysql.cj.jdbc.Driver"

.\mvnw spring-boot:run
