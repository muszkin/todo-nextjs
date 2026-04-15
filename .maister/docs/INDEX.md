# Documentation Index

**IMPORTANT**: Read this file at the beginning of any development task to understand available documentation and standards.

## Quick Reference

### Project Documentation
Project-level documentation covering vision, goals, architecture, and technology choices for Todo App — a self-hosted Next.js full-stack SPA.

### Technical Standards
Coding standards, conventions, and best practices organized by domain (global, frontend, backend, testing).

---

## Project Documentation

Located in `.maister/docs/project/`

### Vision (`project/vision.md`)
Pitch, problem statement, target users (owner + collaborators), key features (tasks with due date/time, in-app alarm, done/not-do, delete, calendar, multi-owner), success criteria tied to CLAUDE.md test conditions, and differentiators (self-hosted, dark+pastel SPA, single-stack Next.js).

### Roadmap (`project/roadmap.md`)
Phased plan: Phase 1 MVP (Next.js scaffold, data layer, task CRUD, due date/time, in-app alarm, dark SPA shell, test-conditions pass), Phase 2 (calendar view, owners, filters, persistence), Phase 3 polish (shortcuts, browser notifications, recurring, Docker deploy), plus future PWA/offline and tags.

### Tech Stack (`project/tech-stack.md`)
TypeScript strict on 100% of code; Next.js (App Router, latest stable) as single full-stack framework with React + Tailwind; Vitest + Playwright (headed local) + React Testing Library for tests; SQLite/Postgres with Drizzle/Prisma TBD at scaffold; pnpm/npm with lockfile; Docker for Phase 3 self-hosted deploy; ESLint + Prettier; planned deps include zod, date-fns, better-sqlite3.

### Architecture (`project/architecture.md`)
Full-stack Next.js monolith (UI → Route Handlers/Server Actions → ORM → DB). Folder layout (`app/`, `components/`, `lib/`, `lib/db/`, `tests/`), data flow for task create and alarm trigger, planned Task/Owner/TaskOwner data model, configuration via `.env.local`, deployment (dev → Docker compose), and known constraints (alarms only fire with tab open in Phase 1, owners are labels until auth added).

---

## Technical Standards

### Global Standards

Located in `.maister/docs/standards/global/`

#### Coding Style (`standards/global/coding-style.md`)
Naming consistency, automatic formatting, descriptive names, focused functions, uniform indentation, no dead code, no backward compatibility unless required, DRY.

#### Commenting (`standards/global/commenting.md`)
Let code speak, comment sparingly, no change/history comments.

#### Conventions (`standards/global/conventions.md`)
Predictable structure, up-to-date documentation, clean version control, environment variables, minimal dependencies, consistent reviews, testing standards, feature flags, changelog updates, build what's needed.

#### Error Handling (`standards/global/error-handling.md`)
Clear user messages, fail fast, typed exceptions, centralized handling, graceful degradation, retry with backoff, resource cleanup.

#### Minimal Implementation (`standards/global/minimal-implementation.md`)
Build what you need, clear purpose, delete exploration artifacts, no future stubs, no speculative abstractions, review before commit, unused code is debt.

#### Validation (`standards/global/validation.md`)
Server-side always, client-side for feedback, validate early, specific errors, allowlists over blocklists, type and format checks, input sanitization, business rules, consistent enforcement.

### Frontend Standards

Located in `.maister/docs/standards/frontend/`

#### Accessibility (`standards/frontend/accessibility.md`)
Semantic HTML, keyboard navigation, color contrast, alt text and labels, screen reader testing, ARIA when needed, heading structure, focus management.

#### Components (`standards/frontend/components.md`)
Single responsibility, reusability, composability, clear interface, encapsulation, consistent naming, local state, minimal props, documentation.

#### CSS (`standards/frontend/css.md`)
Consistent methodology, work with the framework (Tailwind), design tokens, minimize custom CSS, production optimization.

#### Responsive (`standards/frontend/responsive.md`)
Mobile-first, standard breakpoints, fluid layouts, relative units, cross-device testing, touch-friendly targets, mobile performance, readable typography, content priority.

### Backend Standards

Located in `.maister/docs/standards/backend/`

#### API (`standards/backend/api.md`)
RESTful principles, consistent naming, versioning, plural nouns, limited nesting, query parameters, proper status codes, rate limit headers.

#### Migrations (`standards/backend/migrations.md`)
Reversible, small and focused, zero-downtime awareness, separate schema and data, careful indexing, descriptive names, version control.

#### Models (`standards/backend/models.md`)
Clear naming, timestamps, database constraints, appropriate types, index foreign keys, multi-layer validation, clear relationships, practical normalization.

#### Queries (`standards/backend/queries.md`)
Parameterized queries, avoid N+1, select only needed columns, index strategic columns, transactions, query timeouts, cache expensive queries.

### Testing Standards

Located in `.maister/docs/standards/testing/`

#### Test Writing (`standards/testing/test-writing.md`)
Test behavior not implementation, clear names, mock external dependencies, fast execution, risk-based testing, balance coverage and velocity, critical path focus, appropriate depth.

---

## How to Use This Documentation

1. **Start Here**: Always read this INDEX.md first to understand what documentation exists
2. **Project Context**: Read relevant project documentation before starting work
3. **Standards**: Reference appropriate standards when writing code
4. **Keep Updated**: Update documentation when making significant changes
5. **Customize**: Adapt all documentation to your project's specific needs

## Updating Documentation

- Project documentation should be updated when goals, tech stack, or architecture changes
- Technical standards should be updated when team conventions evolve
- Always update INDEX.md when adding, removing, or significantly changing documentation
