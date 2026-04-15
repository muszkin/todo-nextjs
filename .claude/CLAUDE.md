## Project Documentation

**CRITICAL**: Before starting any task, read @.maister/docs/INDEX.md to understand:
- Project vision, goals, and roadmap
- Technology stack and architectural decisions
- Coding standards and conventions
- Best practices and patterns

### Documentation Structure

All project documentation is located in `.maister/docs/`:

- **@.maister/docs/INDEX.md** - Master documentation map (READ THIS FIRST)
- **project/** - Project vision, roadmap, tech stack, architecture
- **standards/** - Technical standards organized by domain (global, frontend, backend, testing)

### Using Documentation

1. **Always start** by reading @.maister/docs/INDEX.md
2. **Load relevant documentation** based on the task:
   - For project context: Read `.maister/docs/project/vision.md`, `.maister/docs/project/tech-stack.md`
   - For architecture decisions: Read `.maister/docs/project/architecture.md`
   - For coding patterns: Read appropriate standards from `.maister/docs/standards/`
3. **Follow standards** when writing code - they represent team decisions and conventions
4. **Keep documentation updated** - update docs when making significant changes
5. **Ask if unclear** - if documentation conflicts or is unclear, ask the user for clarification

### Documentation Priority

When in doubt, this is the priority order:
1. Project documentation in `.maister/docs/` (highest priority)
2. Code patterns and conventions visible in the codebase
3. User's direct instructions
4. General best practices (lowest priority)

**The documentation in `.maister/docs/` represents team decisions and should be followed unless the user explicitly overrides them.**

## AI SDLC Workflows

This project uses the maister plugin for structured development. Available orchestrators:
- `/maister:development-new` - Development workflow for features, enhancements, and bug fixes
- `/maister:migration-new` - Technology/platform migrations (with rollback planning)

All orchestrators read @.maister/docs/INDEX.md continuously to apply project standards.
Use interactive mode (default) or `--yolo` for continuous execution.

---

## cel projektu

aplikacja todo napisana z użyciem next.js (front i backend)

# funkcje aplikacji:

- dodawanie tasków do zrobienia
- możliwość ustawienia przypomnienia
- możliwość zaznaczenia done/not do
- kalendarz
- ownerzy

# warunki testowe:

- można dodać zadanie do wykonania na daną datę i czas i przyjdzie alarm w aplikacji
- można usunąć zadanie
- można oznaczyć zadanie not-do

# design

nowoczesna aplikacja spa w stylu dark z pastelowymi kolorami
