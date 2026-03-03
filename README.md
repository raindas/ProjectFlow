# 🚀 ProjectFlow

**ProjectFlow** is a high-performance task management ecosystem. It’s built to handle the chaos of modern projects with a React dashboard, a robust Express API, and an automated background worker that ensures you never miss a deadline.



---

## ✨ Key Features
* **Dynamic Dashboard:** Real-time project tracking and task completion metrics.
* **Automated Worker:** A dedicated cron-service that scans for upcoming and overdue tasks every minute.
* **Daily Digest:** Smart, timezone-aware emails summarizing your daily agenda.
* **Dockerized Stack:** One command to rule them all—boot the entire environment in seconds.
* **Professional ORM:** Powered by Prisma for type-safe database interactions.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Worker** | Node-cron, Date-fns-tz |
| **Mailing** | Nodemailer (SMTP via Custom Host) |
| **Orchestration** | Docker & Docker Compose |

---

## 🚦 Getting Started

### 1. Prerequisites
* **Docker Desktop** installed on your machine.
* An **SMTP Account** (Gmail App Password or Custom Mail like Spacemail).

### 2. Environment Configuration
Create a `.env` file in the root directory. **Do not commit this file to GitHub.**

```text
# Database Connection
DATABASE_URL="postgresql://user:password@db:5432/projectflow?schema=public"

# SMTP Credentials
SMTP_HOST="mail.spacemail.com"
SMTP_PORT=587
SMTP_USER="your-email@domain.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="ProjectFlow <info@domain.com>"

# Frontend & API
VITE_API_URL="http://localhost:3000"
JWT_SECRET="your_random_secret_string"

### 3. Spin Up the Stack
Open your terminal in the root folder and run:

Bash
docker-compose up --build
Frontend: http://localhost:5173

API: http://localhost:3000

#### 📁 Project Structure
ProjectFlow/
├── backend/          # Express API & Prisma logic
├── frontend/         # React application (Vite)
├── worker/           # Background cron service
├── docker-compose.yml# Container orchestration
└── README.md         # You are here!

#### 📜 License
This project is licensed under the MIT License. See the LICENSE file for details.