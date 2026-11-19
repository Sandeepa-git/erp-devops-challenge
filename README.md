# 🚗 Thrusha Motors ERP — CloudSpace DevOps Rescue Challenge

[![Docker](https://img.shields.io/badge/Docker-24.0+-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Docker Compose](https://img.shields.io/badge/Compose-v2+-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![Docker Hub](https://img.shields.io/badge/Docker_Hub-Registry-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18_Alpine-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

This is the **CloudSpace team selection challenge**. It tests how well you can troubleshoot a broken application, containerize it with Docker, and automate image delivery with GitHub Actions.

---

> [!CAUTION]
> ## ⚠️ AI-Assisted Development and Disqualification Policy
>
> - This challenge checks **your own** troubleshooting and DevOps skills.
> - AI coding assistants and AI agents (including but not limited to **Claude, ChatGPT, GitHub Copilot, Cursor, Antigravity** and similar tools) **must not** generate, modify, commit or push any code, configuration or workflow in your submission.
> - The OC will check the GitHub contributors list, commit history, commit authors and commit timestamps.
> - **Any confirmed AI-generated contribution, or any commit from an AI or bot identity, leads to immediate disqualification.**

---

## 📖 Table of Contents

1. [The Story](#-the-story)
2. [Technology Stack](#-technology-stack)
3. [Application Architecture](#-application-architecture)
4. [Prerequisites](#-prerequisites)
5. [Getting Started — Create Your `cloudspace` Repository](#-getting-started--create-your-cloudspace-repository)
6. [The Missions](#-the-missions)
   - [Mission 1 — The Frontend Will Not Show Up](#mission-1--the-frontend-will-not-show-up)
   - [Mission 2 — The Frontend Cannot Reach the Backend](#mission-2--the-frontend-cannot-reach-the-backend)
   - [Mission 3 — The Backend Image Will Not Build](#mission-3--the-backend-image-will-not-build)
   - [Mission 4 — The Frontend Image Will Not Build](#mission-4--the-frontend-image-will-not-build)
   - [Mission 5 — Bring the Whole System Up](#mission-5--bring-the-whole-system-up)
   - [Mission 6 — Ship It to Docker Hub with GitHub Actions](#mission-6--ship-it-to-docker-hub-with-github-actions)
7. [Submission — How to Send Your Work](#-submission--how-to-send-your-work)
8. [How the OC Will Evaluate You](#-how-the-oc-will-evaluate-you)
9. [Competition Rules](#-competition-rules)
10. [Useful Commands](#-useful-commands)

---

## 📜 The Story

**Thrusha Motors (Pvt) Ltd.** runs an internal **ERP system** to manage its electronic parts inventory, customer orders, low-stock alerts and sales dashboard.

The system was built by an **intern** who has now left the company. The intern made a few changes "to make it work on my machine" and pushed them straight to the repository. Since then:

- The frontend does not load properly.
- The frontend cannot talk to the backend.
- The Docker images do not build.
- Nobody knows how to deploy it.

Management has called you in as a **Senior DevOps Engineer**. Your job:

1. Troubleshoot and fix every problem the intern left behind.
2. Make the full system start with **one command**: `docker compose up -d --build`.
3. Build a **GitHub Actions** pipeline that pushes the frontend and backend images to **Docker Hub**, tagged with **your team name**.

> [!NOTE]
> The intern did **not** break the business logic. The orders, inventory and dashboard code are fine. The problems are in **configuration, wiring and Dockerfiles**. Read the error messages: they tell you more than you think.

---

## 🛠 Technology Stack

| Layer | Technology | Version / Base Image | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 18 + Vite 5 | `node:18-alpine` (build stage) | Single Page Application (SPA) |
| **Frontend UI** | Tailwind CSS (CDN), FontAwesome, Google Fonts | CDN | Styling and icons |
| **Frontend Web Server** | Nginx | `nginx:1.25-alpine` | Serves the compiled static files |
| **Backend API** | Node.js + Express 4 | `node:18-alpine` | REST API and business logic |
| **Backend Security** | Helmet, CORS, express-rate-limit | npm packages | HTTP hardening and rate limiting |
| **Database Driver** | `pg` (node-postgres) | npm package | PostgreSQL connection pool |
| **Database** | PostgreSQL | `postgres:15-alpine` | Stores inventory and orders, seeded by `init.sql` |
| **Containerization** | Docker (multi-stage builds) | Docker Engine 24+ | Packages each service as an image |
| **Orchestration** | Docker Compose | Compose v2 | Runs the 3 services together |
| **CI/CD** | GitHub Actions | `ubuntu-latest` runner | Builds and pushes images |
| **Image Registry** | Docker Hub | `hub.docker.com` | Stores the final images |

### Project Structure

```text
.
├── docker-compose.yml
├── backend
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── src
│       ├── server.js
│       ├── config/db.js
│       ├── controllers/erpController.js
│       ├── models/erpModel.js
│       ├── routes/erpRoutes.js
│       └── db/init.sql
└── frontend
    ├── Dockerfile
    ├── .dockerignore
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src
        ├── main.jsx
        ├── App.jsx
        └── api.js
```

> [!IMPORTANT]
> **No `.env` file is needed.** Every environment variable the system needs is already in `docker-compose.yml`. Do not add a `.env` file to your repository.

---

## 🏛 Application Architecture

```text
                ┌──────────────────────────────┐
                │        User's Browser        │
                └──────────────┬───────────────┘
                               │
            http://localhost:3000   (UI)
            http://localhost:5000/api  (API calls from the browser)
                               │
   ┌───────────────────────────┼──────────────────────────────┐
   │  Docker Compose network   │                              │
   │                           ▼                              │
   │  ┌───────────────────┐   ┌───────────────────┐           │
   │  │ frontend (Nginx)  │   │ backend (Express) │           │
   │  │ container port 80 │   │ container port    │           │
   │  │ host port 3000    │   │ 5000              │           │
   │  └───────────────────┘   └─────────┬─────────┘           │
   │                                    │ db:5432             │
   │                          ┌─────────▼─────────┐           │
   │                          │ db (PostgreSQL)   │           │
   │                          │ host port 51434   │           │
   │                          └───────────────────┘           │
   └──────────────────────────────────────────────────────────┘
```

| Service | Container Name | Host URL / Port |
| :--- | :--- | :--- |
| Frontend | `erp_frontend` | http://localhost:3000 |
| Backend API | `erp_backend` | http://localhost:5000/api |
| Backend health | `erp_backend` | http://localhost:5000/health |
| Database | `erp_database` | `localhost:51434` (user `postgres`, password `postgres`, database `erp_db`) |

---

## 📋 Prerequisites

Install these before you start:

1. **Git** (v2.30+)
2. **Node.js 18+** and **npm** (for Missions 1 and 2)
3. **Docker Desktop** or **Docker Engine** (v24+) with **Docker Compose v2**
4. A **GitHub account**

Check your setup:

```bash
git --version
node --version
npm --version
docker --version
docker compose version
```

---

## 🚀 Getting Started — Create Your `cloudspace` Repository

You **must not** work on the public challenge repository directly. Clone it and push it to a **new repository on your own GitHub account** named exactly **`cloudspace`**.

**Step 1 — Create a new empty repository on GitHub**

- Repository name: **`cloudspace`**
- Visibility: **Public**
- Do **not** add a README, `.gitignore` or license (keep it empty).

**Step 2 — Clone the challenge repository and point it at your new repository**

```bash
git clone <PUBLIC_CHALLENGE_REPO_URL> cloudspace
cd cloudspace
git remote remove origin
git remote add origin https://github.com/<your-github-username>/cloudspace.git
git branch -M main
git push -u origin main
```

**Step 3 — Do all your work in this repository** and commit with clear commit messages. The OC will read your commit history.

---

## 🎯 The Missions

Work through the missions **in order**. Each mission unlocks the next one. Every mission gives you a **symptom** and a **clue**. The clues are small on purpose. Finding the real cause is your job.

---

### Mission 1 — The Frontend Will Not Show Up

Start the frontend manually, without Docker:

```bash
cd frontend
npm install
npm run dev
```

**Symptom:** Vite says the dev server is ready, and you open http://localhost:3000 in the browser. You see **an empty white page**. No sidebar, no dashboard, nothing.

> [!TIP]
> **🔍 Clue:** Every React app needs a front door. The browser knocks on the door that `index.html` points to. Is anybody living behind that door? Look at the **Vite terminal** and the browser **DevTools Console** at the same time.

✅ **Done when:** The VOLTEX ERP dashboard (sidebar, stat cards, inventory) appears in the browser.

---

### Mission 2 — The Frontend Cannot Reach the Backend

Now run the backend manually. It needs a database, so start **only** the database with Docker:

```bash
docker compose up -d db
```

Then, in a **new terminal**, start the backend and tell it where the database is:

```bash
cd backend
npm install
DB_PORT=51434 npm run dev
```

On Windows PowerShell use:

```powershell
cd backend
npm install
$env:DB_PORT="51434"; npm run dev
```

Check the backend on its own: open http://localhost:5000/health and http://localhost:5000/api/inventory. Both should return JSON.

**Symptom:** The backend works when you call it directly. But in the frontend, the **Backend Sync** box at the bottom of the sidebar stays **red**, the **Orders** page is empty, and the dashboard numbers stay at zero.

> [!TIP]
> **🔍 Clue:** The frontend is knocking on a door where nobody lives. Open **DevTools → Network** and look at **where** the requests are going. Then read the backend's first log line: it tells you **which port** it listens on. And look at `server.js`: under **which path** are the routes mounted? There is exactly one file in `frontend/src` that decides where the backend lives.

✅ **Done when:** The sidebar shows a green dot with **Synced (:5000)**, and the Orders page shows real orders from the database.

When you finish, stop the manual processes (`Ctrl + C`) and stop the database:

```bash
docker compose down
```

---

### Mission 3 — The Backend Image Will Not Build

The code works now. Time to containerize. Build the backend image **on its own**:

```bash
docker build -t erp-backend ./backend
```

**Symptom:** The build fails with this error:

```text
 > [4/5] RUN npm install --omit=dev:
npm error code ENOENT
npm error syscall open
npm error path /app/package.json
npm error errno -2
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/app/package.json'
npm error enoent This is related to npm not being able to find a file.
------
Dockerfile:6
--------------------
   4 |
   5 |     COPY package*.json /usr/src/
   6 | >>> RUN npm install --omit=dev
   7 |
   8 |     COPY . .
--------------------
ERROR: failed to solve: process "/bin/sh -c npm install --omit=dev" did not complete successfully: exit code: 254
```

> [!TIP]
> **🔍 Clue:** npm is standing in one room and looking for `package.json`. The intern left `package.json` in a different room. Which room is npm standing in? Think about what `WORKDIR` means.

✅ **Done when:** `docker build -t erp-backend ./backend` finishes successfully.

---

### Mission 4 — The Frontend Image Will Not Build

Now build the frontend image **on its own**:

```bash
docker build -t erp-frontend ./frontend
```

**Symptom:** The React app compiles fine inside the build stage, but the build fails at the last stage with this error:

```text
 > [stage-1 4/4] COPY --from=builder /app/build ./:
------
Dockerfile:16
--------------------
  14 |
  15 |     RUN rm -rf ./*
  16 | >>> COPY --from=builder /app/build ./
  17 |
  18 |     EXPOSE 80
--------------------
ERROR: failed to solve: failed to compute cache key: failed to calculate checksum of ref ...: "/app/build": not found
```

> [!TIP]
> **🔍 Clue:** The intern copied this Dockerfile from an old project that used a **different build tool**. Each build tool puts its finished product in its own output folder. Run `npm run build` in the `frontend` folder on your machine and see **which folder actually appears**.

✅ **Done when:** `docker build -t erp-frontend ./frontend` finishes successfully.

---

### Mission 5 — Bring the Whole System Up

With all fixes in place, start the whole system with **one command** from the project root:

```bash
docker compose up -d --build
```

Then check:

```bash
docker compose ps
```

✅ **Done when all of these are true:**

| Check | Expected Result |
| :--- | :--- |
| `docker compose ps` | `erp_database` is **healthy**, `erp_backend` and `erp_frontend` are **Up** |
| http://localhost:5000/health | `{"status":"healthy", ...}` |
| http://localhost:5000/api/inventory | JSON list of 20 electronic parts |
| http://localhost:3000 | ERP dashboard loads |
| Sidebar → **Backend Sync** | Green dot, **Synced (:5000)** |
| **Orders** page | Shows orders; **Approve / Complete / Cancel / Return** work |
| **Inventory** page | Stock changes after you approve an order |

> [!WARNING]
> The OC will run **exactly** `docker compose up -d --build` on a clean machine using **your** `cloudspace` repository. If it does not come up with that single command, it does not count. There is no `.env` file, so do not depend on one.

---

### Mission 6 — Ship It to Docker Hub with GitHub Actions

Now automate delivery. Create a **GitHub Actions workflow** in your `cloudspace` repository that **builds** the frontend and backend images and **pushes** them to Docker Hub.

#### 6.1 Docker Hub Credentials (provided by the OC)

| Item | Value |
| :--- | :--- |
| Docker Hub Username | `cloudspace` |
| Docker Hub Access Token | `jfnjienchecchhedcbhbch` |

> [!IMPORTANT]
> Do **not** write the token inside your workflow file. Save both values as **GitHub repository secrets**:
>
> `Settings → Secrets and variables → Actions → New repository secret`
>
> | Secret Name | Value |
> | :--- | :--- |
> | `DOCKERHUB_USERNAME` | `cloudspace` |
> | `DOCKERHUB_TOKEN` | `jfnjienchecchhedcbhbch` |
>
> Your workflow must read them with `${{ secrets.DOCKERHUB_USERNAME }}` and `${{ secrets.DOCKERHUB_TOKEN }}`.

#### 6.2 Image Names and Tags

The **tag** of every image **must be your team name**.

| Image | Full Docker Hub Name |
| :--- | :--- |
| Backend | `cloudspace/erp-backend:<your-team-name>` |
| Frontend | `cloudspace/erp-frontend:<your-team-name>` |

**Team name tag rules** (Docker tag rules):

- lowercase letters, numbers and hyphens (`-`) only
- no spaces
- example: team **"Byte Busters"** → tag **`byte-busters`**
  - `cloudspace/erp-backend:byte-busters`
  - `cloudspace/erp-frontend:byte-busters`

#### 6.3 Workflow Requirements

Your workflow must:

1. Live inside `.github/workflows/` in your `cloudspace` repository (for example `.github/workflows/docker-publish.yml`).
2. Run automatically on every **push to `main`**.
3. Run on `ubuntu-latest`.
4. Check out the repository.
5. **Log in to Docker Hub** using the repository secrets.
6. **Build** the backend image from `./backend` and the frontend image from `./frontend`.
7. **Push** both images to Docker Hub with **your team name as the tag**.
8. Finish with a **green ✅** run in the **Actions** tab.

> [!TIP]
> **🔍 Clue:** Look at the official Docker actions on the GitHub Marketplace. One of them logs you in, another one builds and pushes. You will need to run the build-and-push part **twice**: once per service, each with its own build **context**.

✅ **Done when:** Your Actions run is green, and both tags appear on Docker Hub:

- https://hub.docker.com/r/cloudspace/erp-backend/tags
- https://hub.docker.com/r/cloudspace/erp-frontend/tags

You can check from any machine:

```bash
docker pull cloudspace/erp-backend:<your-team-name>
docker pull cloudspace/erp-frontend:<your-team-name>
```

---

## 📤 Submission — How to Send Your Work

> [!IMPORTANT]
> **Order matters.** Your images must be on Docker Hub **before** you send your submission. A submission without both images on Docker Hub is **not accepted**.

**Step 1:** Push all your fixes and your workflow file to your **public** `cloudspace` GitHub repository.

**Step 2:** Make sure the GitHub Actions run is **green** and both images (`erp-backend` and `erp-frontend`) are on Docker Hub with **your team name tag**.

**Step 3:** Send a **WhatsApp message** to **074432121** in this format:

```text
Team Name     : <your team name>
Docker Tag    : <your-team-name-tag>
GitHub Repo   : https://github.com/<your-github-username>/cloudspace
```

Only the **first** submission from each team counts. Changes pushed after you send the message may not be evaluated.

---

## 📊 How the OC Will Evaluate You

After receiving your WhatsApp message, the OC will:

1. Check Docker Hub for `cloudspace/erp-backend:<your-team-name>` and `cloudspace/erp-frontend:<your-team-name>`.
2. Open your `cloudspace` repository and check the **Actions** tab for a green run.
3. Clone your repository on a clean machine and run **only**:
   ```bash
   docker compose up -d --build
   ```
4. Open http://localhost:3000 and test the ERP (dashboard, orders, inventory, sync status).
5. Review your commit history and contributors list.

### Scoring (100 Points)

| Mission | Points | What the OC Checks |
| :--- | :---: | :--- |
| Mission 1 — Frontend shows up | **10** | Frontend loads with `npm run dev` |
| Mission 2 — Frontend ↔ Backend connection | **15** | Sidebar shows **Synced (:5000)**, orders load |
| Mission 3 — Backend image builds | **15** | `docker build ./backend` succeeds |
| Mission 4 — Frontend image builds | **15** | `docker build ./frontend` succeeds |
| Mission 5 — Full system with Docker Compose | **15** | `docker compose up -d --build` brings everything up and the app works |
| Mission 6 — GitHub Actions → Docker Hub | **30** | Green workflow, secrets used (no hardcoded token), both images pushed with the correct team tag |
| **Total** | **100** | |

**Tie breaker:** the team whose images appear on Docker Hub **first** wins.

---

## ⚖️ Competition Rules

1. Your GitHub repository must be named exactly **`cloudspace`** and must be **public**.
2. **Do not** change the ERP business logic or the UI design. Fix only what is broken.
3. **Do not** add a `.env` file. Everything must work from `docker-compose.yml`.
4. **Do not** hardcode the Docker Hub token in any file. Use GitHub secrets.
5. **Only push your own team tag.** Overwriting, deleting or tampering with another team's image or tag means **immediate disqualification** for your team.
6. Do **not** use the shared Docker Hub credentials for anything other than this challenge.
7. Do **not** use AI tools (see the policy at the top of this file).
8. You must be able to **explain every fix** you made if the OC asks.
9. Submissions received after the deadline are not evaluated.

---

## 🧰 Useful Commands

**Build and run**

```bash
docker compose up -d --build
docker compose up -d db
docker build -t erp-backend ./backend
docker build -t erp-frontend ./frontend
```

**Inspect and debug**

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
docker compose exec backend sh
docker compose exec db psql -U postgres -d erp_db
```

**Stop and clean up**

```bash
docker compose down
docker compose down -v
docker system prune -f
```

> [!WARNING]
> `docker compose down -v` deletes the database volume. All orders you created will be lost and the seed data will be loaded again on the next start.

---

**Good luck, engineers. Troubleshoot it, containerize it, ship it.** 🚀
