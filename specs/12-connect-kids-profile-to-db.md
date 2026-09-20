# SPEC 12 — Connect Kids Profile Page to Real Database

> **Status:** Approved
> **Depends on:** SPEC 10 (Rooms and Children Tables), SPEC 11 (Connect Kids Page to Real Database)
> **Date:** 2026-09-20
> **Objective:** Replace mock data on `/kids/[id]` with real Supabase queries so the child profile page displays live data from the database, including linked parents and pending invitations.

---

## Scope

**In:**

- `getChildById(id)` — queries `children` + `rooms` by ID
- `getParentsByChildId(childId)` — queries `parent_children` + `users` for active linked parents
- `getPendingInvitations(childId)` — queries `invitations` table for pending invitations
- Update `app/(dashboard)/kids/[id]/page.tsx` to use real DB functions
- Map parent/invitation data to Spanish UI labels (`father` → "Papá", `mother` → "Mamá", etc.)
- Generate parent avatars with same deterministic color logic as children
- `notFound()` if child doesn't exist or is archived
- All buttons remain visual-only placeholders

**Out of scope:**

- "Editar", "Resumen del día", "Vincular otro padre" functionality
- Creating/sending invitations
- Any mock data changes
- Any `/kids` list page changes

---

## Data Model

No new database structures. This spec reads from existing tables:

- `children` — `id`, `room_id`, `full_name`, `birth_date`, `enrolled_at`, `medical_notes`, `allergy_tags`, `status`
- `rooms` — `id`, `name`
- `parent_children` — `parent_id`, `child_id`, `relationship`
- `users` — `id`, `full_name`, `status` (via `parent_children.parent_id`)
- `invitations` — `id`, `child_id`, `full_name`, `relationship`, `status`, `email`

### New TypeScript interfaces

```ts
// In lib/db/children.ts

interface LinkedParentDB {
  parent_id: string;
  full_name: string;
  status: string; // user_status: 'pending' | 'active'
  relationship: string; // relationship_type: 'father' | 'mother' | 'guardian'
}

interface PendingInvitationDB {
  id: string;
  full_name: string;
  relationship: string;
  status: string; // invitation_status: 'pending'
  email: string;
}
```

### UI mapping for parents

```ts
// In lib/ui/child-formatters.ts

interface ParentUI {
  id: string;
  name: string;
  initials: string; // first letter of full_name
  role: string; // "Papá" | "Mamá" | "Tutor"
  status: string; // "activa" | "invitación enviada"
  avatarColor: string; // deterministic from name
  avatarTextColor: string; // deterministic from name
}
```

### Relationship translation map

```ts
const RELATIONSHIP_LABELS: Record<string, string> = {
  father: "Papá",
  mother: "Mamá",
  guardian: "Tutor",
};
```

### Avatar colors for parents

Same deterministic hash + palette as children (`getAvatarColors(name)` from `lib/ui/child-formatters.ts`).

---

## Implementation Plan

1. **`getChildById`** en `lib/db/children.ts` — query `children` + `rooms`, filter `status = 'active'`, return single or null. Verification: compiles, `npm run build` passes.

2. **`getParentsByChildId`** en `lib/db/children.ts` — query `parent_children` + `users!inner(full_name, status)`, return `LinkedParentDB[]`. Verification: compiles, `npm run build` passes.

3. **`getPendingInvitations`** en `lib/db/children.ts` — query `invitations` where `status = 'pending'`, return `PendingInvitationDB[]`. Verification: compiles, `npm run build` passes.

4. **`mapParentToUI` + `mapInvitationToUI`** en `lib/ui/child-formatters.ts` — traducir relaciones, generar initials + colores. Verification: compiles, `npm run build` passes.

5. **Actualizar `app/(dashboard)/kids/[id]/page.tsx`** — reemplazar mock imports por las 3 funciones DB llamadas en paralelo con `Promise.all`, mapear datos al formato UI existente. Verification: profile loads with real data, `npm run build` passes.

6. **Verificación** — `npm run lint` + `npm run build`, screenshots Playwright desktop + mobile.

---

## Acceptance Criteria

- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` passes with no errors
- [ ] `app/(dashboard)/kids/[id]/page.tsx` does not import from `@/data/mock/kids`
- [ ] `getChildById(id)` function exists in `lib/db/children.ts` and queries Supabase
- [ ] `getParentsByChildId(childId)` function exists in `lib/db/children.ts` and queries `parent_children` + `users`
- [ ] `getPendingInvitations(childId)` function exists in `lib/db/children.ts` and queries `invitations` with `status = 'pending'`
- [ ] Profile page calls all three DB functions in parallel
- [ ] If child not found or status is not `active`, `notFound()` is returned
- [ ] Linked parents display with correct Spanish role labels ("Papá", "Mamá", "Tutor")
- [ ] Active parents show "ACTIVA" badge (green)
- [ ] Pending invitations show "PENDIENTE" badge (yellow) with "invitación enviada" subtitle
- [ ] Parent avatars show first letter of name with deterministic color from same palette as children
- [ ] Child profile data (name, age, classroom, birthday, enrollment date, allergy notes) comes from database, not mock
- [ ] Clicking a kid card on `/kids` navigates to `/kids/{real-uuid}` and shows the correct profile
- [ ] Unknown or archived child ID shows 404 page
- [ ] "Editar", "Resumen del día", "Vincular otro padre" buttons remain visual-only (no functional changes)
- [ ] `data/mock/kids.ts` is not modified
- [ ] All new code identifiers are in English
- [ ] Playwright screenshot at 1440px shows profile with real data rendering correctly
- [ ] Playwright screenshot at 375px shows responsive profile layout

---

## Decisions

- **Yes:** Two separate DB functions (`getParentsByChildId` + `getPendingInvitations`) — cleaner separation, each queries a different table, called in parallel from the page
- **Yes:** Show pending invitations alongside active parents in the same "Padres Vinculados" section — gives complete visibility of who is linked and who has been invited
- **Yes:** Reuse same deterministic avatar color logic for parents — consistent visual language, no need for separate palette
- **Yes:** `notFound()` for missing or archived children — consistent with existing behavior and Next.js conventions
- **No:** Functional buttons in this spec — out of scope; this spec is read-only data connection
- **No:** New UI components — existing JSX structure is reused, only data source changes

---

## Identified Risks

| Risk                                                           | Mitigation                                                                                                   |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| RLS policies block reads on `parent_children` or `invitations` | Verify with Supabase MCP that authenticated staff user can read these tables for children in their daycare   |
| Child exists but has no linked parents or invitations          | Empty parents array renders gracefully — "Padres Vinculados" section shows only "Vincular otro padre" button |

---

## What is **not** in this spec

- "Editar" button functionality
- "Resumen del día" button functionality
- "Vincular otro padre" button functionality
- Creating or sending new invitations
- Modifying parent-child relationships
- Any changes to mock data files
- Any changes to `/kids` list page or `KidCard` component

Each one of those, if it lands, goes in its own spec.
