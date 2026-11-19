# VOLTEX - Electronic Parts Distribution & Wholesaling ERP

Production-ready, 3-tier Enterprise Resource Planning (ERP) application engineered for electronic component distribution, warehousing, and wholesale supply chain operations.

---

## 🏛 Architecture Overview

- **Frontend Tier (`frontend/`)**: Static SPA rendered with Tailwind CSS, FontAwesome, and vanilla JS. Built with an OOP-based `ERPAPIClient` communicating asynchronously with the backend. Served via an optimized `nginx:1.25-alpine` container with security headers and health checks.
- **Backend Tier (`backend/`)**: Layered Express.js service (`server.js`, `routes/`, `controllers/`, `models/`, `config/`) running on `node:18-alpine` as a non-root `node` user. Secured with Helmet, dynamic CORS validation, and rate limiting.
- **Data Tier (`PostgreSQL 15`)**: Relational PostgreSQL database with constraints, indexing (`status`, `created_at`, `order_id`, `item_id`, `category`), ACID transactions for order lifecycle and stock deductions, and initialization seed script.

---

## 🚀 Quick Start (Docker Compose)

### 1. Prerequisites
- Docker Engine & Docker Compose (v2.x)

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Launch Services
```bash
docker compose up -d --build
```

### 4. Access Application
- **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Backend API & Health:** [http://localhost:5000/health](http://localhost:5000/health)
- **PostgreSQL Database:** `localhost:5432`

---

## 🔒 Production Best Practices Implemented

1. **Clean Dependency Management:** Removed bloated, unused packages (`react`, `react-dom`, `react-scripts`) from frontend static deployment.
2. **Container Security:** Non-root execution (`USER node`) in backend Docker image to prevent privilege escalation; minimal Alpine bases.
3. **Graceful Shutdown:** `SIGTERM` and `SIGINT` lifecycle handling in Node.js server to drain connections and cleanly close PostgreSQL pools.
4. **Resilient Healthchecks:** Inter-service readiness checks (`service_healthy` on PostgreSQL and Backend) ensuring zero startup race conditions.
5. **Robust Database Layer:** Parameterized queries against SQL injection, strict schema check constraints, foreign key referential integrity with `ON DELETE RESTRICT`, and multi-column indexes.
