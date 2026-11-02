# DIGI NEWS NETWORK — ದಿಗಿ ನ್ಯೂಸ್ ನೆಟ್‌ವರ್ಕ್

> Production-ready multilingual Indian news publishing platform built with React, Node.js, Express, and MySQL.

---

## Overview

DIGI NEWS NETWORK is a full-stack news platform supporting Kannada, English, Hindi, and additional Indian languages. It consists of:

| Application | Description | Port |
|-------------|-------------|------|
| **Public Website** (`apps/web`) | Reader-facing news site | 5173 |
| **Admin CMS** (`apps/admin`) | Newsroom editorial system | 5174 |
| **API Server** (`server`) | REST API backend | 3000 |
| **MySQL** (Docker) | Primary database | 3306 |
| **Adminer** (Docker) | Database GUI for development | 8080 |

---

## Prerequisites

- **Node.js** ≥ 20 (v24 recommended)
- **npm** ≥ 10
- **Docker Desktop** (for MySQL — required from Phase 2 onwards)
- **Git**

---

## Quick Start

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd DNNewsWebsite
npm install
```

### 2. Configure environment

```bash
# Copy the example and edit values
cp .env.example server/.env
```

Edit `server/.env` with your database credentials and secrets.

### 3. Start the database (Docker required)

```bash
docker compose up db adminer -d
```

Adminer UI will be available at http://localhost:8080

### 4. Run database migrations (Phase 2+)

```bash
npm run db:migrate
npm run db:seed
```

### 5. Start all development servers

```bash
npm run dev
```

This starts all three applications concurrently:
- Public website: http://localhost:5173
- Admin CMS: http://localhost:5174
- API server: http://localhost:3000

### Start individual apps

```bash
npm run dev:server   # API server only
npm run dev:web      # Public website only
npm run dev:admin    # Admin CMS only
```

---

## Project Structure

```
diginews-network/
├── apps/
│   ├── web/          — Public news website (React + Vite)
│   └── admin/        — Newsroom CMS (React + Vite)
├── server/           — Express REST API
│   ├── prisma/       — Prisma schema and migrations
│   └── src/          — Application source
├── packages/
│   ├── shared/       — Shared constants and types
│   └── api-contracts/ — Zod schemas (client + server)
├── docs/             — Architecture, API, deployment docs
└── scripts/          — Dev utilities
```

See `docs/architecture/` for detailed module documentation.

---

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps concurrently |
| `npm run build` | Build web and admin for production |
| `npm run lint` | Run ESLint across all workspaces |
| `npm run format` | Format all files with Prettier |
| `npm run test` | Run all workspace tests |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed development data |
| `npm run db:studio` | Open Prisma Studio |

---

## API Documentation

Once the server is running, OpenAPI docs are available at:

```
http://localhost:3000/api/v1/docs
```

Health check endpoint:

```
GET http://localhost:3000/api/v1/health
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6, Tailwind CSS 4 |
| Routing | React Router 7 |
| Server state | TanStack Query 5 |
| Forms | React Hook Form 7 + Zod |
| Backend | Node.js 24, Express 5 |
| ORM | Prisma 6 |
| Database | MySQL 8 |
| Password hash | Argon2id |
| Logging | Pino |
| Testing | Vitest, React Testing Library, Playwright |

---

## Branching and Contribution

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `develop` | Integration branch |
| `feature/*` | Feature development |
| `fix/*` | Bug fixes |

---

## Licence

Proprietary — All rights reserved. DIGI NEWS NETWORK.

