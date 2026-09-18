# SPEC 11 — Connect Kids Page to Real Database

> **Status:** Approved
> **Depends on:** SPEC 10 (Rooms and Children Tables), SPEC 09 (Real Auth and Route Protection)
> **Date:** 2026-09-18
> **Objective:** Replace mock data on `/kids` with real Supabase queries to `rooms` and `children` tables, grouping children by room, deriving UI-only fields on the frontend, and handling the empty state gracefully.

---

## Scope

**In:**

- Convert `app/(dashboard)/kids/page.tsx` from client component to server component for data fetching
- Query `rooms` and `children` tables from Supabase using the existing server client (`utils/supabase/server.ts`)
- Group children by room in the UI, replacing the hardcoded "SALA SOLES" section
- Derive UI-only fields on the frontend: `age` from `birth_date`, `initials` from `full_name`, `avatarColor`/`avatarTextColor` deterministically from name
- Keep the existing visual design (cards, search, add button, layout)
- Handle empty state (0 children) gracefully — show a friendly message instead of an empty grid
- Search filter works across all children regardless of room
- All column names and identifiers in English (per DB convention)
- No modifications to mock data files (`data/mock/`)

**Out of scope (for future specs):**

- `/kids/[id]` profile page — still uses mock data
- "Agregar niño" modal creating real DB records — still visual-only
- "Editar" button functionality — still visual-only
- `parent_children` table or linked parents on child pages
- `invitations` table
- Photo/avatar upload for children
- Room management (add/edit/delete rooms)
- Any changes to existing mock data files

---

## Data Model

No new database structures. This spec reads from existing tables created in SPEC 10:

- `rooms` — `id`, `daycare_id`, `name`, `created_at`
- `children` — `id`, `room_id`, `full_name`, `birth_date`, `enrolled_at`, `medical_notes`, `allergy_tags`, `photo_consent`, `status`, `created_at`, `updated_at`

The query joins `children` with `rooms` to get the room name for each child. Only `status = 'active'` children are shown.

### Frontend-derived data structures

```ts
// UI-only type built from DB rows — not stored in DB
interface ChildUI {
  id: string;
  name: string; // from children.full_name
  initials: string; // derived: first letter of full_name
  age: string; // derived: calculate from birth_date
  classroom: string; // from rooms.name
  birthday: string; // derived: format birth_date as "DD mon YYYY"
  enrollmentDate: string; // derived: format enrolled_at as "mon YYYY"
  allergy: string; // from medical_notes (non-null → show allergy card)
  allergyNotes: string; // from medical_notes
  avatarColor: string; // deterministic from name
  avatarTextColor: string; // deterministic from name
}

interface RoomGroup {
  roomId: string;
  roomName: string;
  children: ChildUI[];
}
```

### Age calculation

```ts
function calculateAge(birthDate: Date): string {
  const now = new Date();
  const years = now.getFullYear() - birthDate.getFullYear();
  return `${years} ${years === 1 ? "año" : "años"}`;
}
```

### Avatar color generation

Deterministic hash from the child's name, picking from the existing palette:

```ts
const AVATAR_COLORS = [
  { bg: "#A9D9E8", text: "#1F7A93" }, // Sky
  { bg: "#F4B8CC", text: "#C44A7A" }, // Pink
  { bg: "#B9DEC4", text: "#3E8B62" }, // Green
  { bg: "#F4DC8E", text: "#9A7B1E" }, // Yellow
  { bg: "#C9B6E8", text: "#7B5FC0" }, // Purple
];

function getAvatarColors(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
```

---

## Implementation Plan

1. **Create `lib/db/children.ts` helper** — Create a new file with a server-side function `getChildrenByRoom()` that:
   - Creates Supabase server client via `createClient(await cookies())`
   - Queries `children` joined with `rooms` (via `room_id` FK)
   - Filters by `status = 'active'`
   - Returns data grouped by room
   - Verification: function compiles, `npm run build` passes

2. **Create `lib/ui/child-formatters.ts` helper** — Create utility functions for deriving UI fields:
   - `calculateAge(birthDate: Date): string`
   - `formatBirthday(date: Date): string` — "DD mon YYYY" (e.g., "12 mar 2022")
   - `formatEnrollmentDate(date: Date): string` — "mon YYYY" (e.g., "feb 2025")
   - `getInitials(fullName: string): string` — first letter
   - `getAvatarColors(name: string): { bg: string; text: string }`
   - `mapChildToUI(child: DBChildRow): ChildUI` — combines all above
   - Verification: functions compile, `npm run build` passes

