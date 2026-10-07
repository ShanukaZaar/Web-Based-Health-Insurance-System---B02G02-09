# Cloud Deployment Guide: Web-Based Health Insurance Management System
**SE2030 - Software Engineering | SLIIT University (Group MLBB2G209)**

This guide walks you through deploying the full-stack system completely for free using modern cloud PaaS providers:
- **Database**: Managed MySQL (TiDB Cloud Serverless or Railway)
- **Backend API**: Spring Boot 3 on Render (or Railway)
- **Frontend UI**: React + Vite on Vercel (or Netlify)

---

## Architecture Flow

```
[User Browser]
      │
      ▼
[Vercel / Netlify] ──(HTTPS Frontend: React + Vite)
      │
      ▼ (API calls to /api/*)
[Render / Railway] ──(HTTPS Backend REST API: Spring Boot 3 + Java 21)
      │
      ▼ (JDBC connection)
[TiDB / Railway Cloud MySQL] ──(MySQL 8 Database: health_insurance_db)
```

---

## Phase 1: Set Up Cloud MySQL Database

You need a remotely accessible MySQL 8-compatible database. Two recommended free options:

### Option A: TiDB Cloud Serverless (Free Forever, 5GB storage)
1. Sign up at [https://tidbcloud.com](https://tidbcloud.com).
2. Click **Create Cluster** -> Choose **Serverless (Free)**.
3. Once provisioned, click **Connect**:
   - Choose **General** connection.
   - Note down: **Host**, **Port** (usually `4000`), **User**, and **Password**.
4. In the web **Chat2Query** or **SQL Editor** tab:
   ```sql
   CREATE DATABASE IF NOT EXISTS health_insurance_db;
   USE health_insurance_db;
   ```
5. *(Optional)* Copy and run the contents of [database/schema.sql](file:///c:/Users/nemsi/Desktop/Web-Based-Health-Insurance-System---B02G02-09/database/schema.sql) and [database/seed.sql](file:///c:/Users/nemsi/Desktop/Web-Based-Health-Insurance-System---B02G02-09/database/seed.sql). (Note: Spring Boot's Hibernate will automatically create tables on first run via `ddl-auto: update`).

### Option B: Railway MySQL
1. Go to [https://railway.app](https://railway.app).
2. Click **New Project** -> **Provision MySQL**.
3. Under the MySQL service **Variables** tab, note:
   - `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`.

---

## Phase 2: Deploy Backend (Spring Boot 3) on Render

1. Push your repository to GitHub.
2. Sign in to [https://render.com](https://render.com) and click **New +** -> **Web Service**.
3. Connect your GitHub repository:
   - **Name**: `health-insurance-backend`
   - **Root Directory**: `backend`
   - **Language / Environment**: **Docker** (Render will use `backend/Dockerfile` with Java 21)
   - **Region**: Choose closest to you (e.g. Singapore / Frankfurt)
   - **Instance Type**: **Free**
4. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `DB_URL` | `jdbc:mysql://<HOST>:<PORT>/health_insurance_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC` |
   | `DB_USERNAME` | `<DB_USERNAME>` |
   | `DB_PASSWORD` | `<DB_PASSWORD>` |
   | `DB_DRIVER` | `com.mysql.cj.jdbc.Driver` |

5. Click **Create Web Service**.
6. Wait for the Docker build to complete (approx. 2-3 minutes).
7. Test the deployed backend in your browser:
   ```
   https://<your-backend-name>.onrender.com/api/health
   ```
   Should return: `{"status":"UP", ...}`.
   Note down this base URL: `https://<your-backend-name>.onrender.com/api`

---

## Phase 3: Deploy Frontend (React + Vite) on Vercel

1. Sign in to [https://vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project** -> Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables**:
   | Key | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://<your-backend-name>.onrender.com/api` |
5. Click **Deploy**.
6. Vercel automatically applies `frontend/vercel.json` so React Router paths (e.g., `/policies`, `/tickets`, `/claims`) refresh without 404 errors.
7. Your app is now live at: `https://<your-project>.vercel.app`!

---

## Phase 4: Alternative Single-Host / VPS Deployment (Docker Compose)

If deploying to a single Ubuntu VPS (e.g., AWS EC2, DigitalOcean, Linode) or testing locally:

1. Clone repository onto the server.
2. Run:
   ```bash
   docker compose up -d --build
   ```
3. Services exposed:
   - Frontend UI: `http://<server-ip>:3000`
   - Backend API: `http://<server-ip>:8080/api`
   - MySQL: `localhost:3306`
