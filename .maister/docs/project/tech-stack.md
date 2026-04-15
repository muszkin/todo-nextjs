# Technology Stack

## Overview
This document describes the technology choices and rationale for Todo App — a self-hosted, full-stack Next.js todo application.

> **Note**: Project is in greenfield state. Versions below reflect intended latest-stable choices at scaffold time. Confirm exact versions via `npm view <pkg> version` before `create-next-app`.

## Languages

### TypeScript (latest stable)
- **Usage**: 100% of application code
- **Rationale**: Type safety across full stack; first-class Next.js support; refactoring confidence
- **Key Features Used**: strict mode, discriminated unions, zod-inferred types

## Frameworks

### Frontend + Backend

#### Next.js (latest stable — verify at scaffold)
- **Rationale**: Single stack for front and back (App Router + Route Handlers / Server Actions); mandated by project brief
- **Mode**: App Router, React Server Components where useful, Client Components for interactive task UI and alarm timers
- **Rendering**: SPA-feel via client-side navigation, SSR for initial load

#### React (bundled with Next.js)
- **Rationale**: UI library tied to Next.js

#### Tailwind CSS (latest stable)
- **Rationale**: Utility-first, fast iteration, easy dark theme with pastel palette
- **Alternative considered**: CSS Modules — rejected for slower iteration

### Testing

- **Vitest** — unit + component tests (faster than Jest, better ESM)
- **Playwright** — E2E in headed mode locally (per project rule: E2E must run headed locally)
- **React Testing Library** — component assertions

## Database

### To be decided at scaffold time
- **Candidates**:
  - **SQLite** — simplest self-hosted, single-file, perfect for personal app
  - **PostgreSQL** — if multi-owner sync or scaling becomes real
- **ORM candidate**: **Drizzle** (type-safe, lightweight) or **Prisma** (mature, migrations)
- **Rationale**: SQLite + Drizzle is the minimal-overhead pick for Phase 1; upgrade path to Postgres exists

## Build Tools & Package Management

- **pnpm** (preferred) or **npm** — lockfile committed
- **Next.js compiler** (SWC-based) — no webpack config needed

## Infrastructure

### Containerization
- **Docker** — Dockerfile + docker-compose for self-hosted deploy (Phase 3)

### CI/CD
- To be decided — likely GitHub Actions for lint/test on push

### Hosting
- **Self-hosted** (per Phase 3 plan) — Docker on VPS

## Development Tools

### Linting & Formatting
- **ESLint** — Next.js config + strict rules
- **Prettier** — formatting

### Type Checking
- **TypeScript strict** — `tsc --noEmit` in CI

## Key Dependencies (planned)
- `next`, `react`, `react-dom`
- `tailwindcss`, `postcss`, `autoprefixer`
- `drizzle-orm` or `@prisma/client`
- `better-sqlite3` (if SQLite)
- `zod` — runtime validation at API boundary
- `date-fns` — timezone-safe date math
- `vitest`, `@testing-library/react`, `@playwright/test`

## Version Management
- Lockfile (`pnpm-lock.yaml` / `package-lock.json`) committed
- Renovate/Dependabot — TBD

---
*Last Updated*: 2026-04-15
*Auto-detected*: none — greenfield project, values sourced from project brief (CLAUDE.md) and user input
