# Web-Based Health Insurance Management System

> **SE2030 - Software Engineering | SLIIT University**  
> **Group MLBB2G209**

A modern, full-stack enterprise web application designed to streamline health insurance operations, including policy management, claim submissions and approvals, payment processing, hospital network management, customer support ticketing, and administrative reporting.

---

## 🚀 Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React.js (v18+) | UI Framework built with Vite build tool |
| **Styling** | Tailwind CSS | Utility-first responsive styling framework |
| **Routing** | React Router (v6) | Single-page application routing |
| **HTTP Client** | Axios | Modular REST API service integration |
| **Backend** | Java 17+ / Spring Boot 3.3.x | Enterprise RESTful API services |
| **Architecture** | Layered Architecture | Controller -> Service -> Repository -> Entity / DTO |
| **Security** | Spring Security | Security filter chain and authentication scaffolding |
| **ORM / Data** | Spring Data JPA / Hibernate | Object-Relational Mapping |
| **Database** | MySQL 8 | Relational database storage |
| **Build Tool** | Apache Maven | Project dependency and build management |

---

## 📁 Repository Directory Structure

```
health-insurance-system/
├── frontend/          # React.js + Vite + Tailwind CSS Single Page Application
├── backend/           # Spring Boot 3 Java Enterprise REST API Application
├── database/          # SQL schema DDL reference and Hibernate migration guide
├── docs/              # System architecture diagrams, SRS, and design documentation
├── .env.example       # Example environment variables template
├── .gitignore         # Version control ignore definitions
├── CONTRIBUTING.md    # Branching conventions and pull request workflow
└── README.md          # Project overview & documentation
```

---

## 👥 Team Information (Group MLBB2G209)

| Name | Role / Module Assignment | Student ID |
|---|---|---|
| Member 1 | Policy Management Module | ITXXXXXXXX |
| Member 2 | Claim Management Module | ITXXXXXXXX |
| Member 3 | Payment Management Module | ITXXXXXXXX |
| Member 4 | Hospital Network Module | ITXXXXXXXX |
| Member 5 | Customer Support Module | ITXXXXXXXX |
| Member 6 | Admin & System Reporting Module | ITXXXXXXXX |

---

## ⚡ Quick Start Guide

### Prerequisites
- **Java JDK**: Version 17 or higher
- **Node.js**: Version 18 or higher (with `npm`)
- **MySQL Server**: Version 8.0+

### 1. Setting Up the Backend
```bash
cd backend

# Copy environment template
cp ../.env.example .env

# Compile and start Spring Boot application (using local Maven or Wrapper)
mvn spring-boot:run
```
The backend API server will start on `http://localhost:8080`.  
Verify status by visiting: `http://localhost:8080/api/health`

### 2. Setting Up the Frontend
```bash
cd frontend

# Install npm dependencies
npm install

# Start Vite local development server
npm run dev
```
The frontend UI application will start on `http://localhost:3000` (or `http://localhost:5173`).

---

## 🔒 Security & Environment Setup
- Do **not** commit real database passwords or API keys to repository.
- Always update local parameters in `.env` files which are excluded via `.gitignore`.
