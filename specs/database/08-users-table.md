# SPEC 08 — Users Table and Enums

> **Status:** Approved
> **Depends on:** SPEC 07
> **Date:** 2026-09-17
> **Objective:** Create the `users` table with its two enum types (`user_role`, `user_status`), enable RLS, and seed a staff test user linked to "Guardería Sala Soles".

## Scope

**In:**

- Two enum types: `user_role` (`staff`, `parent`, `admin`) and `user_status` (`pending`, `active`)
- `users` table per canonical schema: `id` (uuid PK, FK → `auth.users`), `daycare_id` (uuid FK → `daycares`), `role` (user_role), `status` (user_status), `full_name` (text), `avatar_url` (text, nullable), `notify_on_post` (boolean, default true), `daily_summary_enabled` (boolean, default true), `created_at` / `updated_at` (timestamptz)
- Enable Row Level Security on `users` with basic policies
- Seed one staff test user (ana@opendaycare.test, name "Ani") linked to "Guardería Sala Soles"

**Out of scope (for future specs):**

- `AFTER INSERT` trigger on `auth.users` → deferred to signup flow
- Auth integration (login, signup, session management)
- Other enum types (`relationship_type`, `invitation_status`, `post_type`, `child_status`)
- Other tables (`rooms`, `children`, `parent_children`, etc.)
- UI for managing users

## Data Model

### Migration 1: `002_create_user_enums`

```sql
CREATE TYPE user_role AS ENUM ('staff', 'parent', 'admin');
CREATE TYPE user_status AS ENUM ('pending', 'active');
```

### Migration 2: `003_create_users`

```sql
CREATE TABLE users (
  id                      uuid PRIMARY KEY,
  daycare_id              uuid REFERENCES daycares(id),
  role                    user_role NOT NULL,
  status                  user_status NOT NULL DEFAULT 'active',
  full_name               text NOT NULL,
  avatar_url              text,
  notify_on_post          boolean NOT NULL DEFAULT true,
  daily_summary_enabled   boolean NOT NULL DEFAULT true,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_all" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert_all" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "users_update_all" ON users FOR UPDATE USING (true);
CREATE POLICY "users_delete_all" ON users FOR DELETE USING (true);
```

### Migration 3: `004_seed_staff_user`

```sql
INSERT INTO users (id, daycare_id, role, status, full_name, avatar_url, notify_on_post, daily_summary_enabled)
SELECT
  gen_random_uuid(),
  d.id,
  'staff',
  'active',
  'Ani',
  NULL,
  true,
  true
FROM daycares d
WHERE d.name = 'Guardería Sala Soles'
LIMIT 1;
```

## Implementation Plan

1. **Apply Migration 1 (`002_create_user_enums`)** — Create enum types via `supabase_apply_migration`.
2. **Apply Migration 2 (`003_create_users`)** — Create `users` table, enable RLS, add dev policies via `supabase_apply_migration`.
3. **Apply Migration 3 (`004_seed_staff_user`)** — Insert staff test user "Ani" linked to "Guardería Sala Soles" via `supabase_apply_migration`.
4. **Verification** — Confirm structure, enums, RLS, seed data via `supabase_execute_sql`. Run `npm run lint` + `npm run build`.

## Acceptance Criteria

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Enum `user_role` exists with values: `staff`, `parent`, `admin`
- [ ] Enum `user_status` exists with values: `pending`, `active`
- [ ] `users` table exists with 10 columns: `id`, `daycare_id`, `role`, `status`, `full_name`, `avatar_url`, `notify_on_post`, `daily_summary_enabled`, `created_at`, `updated_at`
- [ ] `id` is uuid PRIMARY KEY
- [ ] `daycare_id` is uuid FK to `daycares(id)`
- [ ] `role` uses `user_role`, NOT NULL
- [ ] `status` uses `user_status`, NOT NULL, default `'active'`
- [ ] `notify_on_post` boolean NOT NULL default `true`
- [ ] `daily_summary_enabled` boolean NOT NULL default `true`
- [ ] `created_at` / `updated_at` timestamptz NOT NULL default `now()`
- [ ] RLS enabled on `users`
- [ ] At least one RLS policy exists on `users`
- [ ] Staff user exists with `full_name` = 'Ani', `role` = 'staff', `status` = 'active'
- [ ] Staff user linked to "Guardería Sala Soles"
- [ ] No `AFTER INSERT` trigger on `auth.users` created

## Decisions

- **Yes:** Only two enums — others deferred to their table specs
- **Yes:** Permissive RLS for development — tightened in auth spec
- **Yes:** `id` FK to `auth.users` documented but not enforced yet — auth trigger deferred
- **No:** Auth trigger on `auth.users` — belongs in signup spec

## Risks

| Risk                                       | Mitigation                                            |
| ------------------------------------------ | ----------------------------------------------------- |
| `id` FK to `auth.users` not enforced       | Acceptable until auth trigger; documented as deferred |
| Permissive RLS policies                    | Acceptable during dev; tightened in auth spec         |
| Seed user has no matching `auth.users` row | Acceptable for testing domain logic                   |

## What is **not** in this spec

- Auth trigger on `auth.users`
- Login/signup flow
- Other enum types
- Other tables (`rooms`, `children`, etc.)
- UI for managing users

Each one of those, if it lands, goes in its own spec.
