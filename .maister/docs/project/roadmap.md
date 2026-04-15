# Development Roadmap

This roadmap outlines the planned features and development phases for Todo App.

## Phase 1: MVP
**Timeline**: initial build

- [ ] **Next.js scaffold** — App Router, TypeScript, ESLint, Tailwind `[Effort: S]`
- [ ] **Data layer** — pick DB (SQLite/Postgres), ORM (Prisma/Drizzle), migrations `[Effort: M]`
- [ ] **Task CRUD** — create, read, update (done/not-do), delete `[Effort: M]`
- [ ] **Due date/time** — date-time field, timezone-correct storage `[Effort: S]`
- [ ] **In-app alarm** — foreground notification when due time reached `[Effort: M]`
- [ ] **Dark SPA shell** — pastel-accent design, responsive layout `[Effort: M]`
- [ ] **Test conditions pass** — add/delete/not-do + alarm verified `[Effort: S]`

## Phase 2: Core Features
**Timeline**: after MVP

- [ ] **Calendar view** — month/week visualization of tasks by due date `[Effort: M]`
- [ ] **Owners** — user model, assign task to one or many owners `[Effort: M]`
- [ ] **Filters** — by owner, by status, by date range `[Effort: S]`
- [ ] **Persistence hardening** — backup/export data `[Effort: S]`

## Phase 3: Polish
- [ ] **Keyboard shortcuts** — fast task entry `[Effort: S]`
- [ ] **Browser notifications** — beyond in-app alarm `[Effort: M]`
- [ ] **Recurring tasks** — daily/weekly repeats `[Effort: M]`
- [ ] **Self-hosted deploy** — Docker image + compose `[Effort: M]`

## Future Enhancements
- [ ] **PWA / offline** — installable, offline-first
- [ ] **Mobile layout polish**
- [ ] **Tags / categories**

---
**Effort Scale**: `S`: 2-3 days | `M`: 1 week | `L`: 2+ weeks