3. **Update `components/kids/kid-card.tsx` to accept `ChildUI` type** — The existing `KidCard` component receives a `Child` from mock data. Update its props to accept the new `ChildUI` type (or a shared interface both mock and real data can use). Keep all visual rendering unchanged.
   - Verification: `npm run build` passes, no type errors

4. **Convert `app/(dashboard)/kids/page.tsx` to server component** — Remove `"use client"`, make it an `async` server component:
   - Call `getChildrenByRoom()` to fetch real data
   - Keep search as a client component wrapper (extract search + state into a `<KidsClientWrapper>` or use `useSearchParams` pattern)
   - Render rooms grouped by name, each with its children grid
   - Show empty state message when no children exist
   - Keep "Agregar niño" button (still opens visual-only modal for now)
   - Verification: `/kids` loads with real data from Supabase, search works, empty state shows when no children

5. **Remove mock data import from `/kids` page** — Remove the `import { children } from "@/data/mock/kids"` line. The mock file stays untouched (other pages still use it).
   - Verification: `/kids` page no longer references mock data, `npm run lint` + `npm run build` pass

6. **Verification** — `npm run lint` + `npm run build` pass; Playwright screenshots at 1440px showing rooms grouped with children (or empty state if no seed data).

---

## Acceptance Criteria

- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` passes with no errors
- [ ] `/kids` page is a server component (no `"use client"` at top level)
- [ ] `/kids` page does not import from `@/data/mock/kids`
- [ ] `rooms` table is queried from Supabase (not hardcoded)
- [ ] `children` table is queried from Supabase (not hardcoded)
- [ ] Only `status = 'active'` children are displayed
- [ ] Children are grouped by room in the UI
- [ ] Room names come from the database (not hardcoded "SALA SOLES")
- [ ] `age` is calculated from `birth_date` (not from mock data)
- [ ] `initials` is derived from `full_name` (first letter)
- [ ] `avatarColor`/`avatarTextColor` are generated deterministically from name
- [ ] Search filter works across all children regardless of room
- [ ] Empty state (0 children) shows a friendly message instead of empty grid
- [ ] "Agregar niño" button still exists and opens the modal (visual-only, no DB write)
- [ ] `data/mock/kids.ts` file is not modified
- [ ] `app/(dashboard)/kids/[id]/page.tsx` is not modified
- [ ] `components/kids/kid-card.tsx` visual rendering is unchanged
- [ ] All new code is in English (variable names, functions, comments)

---

## Decisions

- **Yes:** Server component for data fetching — follows Next.js App Router patterns, enables direct Supabase queries without API routes
- **Yes:** Client wrapper for search state — search requires `useState`, so it stays in a client sub-component while data fetching is server-side
- **Yes:** Derive UI fields on frontend — `age`, `initials`, `avatarColor` are presentation-only, no need to store in DB
- **Yes:** Filter by `status = 'active'` — archived children should not appear in the main list
- **No:** Seed data for children — user explicitly requested no seed; UI must handle empty state gracefully
- **No:** Changes to `/kids/[id]` — deferred to a future spec
- **No:** Real DB writes from "Agregar niño" modal — deferred to a CRUD spec

---

## Identified Risks

| Risk                                               | Mitigation                                                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `children` table is empty — page shows nothing     | Empty state component with friendly message and CTA to add first child                                 |
| RLS policies block reads for current user          | Verify with Supabase MCP that authenticated user can read rooms/children in their daycare              |
| Date formatting differs from mock (Spanish months) | Use `Intl.DateTimeFormat('es-ES', { ... })` for Spanish month names                                    |
| `KidCard` component expects mock `Child` type      | Create a shared `ChildUI` interface that both mock and real data conform to, or update `KidCard` props |

---

## What is **not** in this spec

- `/kids/[id]` profile page — still uses mock data
- "Agregar niño" creating real DB records
- "Editar" button functionality
- `parent_children` table or linked parents
- `invitations` table
- Photo/avatar upload for children
- Room management (add/edit/delete rooms)
- Any changes to mock data files

Each one of those, if it lands, goes in its own spec.
