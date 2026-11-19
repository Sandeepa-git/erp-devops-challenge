# 🚗 Thrusha Motors ERP — CloudSpace DevOps Challenge

Welcome to the **CloudSpace team selection challenge**. Read this whole file before you start.

---

## 📜 The Scenario

**Thrusha Motors (Pvt) Ltd.** uses an internal **ERP system** to manage its electronic parts inventory, customer orders, low-stock alerts and sales dashboard.

An **intern** built and changed this system. Because of the intern's mistakes, the system **does not work properly** anymore.

The company has now called you in as a **Senior DevOps Engineer** to troubleshoot it. Your job is to:

1. Find and fix every problem the intern left behind.
2. Make the whole system start with **one command**: `docker compose up -d --build`.
3. Build a **GitHub Actions** workflow that pushes the **frontend** and **backend** images to **Docker Hub**, tagged with **your team name**.

> [!NOTE]
> The business logic (orders, inventory, dashboard) is fine. The problems are in **configuration, connections and Dockerfiles**. Read every error message carefully.

---

## 🛠 Technology Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React 18 + Vite 5, Tailwind CSS (CDN), FontAwesome |
| Frontend Web Server | Nginx (`nginx:1.25-alpine`) |
| Backend API | Node.js 18 + Express 4 (`node:18-alpine`) |
| Backend Packages | `pg`, `helmet`, `cors`, `express-rate-limit`, `dotenv` |
| Database | PostgreSQL 15 (`postgres:15-alpine`) |
| Containers | Docker (multi-stage builds) + Docker Compose v2 |
| CI/CD | GitHub Actions |
| Image Registry | Docker Hub |

| Service | URL / Port |
| :--- | :--- |
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| Backend Health | http://localhost:5000/health |
| Database | `localhost:51434` (user `postgres`, password `postgres`, database `erp_db`) |

> [!IMPORTANT]
> **No `.env` file is needed.** All environment variables are already inside `docker-compose.yml`.

---

## 🚀 Getting Started

1. Create a **new public repository** on your own GitHub account named exactly **`cloudspace`**. Keep it empty (no README, no license).
2. Clone the challenge repository and push it to your new `cloudspace` repository:

```bash
git clone <PUBLIC_CHALLENGE_REPO_URL> cloudspace
cd cloudspace
git remote remove origin
git remote add origin https://github.com/<your-github-username>/cloudspace.git
git branch -M main
git push -u origin main
```

3. Do **all** your work inside your `cloudspace` repository.

---

## 🎯 The Tasks

Do the tasks **in order**. Each task gives you a **symptom** and a small **clue**. Finding the real cause is your job.

### Task 1 — Start the Frontend Manually

```bash
cd frontend
npm install
npm run dev
```

**Symptom:** The dev server starts, but http://localhost:3000 shows **only a white blank page**.

> [!TIP]
> **Clue:** Every React app needs a front door. Check where `index.html` is sending the browser, and check whether anything lives there. Watch the Vite terminal and the browser DevTools Console.

---

### Task 2 — Connect the Frontend to the Backend

Start only the database, then run the backend manually:

```bash
docker compose up -d db
cd backend
npm install
DB_PORT=51434 npm run dev
```

On Windows PowerShell: `$env:DB_PORT="51434"; npm run dev`

**Symptom:** http://localhost:5000/api/inventory works, but the frontend sidebar shows **Backend Sync** in **red**, and the Orders page stays empty.

> [!TIP]
> **Clue:** The frontend is knocking on the wrong door. Open DevTools → Network and see **where** the requests go. Compare that with the **port** the backend says it listens on, and the **path** its routes are mounted on. Only one file in `frontend/src` decides where the backend lives.

✅ Done when the sidebar shows a green **Synced (:5000)**.

---

### Task 3 — Build the Backend Docker Image

```bash
docker build -t erp-backend ./backend
```

**Symptom:** The build fails:

```text
 > [4/5] RUN npm install --omit=dev:
npm error code ENOENT
npm error syscall open
npm error path /app/package.json
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory, open '/app/package.json'
------
Dockerfile:6
   5 |     COPY package*.json /usr/src/
   6 | >>> RUN npm install --omit=dev
ERROR: failed to solve: process "/bin/sh -c npm install --omit=dev" did not complete successfully: exit code: 254
```

> [!TIP]
> **Clue:** npm is standing in one folder, but `package.json` was left in another folder. Think about what `WORKDIR` means.

---

### Task 4 — Build the Frontend Docker Image

```bash
docker build -t erp-frontend ./frontend
```

**Symptom:** The React app compiles, but the last stage fails:

