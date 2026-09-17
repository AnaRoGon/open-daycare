# SPEC 07 — Daycares Table

> **Status:** Approved
> **Depends on:** None
> **Date:** 2026-09-15
> **Objective:** Create the `daycares` table in Supabase with address fields, seed 4 initial daycare records including "Guardería Sala Soles", and define RLS policies in a second migration.

## Scope

**In:**

- **Migration 1 (`001_create_daycares`):** Create `daycares` table with columns: `id` (uuid PK, default `gen_random_uuid()`), `name` (text, not null), `address` (text), `city` (text), `state` (text), `country` (text), `created_at` (timestamptz, default `now()`), `updated_at` (timestamptz, default `now()`). Seed 4 daycare records.
- **Migration 2 (`002_enable_daycares_rls`):** Enable RLS on `daycares` and add role-based policies:
  - `admin`: full CRUD access to all daycares
  - `staff`: read-only access to their own daycare (via `users.daycare_id`)
  - `parent`: read-only access to their own daycare (via `users.daycare_id`)
- Migration 2 depends on the `users` table existing; will fail if applied before `users` is created
- All migrations applied via `supabase_apply_migration` MCP tool
- All column names and identifiers in English (per DB convention)

**Out of scope (for future specs):**

- Creating other tables (`users`, `rooms`, `children`, etc.)
- Modifying mock data files (`data/mock/`)
- UI components for managing daycares
- CRUD screens or forms for daycares
- Enum types (`user_role`, `user_status`, etc.)
- Triggers for `updated_at` auto-update

## Data Model

### Migration 1: `001_create_daycares`

```sql
CREATE TABLE daycares (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  address    text,
  city       text,
  state      text,
  country    text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed data
INSERT INTO daycares (id, name, address, city, state, country) VALUES
  (gen_random_uuid(), 'Guardería Sala Soles', 'Av. Principal #123, Col. Centro', 'Ciudad de México', 'CDMX', 'MX'),
  (gen_random_uuid(), 'Guardería Arcoíris', 'Calle Luna #45, Col. Norte', 'Guadalajara', 'Jalisco', 'MX'),
  (gen_random_uuid(), 'Guardería Estrellitas', 'Blvd. de los Niños #789', 'Monterrey', 'Nuevo León', 'MX'),
  (gen_random_uuid(), 'Guardería Semillitas', 'Calle del Sol #32, Col. Sur', 'Puebla', 'Puebla', 'MX');
```

### Migration 2: `002_enable_daycares_rls`

```sql
ALTER TABLE daycares ENABLE ROW LEVEL SECURITY;

-- Admin: full CRUD access to all daycares
CREATE POLICY "admin_full_access_daycares" ON daycares
  FOR ALL USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Staff: read-only access to their own daycare
CREATE POLICY "staff_read_daycares" ON daycares
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'staff'
    AND id = (SELECT daycare_id FROM users WHERE id = auth.uid())
  );

-- Parent: read-only access to their own daycare
CREATE POLICY "parent_read_daycares" ON daycares
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'parent'
    AND id = (SELECT daycare_id FROM users WHERE id = auth.uid())
  );
```

> **Note:** Migration 2 will fail if applied before the `users` table exists. It should be applied after the `users` table migration.

## Implementation Plan

1. **Apply Migration 1 (`001_create_daycares`)** — Use `supabase_apply_migration` to create the `daycares` table and insert 4 seed records. Verification: `supabase_list_tables` shows `daycares`; `SELECT count(*) FROM daycares` returns 4.

2. **Apply Migration 2 (`002_enable_daycares_rls`)** — Use `supabase_apply_migration` to enable RLS and create policies. This step will fail if `users` table does not exist yet; defer until after `users` is created. Verification: `SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'daycares'` returns 3 policies.

3. **Verification** — `npm run lint` + `npm run build` pass (no code changes expected); confirm table, seed data, and RLS policies via Supabase MCP.

## Acceptance Criteria

