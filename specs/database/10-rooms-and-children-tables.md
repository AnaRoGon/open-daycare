# SPEC 10 — Rooms and Children Tables

> **Status:** Approved
> **Depends on:** SPEC 07 (Daycares Table), SPEC 08 (Users Table)
> **Date:** 2026-09-18
> **Objective:** Create the `rooms` and `children` tables in Supabase with their migrations, RLS policies, seed 3 rooms ("Soles", "Hojas Verdes", "Arcoiris"), and leave `children` empty.

---

## Scope

**In scope:**

- **`rooms` table** — per canonical schema: `id` (uuid PK), `daycare_id` (uuid FK → `daycares`), `name` (text), `created_at` (timestamptz)
- **`children` table** — per canonical schema: `id` (uuid PK), `room_id` (uuid FK → `rooms`), `full_name` (text), `birth_date` (date), `enrolled_at` (date), `medical_notes` (text, nullable), `allergy_tags` (text[]), `photo_consent` (boolean, default true), `status` (`child_status` enum: `active` / `archived`), `created_at` / `updated_at` (timestamptz)
- **`child_status` enum** — values: `active`, `archived`
- **RLS policies** on both tables — staff has full CRUD on their own daycare's rooms and children; parents have read-only on their own daycare's rooms and children
- **Seed data** — 3 rooms for "Guardería Sala Soles": "Soles", "Hojas Verdes", "Arcoiris"
- **No children seed data** — `children` table created but empty
- All migrations applied via `supabase_apply_migration` MCP tool
- All column names and identifiers in English (per DB convention)

**Not in scope (for future specs):**

- Connecting `/kids` UI to the real database (replacing mock data)
- `parent_children` table (parent ↔ child linking)
- `invitations` table
- CRUD UI for managing rooms or children
- Photo/avatar upload for children
- Any changes to existing mock data files (`data/mock/`)
- Any changes to existing UI components or pages

---

## Data Model

### Migration 1: `007_create_child_status_enum`

```sql
CREATE TYPE child_status AS ENUM ('active', 'archived');
```

### Migration 2: `008_create_rooms`

```sql
CREATE TABLE rooms (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daycare_id uuid NOT NULL REFERENCES daycares(id),
  name       text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Staff: full CRUD on rooms of their own daycare
CREATE POLICY "staff_manage_rooms" ON rooms
  FOR ALL USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'staff'
    AND daycare_id = (SELECT daycare_id FROM users WHERE id = auth.uid())
  );

-- Parent: read-only on rooms of their own daycare
CREATE POLICY "parent_read_rooms" ON rooms
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'parent'
    AND daycare_id = (SELECT daycare_id FROM users WHERE id = auth.uid())
  );

-- Seed: 3 rooms for "Guardería Sala Soles"
INSERT INTO rooms (daycare_id, name)
SELECT d.id, r.name
FROM daycares d, (VALUES
  ('Soles'),
  ('Hojas Verdes'),
  ('Arcoiris')
) AS r(name)
WHERE d.name = 'Guardería Sala Soles'
LIMIT 1;
```

### Migration 3: `009_create_children`

```sql
CREATE TABLE children (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id         uuid NOT NULL REFERENCES rooms(id),
  full_name       text NOT NULL,
  birth_date      date NOT NULL,
  enrolled_at     date NOT NULL,
  medical_notes   text,
  allergy_tags    text[],
  photo_consent   boolean NOT NULL DEFAULT true,
  status          child_status NOT NULL DEFAULT 'active',
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- Staff: full CRUD on children in their own daycare's rooms
CREATE POLICY "staff_manage_children" ON children
  FOR ALL USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'staff'
    AND room_id IN (SELECT id FROM rooms WHERE daycare_id = (SELECT daycare_id FROM users WHERE id = auth.uid()))
  );

-- Parent: read-only on children in their own daycare's rooms
CREATE POLICY "parent_read_children" ON children
  FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'parent'
    AND room_id IN (SELECT id FROM rooms WHERE daycare_id = (SELECT daycare_id FROM users WHERE id = auth.uid()))
  );
```

> **Note:** No seed data for `children` — the table is created empty.

---

## Implementation Plan

