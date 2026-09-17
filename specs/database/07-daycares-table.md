# SPEC 07 — Daycares Table

> **Status:** Implemented
> **Depends on:** None
> **Date:** 2026-09-15
> **Objective:** Create the `daycares` table in Supabase with only `id`, `name`, and `created_at` columns per the canonical schema, and seed 4 initial daycare records including "Guardería Sala Soles".

## Scope

**In:**

- **Single migration (`001_create_daycares`):** Create `daycares` table with columns: `id` (uuid PK, default `gen_random_uuid()`), `name` (text, not null), `created_at` (timestamptz, default `now()`). Seed 4 daycare records.
- All migrations applied via `supabase_apply_migration` MCP tool
- All column names and identifiers in English (per DB convention)

**Out of scope (for future specs):**

- Creating other tables (`users`, `rooms`, `children`, etc.)
- Modifying mock data files (`data/mock/`)
- UI components for managing daycares
- CRUD screens or forms for daycares
- Enum types (`user_role`, `user_status`, etc.)
- RLS policies for `daycares`
- `updated_at` column or auto-update trigger
- Address fields (`address`, `city`, `state`, `country`)

## Data Model

### Migration 1: `001_create_daycares`

```sql
CREATE TABLE daycares (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Seed data
INSERT INTO daycares (id, name) VALUES
  (gen_random_uuid(), 'Guardería Sala Soles'),
  (gen_random_uuid(), 'Guardería Arcoíris'),
  (gen_random_uuid(), 'Guardería Estrellitas'),
  (gen_random_uuid(), 'Guardería Semillitas');
```

> **Note:** This matches the canonical schema in `references/opendaycare-database-schema.md` exactly — only 3 columns: `id`, `name`, `created_at`.

## Implementation Plan

1. **Apply Migration 1 (`001_create_daycares`)** — Use `supabase_apply_migration` to create the `daycares` table and insert 4 seed records. Verification: `supabase_list_tables` shows `daycares`; `SELECT count(*) FROM daycares` returns 4.

2. **Verification** — `npm run lint` + `npm run build` pass (no code changes expected); confirm table, columns, and seed data via Supabase MCP.

## Acceptance Criteria

- [x] `npm run lint` passes with no errors
- [x] `npm run build` passes with no errors
- [x] Migration `001_create_daycares` applied successfully via `supabase_apply_migration`
- [x] `daycares` table exists with exactly 3 columns: `id`, `name`, `created_at`
- [x] `id` column is uuid PK with `gen_random_uuid()` default
- [x] `name` column is text NOT NULL
- [x] `created_at` has `now()` default
- [x] 4 seed records exist in `daycares`
- [x] One seed record has name "Guardería Sala Soles"
- [x] No mock data files (`data/mock/`) are modified
- [x] All column names and identifiers are in English
- [x] No `updated_at` column exists on `daycares`
- [x] No address columns (`address`, `city`, `state`, `country`) exist on `daycares`

## Decisions

- **Yes:** only 3 columns (`id`, `name`, `created_at`) — matches the canonical database schema exactly
- **Yes:** single migration — RLS policies deferred until `users` table exists
- **Yes:** seed data only populates `name` — address fields do not exist in the canonical schema
- **No:** `updated_at` column — not in the canonical schema; can be added later if needed
- **No:** address fields (`address`, `city`, `state`, `country`) — not in the canonical schema; deferred to a future spec if needed
- **No:** RLS policies in this migration — depends on `users` table which doesn't exist yet

## Risks

| Risk                                         | Mitigation                                                                       |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| Table has no RLS until a future spec adds it | Acceptable risk during development; RLS will be added after `users` table exists |
| Seed UUIDs not deterministic                 | Acceptable for seed data; can be specified explicitly later if needed            |

## What is **not** in this spec

- Creating other tables (`users`, `rooms`, `children`, etc.)
- Modifying mock data files
- UI components for managing daycares
- CRUD screens or forms
- Enum types
- `updated_at` column or auto-update trigger
- Address fields (`address`, `city`, `state`, `country`)
- RLS policies

Each one of those, if it lands, goes in its own spec.

---

## Verification Log

**Date:** 2026-09-17  
**Verifier:** spec-verifier  
**Result:** 12/12 passed

| #   | Criterion                             | Status  | Notes                                                                         |
| --- | ------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| 1   | `npm run lint` passes                 | ✅ Pass | ESLint ran with no errors                                                     |
| 2   | `npm run build` passes                | ✅ Pass | TypeScript compiled, 7/7 pages generated, no errors                           |
| 3   | Migration applied                     | ✅ Pass | Listed as `20260916063828 / 001_create_daycares`                              |
| 4   | `daycares` table with 3 columns       | ✅ Pass | `supabase_list_tables` confirms exactly `id`, `name`, `created_at`            |
| 5   | `id` uuid PK with `gen_random_uuid()` | ✅ Pass | `data_type: uuid`, `primary_keys: ["id"]`, `default_value: gen_random_uuid()` |
| 6   | `name` text NOT NULL                  | ✅ Pass | `data_type: text`, not nullable                                               |
| 7   | `created_at` default `now()`          | ✅ Pass | `data_type: timestamptz`, `default_value: now()`                              |
| 8   | 4 seed records                        | ✅ Pass | `SELECT count(*)` returns 4                                                   |
| 9   | "Guardería Sala Soles" exists         | ✅ Pass | Present in `SELECT name` results                                              |
| 10  | No mock data modified                 | ✅ Pass | DB-only spec; no code changes                                                 |
| 11  | English column names                  | ✅ Pass | `id`, `name`, `created_at` — all English                                      |
| 12  | No `updated_at` or address columns    | ✅ Pass | Only 3 columns exist                                                          |
