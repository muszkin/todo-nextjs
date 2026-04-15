# System Architecture

## Overview
Todo App is a single-process Next.js full-stack application. Front and back share one codebase; the browser talks to Next.js Route Handlers (or Server Actions) that persist data in a local database. Alarms fire client-side in an open tab; no separate worker service in Phase 1.

## Architecture Pattern
**Pattern**: Full-stack Next.js (App Router) monolith — layered as UI → API (Route Handlers / Server Actions) → Data (ORM) → DB.

```
Browser (React Client Components)
   │   fetch / Server Action
   ▼
Next.js Server (Route Handlers / Server Actions)
   │   ORM calls
   ▼
Database (SQLite or Postgres)
```

## System Structure

### `app/` — UI + routing
- **Purpose**: App Router pages, layouts, Server Components, Route Handlers
- **Key routes** (planned):
  - `app/page.tsx` — task list / today view
  - `app/calendar/page.tsx` — calendar view
  - `app/api/tasks/route.ts` — task CRUD
  - `app/api/owners/route.ts` — owners CRUD

### `components/` — React components
- **Purpose**: reusable UI (TaskItem, TaskForm, CalendarGrid, AlarmToaster, OwnerPicker)

### `lib/` — domain + infra
- **Purpose**: data access (`lib/db`), domain logic (`lib/tasks`), validation (`lib/schemas` via zod)

### `lib/db/` — persistence
- **Purpose**: ORM client, migrations, query helpers

### `tests/` — unit + e2e
- **Purpose**: Vitest unit, Playwright e2e (headed local run)

## Data Flow

**Create task**:
1. User submits `TaskForm` (client component)
2. Server Action / POST `/api/tasks` validates via zod
3. ORM writes row
4. UI refetches / router.refresh → list updates
5. Client alarm scheduler reads upcoming tasks and arms timers

**Alarm trigger**:
1. On app mount, client fetches today's upcoming tasks
2. Scheduler arms `setTimeout` per task whose due time is in the future but within window
3. At fire time: toast + sound; mark-done shortcut offered

## Data Model (planned)

```
Task {
  id          uuid
  title       string
  dueAt       datetime (UTC stored)
  status      enum('todo','done','not_do')
  createdAt   datetime
  updatedAt   datetime
}

Owner {
  id          uuid
  name        string
  email       string?
}

TaskOwner {
  taskId      -> Task.id
  ownerId     -> Owner.id
  // many-to-many
}
```

## External Integrations
None in Phase 1. No third-party APIs, no push notification service. Phase 3 may add browser Notification API (still no external service).

## Configuration
- `.env.local` — DB connection string, timezone default
- Next.js config — `next.config.ts`
- No secrets checked in; `.env.example` committed

## Deployment Architecture
**Phase 1**: `next dev` locally.
**Phase 3**: Docker image (multi-stage: deps → build → runner), `docker-compose.yml` with app + DB volume; single-container if SQLite.

## Known Constraints
- Alarms only fire while the app tab is open (Phase 1 scope). Background/push is Phase 3+.
- Single-user assumption for Phase 1; owners are labels, not auth identities, until user/auth is added.

---
*Based on project brief (CLAUDE.md) and init context — no codebase analysis performed (greenfield)*
*Date*: 2026-04-15
