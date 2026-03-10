# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PRD & UAT Builder — an AdonisJS V7 + React 19 full-stack application for managing Product Requirements Documents and User Acceptance Testing specifications. Uses PostgreSQL with UUID primary keys, Inertia.js for server-driven SPA routing, and session-based authentication.

## Commands

```bash
npm run dev              # Start dev server with HMR (port 3333)
npm run build            # Production build (node ace build)
npm start                # Start production server
npm test                 # Run all tests (Japa test runner)
node ace test --files "tests/unit/foo.spec.ts"  # Run a single test file
npm run lint             # ESLint
npm run format           # Prettier
npm run typecheck        # TypeScript check (backend + frontend)
npm run migrate          # Run database migrations
node ace migration:rollback  # Rollback last migration batch
```

## Architecture

**Pattern:** MVC + Service Layer with transformers

```
Request → Controller → Service → Model (Lucid ORM) → PostgreSQL
                                        ↓
                              Transformer → JSON Response
```

- **Controllers** (`app/controllers/`) — Handle HTTP, delegate to services, return Inertia pages or JSON
- **Services** (`app/services/`) — All business logic and database queries
- **YAML Services** (`app/services/yaml_*.ts`) — `YamlWriterService` serializes to YAML, `YamlReaderService` parses YAML, `YamlSyncService` orchestrates DB→YAML sync, `YamlImportService` handles YAML→DB import
- **Models** (`app/models/`) — Lucid ORM models with typed relationships, UUID PKs, soft deletes
- **Transformers** (`app/transformers/`) — Convert models to API format (snake_case DB → camelCase JSON). Extend `BaseTransformer<T>`, use `.pick()` and `.paginate()`
- **Validators** (`app/validators/`) — VineJS schemas, separate create/update validators per resource

**Frontend** (`inertia/`):
- React 19 + Inertia.js v2 (no client-side router — server drives navigation)
- TanStack React Query for async state, TanStack React Form + Zod for forms
- ShadCN/ui components in `inertia/components/ui/`
- Custom hooks in `inertia/hooks/` encapsulate CRUD + React Query logic per resource
- Tuyau for type-safe API client (auto-generated in `.adonisjs/client/`)
- Two layouts: `default.tsx` (authenticated sidebar) and `public.tsx` (shared/public pages)

**Routes** (`start/routes.ts`):
- Authenticated routes use `auth` middleware
- Public share routes at `/share/view/:token` and `/share/sign/:token` — no auth required
- API routes under `/api/` return JSON; page routes return Inertia responses

## Database

PostgreSQL with UUID primary keys via `gen_random_uuid()`. Migrations in `database/migrations/`.

**Core entity hierarchy:** Project → Feature → UatFlow → Event → TestCase

**Key patterns:**
- Soft deletes via `deleted_at` on projects, features, uat_flows, events
- Versions store immutable JSONB snapshots of entire project state
- Sign-off workflow: Version → SignOffRecord → SignOffLinks (64-char hex tokens)
- View-only sharing via token-based ViewOnlyLinks (optional password)

## Key Workflows

- **Versioning:** `VersionService.createSnapshot()` freezes all project data into immutable JSON
- **Sign-Off:** Initiate creates tokens per approver → public `/share/sign/:token` page → `checkCompletion()` auto-updates status
- **Reordering:** Features, UAT flows, events, and test cases support drag-and-drop reorder via `POST .../reorder` endpoints
- **Export:** DOCX generation via `ExportService`, PDF via `@react-pdf/renderer` components in `inertia/components/pdf/`
- **Integration:** `IntegrationService` syncs with YAML Spec Compiler triggers at `../yaml/triggers.yaml`
- **YAML Storage:** Dual-write system — DB is primary, YAML files auto-generated on every mutation via `YamlSyncService`
- **YAML Import:** Upload a PRD or UAT YAML file to populate DB via `POST /api/yaml/import/prd/:projectId` or `/uat/:projectId`

## Tech Stack Details

| Layer | Technology |
|-------|-----------|
| Backend | AdonisJS V7, TypeScript, Lucid ORM |
| Frontend | React 19, Inertia.js v2, Tailwind CSS 4 |
| Database | PostgreSQL (UUID PKs) |
| Validation | VineJS (backend), Zod (frontend) |
| Testing | Japa (unit: 2s timeout, functional: 30s, browser: 300s) |
| Auth | Session-based (cookies), CSRF via Shield |
| Bundler | Vite with React + Tailwind + Inertia plugins |

## YAML Storage

All project data is dual-written to `yaml/` directory as human-readable YAML files alongside PostgreSQL.

**Directory structure:** `yaml/{project-slug}-{first8-uuid}/prd.yaml` and `uat.yaml`

**Services:**
- `YamlWriterService` — Serializes typed data to YAML and writes to disk
- `YamlReaderService` — Reads and parses YAML files back to typed objects
- `YamlSyncService` — Orchestrates full DB→YAML sync (called fire-and-forget after every controller mutation)
- `YamlImportService` — Parses uploaded YAML and imports into DB (replaces existing PRD sub-resources or creates new features/flows/events/test cases)

**Import endpoints (authenticated):**
- `POST /api/yaml/import/prd/:projectId` — Upload a `prd.yaml` file to populate project PRD data
- `POST /api/yaml/import/uat/:projectId` — Upload a `uat.yaml` file to populate project UAT data

## Environment

Requires Node 24+. PostgreSQL connection configured via `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` env vars. Default dev port is 3333 on `DB_PORT=5434`.