- [x] `npm run lint` passes with no errors
- [x] `npm run build` passes with no errors
- [x] Migration 1 (`001_create_daycares`) applied successfully via `supabase_apply_migration`
- [ ] Migration 2 (`002_enable_daycares_rls`) applied successfully via `supabase_apply_migration` — **FAIL**: `public.users` table does not exist yet (documented dependency)
- [x] `daycares` table exists with all 8 columns: `id`, `name`, `address`, `city`, `state`, `country`, `created_at`, `updated_at`
- [x] `id` column is uuid PK with `gen_random_uuid()` default
- [x] `name` column is text NOT NULL
- [x] `created_at` and `updated_at` have `now()` defaults
- [x] 4 seed records exist in `daycares`
- [x] One seed record has name "Guardería Sala Soles"
- [x] Seed records have address, city, state, country populated
- [x] RLS is enabled on `daycares` table
- [ ] RLS policy `admin_full_access_daycares` exists (FOR ALL) — **FAIL**: Migration 2 not applied (dependency on `users` table)
- [ ] RLS policy `staff_read_daycares` exists (FOR SELECT) — **FAIL**: Migration 2 not applied (dependency on `users` table)
- [ ] RLS policy `parent_read_daycares` exists (FOR SELECT) — **FAIL**: Migration 2 not applied (dependency on `users` table)
- [x] No mock data files (`data/mock/`) are modified
- [x] All column names and identifiers are in English

## Decisions

- **Yes:** two migrations — first creates table + seed (applies now), second enables RLS + policies (applies after `users` exists)
- **Yes:** address as 4 separate fields (address, city, state, country) — simple and sufficient for v1
- **Yes:** RLS policies reference `users` table — forward-looking; migration 2 documents the dependency
- **Yes:** 4 seed daycares with Mexican locations — matches the app's Spanish UI context
- **No:** `updated_at` trigger — deferred to a future spec; can be added when other tables need it too
- **No:** mock data migration — mock files (`data/mock/`) remain untouched; seed lives only in the database

## Risks

| Risk                                           | Mitigation                                                            |
| ---------------------------------------------- | --------------------------------------------------------------------- |
| Migration 2 fails if `users` doesn't exist yet | Documented as dependency; apply after `users` table migration         |
| Table has no RLS between migration 1 and 2     | Short window; acceptable risk during development                      |
| Seed UUIDs not deterministic                   | Acceptable for seed data; can be specified explicitly later if needed |

## What is **not** in this spec

- Creating other tables (`users`, `rooms`, `children`, etc.)
- Modifying mock data files
- UI components for managing daycares
- CRUD screens or forms
- Enum types
- `updated_at` auto-update trigger

Each one of those, if it lands, goes in its own spec.

---

## Verification Log

**Date:** 2026-09-16  
**Verifier:** @spec-verifier  
**Result:** 13/17 PASS, 4/17 FAIL

| # | Criterion | Status | Notes |
|---|-----------|--------|-------|
| 1 | `npm run lint` passes | ✅ | ESLint clean |
| 2 | `npm run build` passes | ✅ | TypeScript + static pages OK |
| 3 | Migration 1 applied | ✅ | Version `20260916063828` in schema_migrations |
| 4 | Migration 2 applied | ❌ | `public.users` table does not exist yet — documented dependency |
| 5 | `daycares` table with 8 columns | ✅ | All columns present |
| 6 | `id` uuid PK with `gen_random_uuid()` | ✅ | Confirmed via information_schema |
| 7 | `name` text NOT NULL | ✅ | Confirmed |
| 8 | `created_at`/`updated_at` defaults | ✅ | Both default to `now()` |
| 9 | 4 seed records | ✅ | `SELECT count(*)` returns 4 |
| 10 | "Guardería Sala Soles" exists | ✅ | First seed record |
| 11 | Address fields populated | ✅ | All 4 records have address, city, state, country |
| 12 | RLS enabled | ✅ | `rowsecurity: true` on daycares |
| 13 | Policy `admin_full_access_daycares` | ❌ | Migration 2 not applied |
| 14 | Policy `staff_read_daycares` | ❌ | Migration 2 not applied |
| 15 | Policy `parent_read_daycares` | ❌ | Migration 2 not applied |
| 16 | No mock data modified | ✅ | `git diff` clean |
| 17 | English column names | ✅ | All identifiers in English |

**Blocked by:** `public.users` table must be created before Migration 2 can be applied. Once the `users` table spec is implemented, re-run verification for criteria 4, 13, 14, 15.
