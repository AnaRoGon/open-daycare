# SPEC 07 — Daycares Table

> **Status:** Approved
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

- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` passes with no errors
- [ ] Migration `001_create_daycares` applied successfully via `supabase_apply_migration`
- [ ] `daycares` table exists with exactly 3 columns: `id`, `name`, `created_at`
- [ ] `id` column is uuid PK with `gen_random_uuid()` default
- [ ] `name` column is text NOT NULL
- [ ] `created_at` has `now()` default
- [ ] 4 seed records exist in `daycares`
- [ ] One seed record has name "Guardería Sala Soles"
- [ ] No mock data files (`data/mock/`) are modified
- [ ] All column names and identifiers are in English
- [ ] No `updated_at` column exists on `daycares`
- [ ] No address columns (`address`, `city`, `state`, `country`) exist on `daycares`

## Decisions

- **Yes:** only 3 columns (`id`, `name`, `created_at`) — matches the canonical database schema exactly
- **Yes:** single migration — RLS policies deferred until `users` table exists
- **Yes:** seed data only populates `name` — address fields do not exist in the canonical schema
- **No:** `updated_at` column — not in the canonical schema; can be added later if needed
- **No:** address fields (`address`, `city`, `state`, `country`) — not in the canonical schema; deferred to a future spec if needed
- **No:** RLS policies in this migration — depends on `users` table which doesn't exist yet

## Risks

| Risk | Mitigation |
| ---- | ---------- |
| Table has no RLS until a future spec adds it | Acceptable risk during development; RLS will be added after `users` table exists |
| Seed UUIDs not deterministic | Acceptable for seed data; can be specified explicitly later if needed |

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
**Verifier:** Pending  
**Result:** 0/12 verified (spec updated — awaiting re-implementation)

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | `npm run lint` passes | ⏳ | Pending re-implementation |
| 2 | `npm run build` passes | ⏳ | Pending re-implementation |
| 3 | Migration applied | ⏳ | Pending re-implementation |
| 4 | `daycares` table with 3 columns | ⏳ | Pending re-implementation |
| 5 | `id` uuid PK with `gen_random_uuid()` | ⏳ | Pending re-implementation |
| 6 | `name` text NOT NULL | ⏳ | Pending re-implementation |
| 7 | `created_at` default `now()` | ⏳ | Pending re-implementation |
| 8 | 4 seed records | ⏳ | Pending re-implementation |
| 9 | "Guardería Sala Soles" exists | ⏳ | Pending re-implementation |
| 10 | No mock data modified | ⏳ | Pending re-implementation |
| 11 | English column names | ⏳ | Pending re-implementation |
| 12 | No `updated_at` or address columns | ⏳ | Pending re-implementation |