```text
 > [stage-1 4/4] COPY --from=builder /app/build ./:
------
Dockerfile:16
  15 |     RUN rm -rf ./*
  16 | >>> COPY --from=builder /app/build ./
ERROR: failed to solve: failed to compute cache key: failed to calculate checksum of ref ...: "/app/build": not found
```

> [!TIP]
> **Clue:** The intern copied this Dockerfile from a project that used a **different build tool**. Run `npm run build` in the `frontend` folder and see **which output folder** actually appears.

---

### Task 5 — Run the Whole System

```bash
docker compose up -d --build
```

✅ Done when:

- `docker compose ps` shows all 3 containers running (`erp_database` is **healthy**).
- http://localhost:3000 loads the ERP and the sidebar shows **Synced (:5000)**.
- Orders can be approved, completed, cancelled and returned.

---

### Task 6 — Push to Docker Hub with GitHub Actions

Create a GitHub Actions workflow inside `.github/workflows/` that runs on **push to `main`**, logs in to Docker Hub, and **builds and pushes both** the backend and frontend images.

**Docker Hub details (given by the OC):**

| Item | Value |
| :--- | :--- |
| Docker Hub Username | `cloudspace` |
| Docker Hub Access Token | `jfnjienchecchhedcbhbch` |

Save them as **GitHub repository secrets** (`Settings → Secrets and variables → Actions`):

| Secret Name | Value |
| :--- | :--- |
| `DOCKERHUB_USERNAME` | `cloudspace` |
| `DOCKERHUB_TOKEN` | `jfnjienchecchhedcbhbch` |

**Image names — the tag must be your team name:**

```text
cloudspace/erp-backend:<your-team-name>
cloudspace/erp-frontend:<your-team-name>
```

Team name tag format: lowercase letters, numbers and hyphens only, no spaces.
Example: team **"Byte Busters"** → `cloudspace/erp-backend:byte-busters`

✅ Done when the Actions run is **green** and both images with your tag are on Docker Hub.

---

## 📤 Submission

1. Push all your fixes and your workflow to your public **`cloudspace`** repository.
2. Make sure **both images are pushed to Docker Hub** with your team name tag.
3. Send a **WhatsApp message** to **074432121**:

```text
Team Name   : <your team name>
GitHub Repo : https://github.com/<your-github-username>/cloudspace
```

The OC will then check your GitHub repository and run `docker compose up -d --build` to confirm the application comes up and works.

> [!IMPORTANT]
> **Selection order:** Teams are selected by **who pushes their images to Docker Hub first**. Pushing to Docker Hub first is **not enough on its own** — you must also send your GitHub repo, and the OC must confirm the application runs with `docker compose up -d --build`. Everything must be done correctly.

---

## ⚖️ Rules and Regulations (Mandatory)

Every team **must** follow these rules. Breaking any rule can lead to **disqualification**.

1. **Repository:** Your GitHub repository must be named exactly **`cloudspace`** and must be **public**.
2. **Your own work:** Do not work on the public challenge repository directly. Clone it and push it to your own `cloudspace` repository.
3. **No AI tools:** AI assistants and AI agents (Claude, ChatGPT, GitHub Copilot, Cursor, Antigravity or similar) must **not** write, change, commit or push anything in your repository. The OC will check commit history, commit authors and the contributors list. Any AI or bot commit means **immediate disqualification**.
4. **Do not change business logic:** Do not change the ERP features or the UI design. Fix only what is broken.
5. **No `.env` file:** Do not add a `.env` file. The system must run only from `docker-compose.yml`.
6. **One command:** The application must start with **only** `docker compose up -d --build`. No extra manual steps.
7. **No hardcoded secrets:** Do not write the Docker Hub token in any file. Use GitHub repository secrets.
8. **Correct image names and tag:** Push only `cloudspace/erp-backend:<your-team-name>` and `cloudspace/erp-frontend:<your-team-name>`. Both images must be pushed **by your GitHub Actions workflow**, not from your own machine.
9. **Do not touch other teams' images:** Overwriting, deleting or changing another team's image or tag means **immediate disqualification**.
10. **Shared credentials:** Use the Docker Hub credentials **only** for this challenge.
11. **Submission order:** Push to Docker Hub **first**, then send your team name and GitHub repo URL on WhatsApp to **074432121**.
12. **One submission:** Only your **first** WhatsApp submission counts. Changes pushed after you submit may not be evaluated.
13. **Explain your work:** Every team member must be able to explain the fixes if the OC asks.
14. **OC decision is final.**

---

**Good luck, engineers! Troubleshoot it, containerize it, ship it.** 🚀