1. **Apply Migration 1 (`007_create_child_status_enum`)** — Create `child_status` enum type via `supabase_apply_migration`. Verification: `pg_enum` query returns `active`, `archived`.

2. **Apply Migration 2 (`008_create_rooms`)** — Create `rooms` table, enable RLS, add staff/parent policies, seed 3 rooms for "Guardería Sala Soles" via `supabase_apply_migration`. Verification: `supabase_list_tables` shows `rooms` with FK to `daycares`; `SELECT count(*) FROM rooms` returns 3; room names are "Soles", "Hojas Verdes", "Arcoiris".

3. **Apply Migration 3 (`009_create_children`)** — Create `children` table, enable RLS, add staff/parent policies via `supabase_apply_migration`. Verification: `supabase_list_tables` shows `children` with FK to `rooms`; `SELECT count(*) FROM children` returns 0; all columns match canonical schema.

4. **Verification** — `npm run lint` + `npm run build` pass (no code changes expected); confirm table structures, RLS, and seed data via Supabase MCP tools.

---

## Acceptance Criteria

- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` passes with no errors
- [ ] Enum `child_status` exists with values: `active`, `archived`
- [ ] `rooms` table exists with 4 columns: `id`, `daycare_id`, `name`, `created_at`
- [ ] `rooms.id` is uuid PK with `gen_random_uuid()` default
- [ ] `rooms.daycare_id` is uuid FK to `daycares(id)`, NOT NULL
- [ ] `rooms.name` is text NOT NULL
- [ ] `rooms.created_at` has `now()` default
- [ ] RLS enabled on `rooms`
- [ ] At least 2 RLS policies exist on `rooms` (staff manage, parent read)
- [ ] 3 seed rooms exist for "Guardería Sala Soles": "Soles", "Hojas Verdes", "Arcoiris"
- [ ] `children` table exists with 11 columns: `id`, `room_id`, `full_name`, `birth_date`, `enrolled_at`, `medical_notes`, `allergy_tags`, `photo_consent`, `status`, `created_at`, `updated_at`
- [ ] `children.id` is uuid PK with `gen_random_uuid()` default
- [ ] `children.room_id` is uuid FK to `rooms(id)`, NOT NULL
- [ ] `children.status` uses `child_status` enum, NOT NULL, default `'active'`
- [ ] `children.photo_consent` is boolean NOT NULL default `true`
- [ ] `children.allergy_tags` is `text[]` type
- [ ] `children.medical_notes` is text, nullable
- [ ] `children.created_at` / `updated_at` have `now()` default
- [ ] RLS enabled on `children`
- [ ] At least 2 RLS policies exist on `children` (staff manage, parent read)
- [ ] `children` table has 0 rows (no seed data)
- [ ] No mock data files (`data/mock/`) are modified
- [ ] No existing UI components or pages are modified
- [ ] All column names and identifiers are in English

---

## Decisions Taken

- **Yes:** 3 migrations — enum first, then rooms (with seed), then children. This ensures dependency order.
- **Yes:** Seed rooms only for "Guardería Sala Soles" — matches existing seed data pattern (staff user also seeded for this daycare).
- **No:** Children seed data — user explicitly requested empty table.
- **No:** UI/database connection — deferred to a future spec; mock data remains in place.
- **No:** `parent_children` or `invitations` tables — deferred to their own specs.
- **RLS pattern:** Same approach as `daycares` and `users` — staff gets full CRUD scoped to their daycare, parents get read-only scoped to their daycare.

---

## Identified Risks

| Risk                                                                    | Mitigation                                                                              |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `children.room_id` FK to `rooms` requires rooms to exist first          | Migration order ensures `rooms` is created before `children`                            |
| RLS policies use subqueries on `users` table                            | Acceptable for now; can be optimized with indexes in a future spec if needed            |
| `allergy_tags` as `text[]` may be harder to query than normalized table | Per canonical schema, this is intentional for simplicity; can normalize later if needed |

---

## What is **not** in this spec

- Connecting `/kids` UI to the real database
- CRUD screens or forms for rooms or children
- `parent_children` table
- `invitations` table
- Photo/avatar upload for children
- Any changes to mock data files
- Any changes to existing UI components

Each one of those, if it lands, goes in its own spec.
