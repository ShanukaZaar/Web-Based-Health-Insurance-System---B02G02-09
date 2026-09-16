# Web-Based Health Insurance Management System
**SE2030 - Software Engineering | SLIIT University**
**Group MLBB2G209**

A modern, full-stack enterprise web application designed to streamline health insurance operations, including policy management, claim submissions and approvals, payment processing, hospital network management, customer support ticketing, and administrative reporting.

## 🚀 Tech Stack

| Layer | Technology | Description |
|---|---|---|
| Frontend | React.js (v18+) | UI Framework built with Vite build tool |
| Styling | Tailwind CSS | Utility-first responsive styling framework |
| Routing | React Router (v6) | Single-page application routing |
| HTTP Client | Axios | Modular REST API service integration |
| Backend | Java 17+ / Spring Boot 3.3.x | Enterprise RESTful API services |
| Architecture | Layered Architecture | Controller → Service → Repository → Entity / DTO |
| Security | Spring Security | Security filter chain and authentication scaffolding |
| ORM / Data | Spring Data JPA / Hibernate | Object-Relational Mapping |
| Database | MySQL 8 | Relational database storage (mandatory for this project) |
| Build Tool | Apache Maven | Project dependency and build management |

## 📁 Repository Directory Structure

```
health-insurance-system/
├── frontend/          # React.js + Vite + Tailwind CSS Single Page Application
├── backend/           # Spring Boot 3 Java Enterprise REST API Application
├── database/          # SQL schema DDL (schema.sql) — run this to set up your local MySQL database
├── docs/              # System architecture diagrams, SRS, and design documentation
├── .env.example       # Example environment variables template
├── .gitignore         # Version control ignore definitions
├── CONTRIBUTING.md    # Branching conventions and pull request workflow
└── README.md          # Project overview & documentation
```

## 👥 Team Information (Group MLBB2G209)

| Name | Role / Module Assignment | Student ID |
|---|---|---|
| Perera W.W.M.D | Policy Management Module | IT25103980 |
| Sarathchandra G.W.S.I | Claim Management Module | IT25101964 |
| Lakshani J.D.C | Payment Management Module | IT25101957 |
| Jayalath W.A.D | Hospital Network Module | IT25103984 |
| Nemsith K.B.N | Customer Support Module | IT25101054 |
| Dhimantha W.L.T | Admin & System Reporting Module | IT25102885 |

## ⚡ Quick Start Guide

### Prerequisites
- **Java JDK**: Version 17 or higher
- **Node.js**: Version 18 or higher (with npm)
- **MySQL Server**: Version 8.0+ (must be installed and running locally)

### 1. Set up your local MySQL database

Every team member runs their **own local MySQL instance** — not a shared central database — using their own credentials. The database name must match exactly so everyone's setup stays consistent:

```bash
mysql -u root -p
```
```sql
CREATE DATABASE health_insurance_db;
exit
```

Then load the schema:
```bash
mysql -u root -p health_insurance_db < database/schema.sql
```

### 2. Configure database environment variables

`application.yml` reads database credentials from environment variables (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DRIVER`) — it does **not** read a `.env` file automatically. Set these directly in your terminal session before running the backend:

**Windows (PowerShell):**
```powershell
$env:DB_URL="jdbc:mysql://127.0.0.1:3306/health_insurance_db?useSSL=false&serverTimezone=UTC"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
$env:DB_DRIVER="com.mysql.cj.jdbc.Driver"
```

**Mac/Linux (bash/zsh):**
```bash
export DB_URL="jdbc:mysql://127.0.0.1:3306/health_insurance_db?useSSL=false&serverTimezone=UTC"
export DB_USERNAME="root"
export DB_PASSWORD="your_mysql_password"
export DB_DRIVER="com.mysql.cj.jdbc.Driver"
```

> If these variables are left unset, the app falls back to an in-memory H2 database — convenient for a quick UI-only test, but **all data resets on every restart** and does not reflect the project's required MySQL setup.

### 3. Start the backend

```bash
cd backend
./mvnw spring-boot:run      # Mac/Linux
.\mvnw spring-boot:run      # Windows
```

The backend API server will start on `http://localhost:8080`.
Verify status by visiting: `http://localhost:8080/api/health`

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend UI application will start on **`http://localhost:5173`** (Vite's default port).

## 🔒 Security & Environment Setup

- Do not commit real database passwords, API keys, or a real `.env` file to the repository — only `.env.example` (with placeholder values) belongs in Git.
- Each member's MySQL root password is personal and local — never shared or hardcoded into `application.yml`.
- If you add or change a column/table for your module, update `database/schema.sql` in the same commit/PR and let the team know, so everyone's local database stays in sync.
