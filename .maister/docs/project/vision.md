# Project Vision

## Pitch
Todo App is a personal task management web app that helps the owner organize daily work by combining a lightweight todo list, a calendar view, reminders with in-app alarms, and multi-owner assignment — built as a modern Next.js full-stack SPA.

## Problem Statement
Existing todo tools are either too heavy (Jira, Asana), too simple (plain notes), or lock data into proprietary clouds. A self-hosted, minimal, fast SPA gives full control over tasks, reminders, and data, while serving as a practical daily driver.

## Target Users
- Primary: the project owner (personal daily use)
- Secondary: close collaborators added as task owners

Needs: fast task capture, date/time-bound reminders that actually fire in the app, calendar overview, ability to mark done / not-do, assignment to multiple owners.

## Key Features
- Add tasks with title and due date/time
- In-app alarm/reminder when task time arrives
- Mark task done / not-do
- Delete task
- Calendar view of tasks
- Multi-owner assignment per task

## Success Criteria
- Test conditions from CLAUDE.md pass: add task for a given date/time → alarm fires; task can be deleted; task can be marked not-do
- Self-hosted deploy works end-to-end
- Daily-usable by the owner without friction

## Differentiators
- Self-hosted, full data ownership
- Dark SPA with pastel accents — opinionated modern aesthetic
- Single-stack Next.js (front + back) — no separate backend service
- Minimal surface area — only features in scope, no bloat
