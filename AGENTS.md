<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

Next.js 16.3.2 App Router app ("OpenDayCare", a daycare/childcare app) — React 19, TypeScript strict, Tailwind CSS v4 via `@tailwindcss/postcss`. No `src/` dir: routes live in `app/`, and the `@/*` alias maps to the repo root (not `src/`).

App Router docs for this exact version ship in `node_modules/next/dist/docs/01-app/` (file conventions under `03-api-reference/03-file-conventions/`). Typed route props such as `LayoutProps<"/">` are already in use (see `app/layout.tsx`).

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run lint` — ESLint (flat config, no args)
- `npm run build` — production build; also runs type checking

No test suite exists yet. Verify changes with `npm run lint` then `npm run build`.

## Design source of truth

- `references/pantallas/*.dc.html` — static HTML mockups of every screen (login, feed, avisos, niños, perfil-niño, resumen-día, vincular-padre, …). `index.dc.html` is the screen index. Build the UI to match these.
- `references/screenshots/` — reference screenshots.
- UI copy is in Spanish. Fonts: Fredoka (headings) + Nunito (body); warm palette (bg `#f6ecdf`, text `#3f362e`, accent `#f2a78e`).

## Spec-driven workflow

Large features go through the spec skills in `.agents/skills/` (tracked by `skills-lock.json`):

- `/spec <short description>` — produces `specs/NN-slug.md` in Draft state (the user marks it Approved). No code is written here.
- `/spec-impl NN-slug` — implements an Approved spec on a `spec-NN-slug` branch.
- `@spec-verifier @specs/NN-slug.md` — verifies an implemented spec against its acceptance criteria. Runs `npm run lint` + `npm run build`, checks visual criteria with Playwright screenshots in `.playwright-mcp/`, and marks each criterion as `[x]` in the spec file when it passes.

**Spec file organization:**

- Database-related specs (schema changes, migrations, RLS policies, Supabase Edge Functions, etc.) → `specs/database/NN-slug.md`
- All other specs → `specs/NN-slug.md`

## MCPs

- Playwright: Screenshots and anything related to Playwright must go in the `.playwright-mcp` folder (gitignored).
- Context7: Use this MCP to fetch up-to-date framework documentation.
- Supabase: Use the Supabase MCP for all database interactions (migrations, queries, edge functions, logs, advisories). Before making schema changes, inspect existing tables with `supabase_list_tables`. For debugging, start by reading project logs and security/performance advisories.

## Supabase Client Integration

The app uses `@supabase/supabase-js` and `@supabase/ssr` for database interactions from Next.js. Client helpers live in `utils/supabase/`:

- `utils/supabase/server.ts` — `createClient(cookieStore)` for Server Components and Server Actions. Uses `createServerClient` from `@supabase/ssr` with cookie-based session handling.
- `utils/supabase/client.ts` — `createClient()` for Client Components. Uses `createBrowserClient` from `@supabase/ssr`.
- `utils/supabase/middleware.ts` — `createClient(request)` for Next.js middleware. Refreshes sessions and propagates cookie changes to the response.

**Usage pattern:**

- Server Components: import `createClient` from `@/utils/supabase/server`, pass `await cookies()` to it.
- Client Components: import `createClient` from `@/utils/supabase/client`, call it directly.
- Middleware: import `createClient` from `@/utils/supabase/middleware`, pass the `NextRequest`.
- Never hardcode Supabase URL or keys — always use `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from `.env.local`.

## Database Rules

**Always use migrations for any database change.** This is non-negotiable.

- **Schema changes** (CREATE/ALTER/DROP tables, columns, indexes, constraints, extensions) → `supabase_apply_migration`
- **RLS policies** (ENABLE ROW LEVEL SECURITY, CREATE POLICY, ALTER POLICY, DROP POLICY) → `supabase_apply_migration`
- **Seed data** (INSERT initial/reference data) → `supabase_apply_migration`
- **Data migrations** (UPDATE/DELETE to transform existing data) → `supabase_apply_migration`
- **Database functions, triggers, views** → `supabase_apply_migration`

**Never** use `supabase_execute_sql` for DDL, RLS, or data migrations. `supabase_execute_sql` is only for read-only queries (SELECT) used for debugging, verification, or inspection.

**Migration naming:** `NNN_short_description` (e.g., `001_create_daycares`, `002_enable_daycares_rls`). Each migration is a single `.sql` file in `supabase/migrations/`.

**Migration dependencies:** If a migration depends on another object (e.g., a table that doesn't exist yet), document the dependency in a comment and apply it after the dependency is resolved. Do not skip migrations — they must all be applied in order.

## Skills

Skills installed in `.agents/skills/` (tracked by `skills-lock.json`):

- `context7-mcp` — Fetch up-to-date library/framework documentation via Context7 MCP.
- `supabase` — Critical guide for Supabase development and security (Database, Auth, Edge Functions, Realtime, Storage, RLS, CLI/MCP, migrations, extensions).
- `supabase-postgres-best-practices` — Postgres best practices: schema design, migrations, RLS policies, indexes, triggers, pg_cron, pgvector, performance tuning, debugging slow queries.

Use `@supabase` for any task involving Supabase. Use `@supabase-postgres-best-practices` BEFORE writing or altering anything related to Postgres (tables, columns, migrations, RLS, queries).

## Spec verifier (`@spec-verifier`)

Agent that verifies an implemented spec against its acceptance criteria. Invoked as `@spec-verifier @specs/NN-slug.md`.

**Flow:**

1. Reads the spec and extracts acceptance criteria (checklist `[ ]`).
2. Runs `npm run lint` + `npm run build` — if either fails, criteria do not pass.
3. For each visual/functional criterion:
   - Uses Playwright to navigate to the corresponding route.
   - Takes screenshots in `.playwright-mcp/` at the viewports specified by the spec (e.g. 1440px desktop, 375px mobile).
   - Interacts with the page (clicks, keyboard, resize) as required by the criterion.
   - If the criterion passes → marks `[x]` in the spec file.
4. Reports results: how many passed, which failed, and why.

**Screenshots:** always in `.playwright-mcp/` (gitignored), never in `references/`.

## Notes

- `CLAUDE.md` only imports this file (`@AGENTS.md`) — add guidance here, don't duplicate it there.

## Code rules

- Use clean code; names, functions, and variables in English.
