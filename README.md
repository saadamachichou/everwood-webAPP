# Everwood

Public site and studio admin for **Everwood** — a creative space with workshops, events, gallery, café menu, and antiques. Built with the [Next.js App Router](https://nextjs.org/docs/app), TypeScript, and Tailwind CSS.

**Repository:** [github.com/saadamachichou/everwood-webAPP](https://github.com/saadamachichou/everwood-webAPP)

---

## Contents

- [Overview](#overview)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [NPM scripts](#npm-scripts)
- [Project layout](#project-layout)
- [API](#api)
- [Studio & authentication](#studio--authentication)
- [Data & content](#data--content)
- [Build & production](#build--production)

---

## Overview

| Area | Description |
|------|-------------|
| **Marketing** | Home, about, gallery, workshops, events |
| **Studio** | Password-protected admin for content (under `/studio`) |
| **API** | Versioned REST-style routes under `/api/v1` for workshops, events, menu, antiques |

Content can be driven from JSON files in `data/` (and corresponding API routes) while auth and user data use PostgreSQL via Prisma where configured.

---

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router), React 19  
- **Styling:** Tailwind CSS 4  
- **UI:** Radix UI primitives, Lucide icons, Framer Motion, GSAP  
- **Forms & validation:** React Hook Form, Zod  
- **Auth:** JWT (`jose`), HTTP-only cookies, bcrypt for passwords  
- **Database:** PostgreSQL + [Prisma](https://www.prisma.io/) (when `DATABASE_URL` is set)  
- **Optional:** Redis (`REDIS_URL`) for session-related features  
- **Patches:** [`patch-package`](https://github.com/ds300/patch-package) runs on `postinstall` (see `patches/`)

---

## Prerequisites

- **Node.js** 20+ (recommended)  
- **npm** (ships with Node)  
- **PostgreSQL** — required for full auth/studio flows in production (local dev may use defaults where the app allows)

---

## Getting started

1. **Clone the repository**

   ```bash
   git clone https://github.com/saadamachichou/everwood-webAPP.git
   cd everwood-webAPP
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Create a `.env` or `.env.local` file in the project root. See [Environment variables](#environment-variables) for the main keys.

4. **Run the database (if you use Prisma)** — generate client and migrate as needed:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

   *(Skip or adjust if you are only using JSON-backed content APIs.)*

5. **Start the dev server**

   ```bash
   npm run dev
   ```

6. Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## Environment variables

Set these in `.env` or `.env.local` (never commit real secrets).

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string for Prisma |
| `JWT_SECRET` | Secret for signing access tokens (use a long random string in production) |
| `ACCESS_TOKEN_TTL` | Access token lifetime (e.g. `15m`, `8h`) |
| `REFRESH_TOKEN_TTL_DAYS` | Refresh token lifetime in days |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost factor (default ~12) |
| `REDIS_URL` | Optional Redis for shared session/cache behavior |
| `STUDIO_EMAIL` | Admin login email for studio |
| `STUDIO_PASSWORD` | Admin login password for studio |
| `NEXT_PUBLIC_HERO_VIDEO` | Set to `true` to enable hero video on the home page |

The app may fall back to development defaults when variables are missing — **always set strong secrets before production**.

---

## NPM scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `npm run dev` | Dev server with webpack + devtool allowance (see `next.config.ts`) |
| | `npm run dev:turbo` | Dev with Turbopack |
| | `npm run dev:fast` | Dev with webpack, no extra devtool env |
| **Production-like** | `npm run preview` | `next build` then `next start` |
| **Build & run** | `npm run build` | Production build |
| | `npm run start` | Serve production build |
| **Quality** | `npm run lint` | ESLint |

---

## Project layout

```
app/
  api/v1/          # REST handlers (auth, workshops, events, menu, antiques, …)
  studio/          # Admin UI
  (routes)/        # Public pages (home, about, gallery, workshops, events, …)
components/        # Shared UI (navigation, footer, effects, layout chrome)
data/              # JSON content used by APIs / seeding
lib/               # Auth helpers, data utilities, store, etc.
prisma/            # Schema & migrations (when using the database)
public/            # Static assets (e.g. workshop images)
```

---

## API

Base path: **`/api/v1`**

Typical resource groups:

- **Auth** — login, logout, refresh, register, session (`/api/v1/auth/...`)
- **Content** — CRUD-style routes for workshops, events, menu items, antiques (see `app/api/v1/`)

Use the studio UI or HTTP clients with valid studio session / tokens as required by each route.

---

## Studio & authentication

- **URL:** `/studio` (and sub-routes for workshops, events, menu, antiques, etc.)  
- **Access:** Email/password; configure with `STUDIO_EMAIL` and `STUDIO_PASSWORD`.  
- **Security:** Use a strong `JWT_SECRET`, HTTPS in production, and secure cookie settings implied by `NODE_ENV=production`.

---

## Data & content

- JSON files under **`data/`** (e.g. `workshops.json`, `events.json`) back list/detail content and studio workflows where implemented.  
- Workshop images live under **`public/workshops/`**.

---

## Build & production

```bash
npm run build
npm run start
```

Deploy on any Node host or [Vercel](https://vercel.com/docs/frameworks/nextjs); set all production environment variables on the platform. Run `npx prisma migrate deploy` if you use Prisma in production.

---

## Learn more

- [Next.js documentation](https://nextjs.org/docs)  
- [React documentation](https://react.dev)
