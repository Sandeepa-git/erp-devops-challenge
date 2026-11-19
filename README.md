# 🚗 Thrusha Motors ERP — CloudSpace DevOps Challenge

Welcome to the **CloudSpace team selection challenge**. Read this whole file before you start.

---

## 📜 The Scenario

**Thrusha Motors (Pvt) Ltd.** uses an internal **ERP system** to manage its electronic parts inventory, customer orders, low-stock alerts and sales dashboard. An **intern** worked on this system, made a few changes "to make it work on my machine" and pushed them straight to the repository. Since then, nothing works the way it should. The company has called you in as a **Senior DevOps Engineer** to troubleshoot it, fix it and ship it.

The trouble starts with the **frontend**. When it is started by hand, the dev server comes up without complaint, but the browser shows **nothing except a white page**.

Once the page finally loads, the **Backend Sync** box in the sidebar stays **red** and the orders never arrive, even though the backend answers perfectly when it is called directly.

Next, the intern tried Docker. The **backend image does not even build**.

The **frontend image** is no better. The React app compiles, but the **final stage of the build fails**.

When everything is fixed, the whole system must come up with **one single command**: `docker compose up -d --build`. The database must be **healthy**, the ERP must open at http://localhost:3000, the sidebar must show a green **Synced (:5000)**, and orders must be able to be approved, completed, cancelled and returned.

Finally, Thrusha Motors wants delivery to be automatic. Build a **GitHub Actions** workflow inside `.github/workflows/` that runs on every **push to `main`** and **builds and pushes both the backend and the frontend images** to **Docker Hub**, tagged with **your team name**.

> [!NOTE]
> The business logic (orders, inventory, dashboard) is fine. The problems are only in **configuration, connections and the container setup**.

---

## 💡 Hints

Try on your own first. Open a hint only when you are stuck.

<details>
<summary><b>Hint 1 — The white page</b></summary>

<br>

A house can look perfect from the street, but if the front door opens onto nothing, nobody gets inside. Follow the **very first path** the browser takes when the page loads. Does it really lead somewhere?

</details>

<details>
<summary><b>Hint 2 — The red Backend Sync</b></summary>

<br>

Two neighbours can live on the same street and never meet if one of them keeps knocking on the **wrong house number**. Listen to what the backend **announces when it wakes up**, then look at **where the frontend is knocking**.

</details>

<details>
<summary><b>Hint 3 — The backend image</b></summary>

<br>

You cannot cook in the kitchen if the recipe was left in the garage. Ask yourself **where the builder is standing**, and **where the recipe was left**.

</details>

<details>
<summary><b>Hint 4 — The frontend image</b></summary>

<br>

The courier went to collect the parcel from the shelf the **old warehouse** used. This warehouse works differently. Find out **where it really stacks its finished goods**.

</details>

<details>
<summary><b>Hint 5 — Shipping to Docker Hub</b></summary>

<br>

You do not need to build the delivery truck yourself: the **marketplace** already has good ones. One of them **opens the gate**, another one **loads and ships**, and **each parcel needs its own trip**. And never write the key on the door. Keep it in the **vault**.

</details>

<details>
<summary><b>Hint 0 — When nothing makes sense</b></summary>

<br>

The **logs never lie**. Read the whole error, not just the last line.

</details>

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

3. Do **all** your work inside **your team's own `cloudspace` repository**, and push every fix to it.

---

## 🐳 Docker Hub Details

| Item | Value |
| :--- | :--- |
| Docker Hub Username | `cloudspace` |
| Docker Hub Access Token | `jfnjienchecchhedcbhbch` |

Save them as **GitHub repository secrets** in your team's `cloudspace` repository (`Settings → Secrets and variables → Actions`):

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
