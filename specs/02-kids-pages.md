# SPEC: Kids List and Profile Pages

**State:** Approved
**Date:** Sat Sep 12 2026  
**Depends on:** None  
**Objective:** Implement the `/kids` list page and `/kids/[id]` profile page as visual-only UI components matching the reference mockups, mobile-first responsive, reusing existing shell and styling conventions.

---

## Scope

**In scope:**

- `/kids` route — list of children with search bar (frontend name filtering), grouped by classroom, kid cards with avatar/name/age/parent count/allergy badges
- `/kids/[id]` route — child profile page with avatar, name, age, classroom, allergy notes, birthdate, linked parents section, and action buttons
- Mock data file with 8 children, typed enums for allergies and avatar colors
- Responsive layout: mobile-first (drawer nav on mobile, sidebar on desktop)
- Reuse existing `NavShell` and `Sidebar` components via `(dashboard)` route group
- All UI copy in Spanish, component code in English
- "Editar", "Vincular otro padre", "Resumen del día" buttons are visual-only placeholders (no navigation yet)

**Not in scope:**

- CRUD operations (create/edit/delete child)
- Server-side search or API-based filtering
- Parent linking/unlinking logic
- Resumen del día page implementation
- Agregar niño page implementation
- API routes or database integration
- Authentication or permissions

---

## Data Model

**File:** `data/mock/kids.ts`

```ts
export enum AllergyType {
  Mani = "MANÍ",
  Lactosa = "LACTOSA",
  None = "",
}

export enum AvatarColor {
  Sky = "#A9D9E8",
  SkyText = "#1F7A93",
  Pink = "#F4B8CC",
  PinkText = "#C44A7A",
  Green = "#B9DEC4",
  GreenText = "#3E8B62",
  Yellow = "#F4DC8E",
  YellowText = "#9A7B1E",
  Purple = "#C9B6E8",
  PurpleText = "#7B5FC0",
}

export enum ParentStatus {
  Activa = "activa",
  InvitacionEnviada = "invitacion-enviada",
}

export interface LinkedParent {
  id: string;
  name: string;
  initials: string;
  role: string; // e.g. "Mamá", "Papá"
  status: ParentStatus;
}

export interface Child {
  id: string;
  name: string;
  initials: string;
  age: string; // e.g. "3 años"
  classroom: string; // e.g. "Soles"
  birthday: string; // e.g. "12 mar 2022"
  enrollmentDate: string; // e.g. "feb 2025"
  allergy: AllergyType;
  allergyNotes?: string; // e.g. "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila."
  parents: LinkedParent[];
  avatarColor: AvatarColor;
  avatarTextColor: AvatarColor;
}

export const children: Child[] = [
  // 8 children matching the ninos.dc.html mockup exactly
];
```

8 children: Mateo Fernández (MANÍ), Sofía Méndez, Benjamín Ruiz, Valentina Soto, Tomás Díaz (LACTOSA), Emma Castro, Lucas Romero, Olivia Vega. Each with unique avatar color pair from `AvatarColor` enum.

---

## Implementation Plan

1. **Create mock data** — Add `data/mock/kids.ts` with `AllergyType`, `AvatarColor`, `ParentStatus` enums, `Child`, `LinkedParent` interfaces, and exactly 8 children matching the `ninos.dc.html` mockup: Mateo Fernández (MANÍ), Sofía Méndez, Benjamín Ruiz, Valentina Soto, Tomás Díaz (LACTOSA), Emma Castro, Lucas Romero, Olivia Vega. Each with unique avatar color pair, linked parents with status.

2. **Create `KidCard` component** — Add `components/kids/kid-card.tsx`:
   - Server component
   - Props: `Child` object
   - Renders: avatar circle (colored bg from enum, initial), name, age + parent count line, allergy badge (if `AllergyType !== None`) or chevron icon
   - Links to `/kids/{id}`
   - Hover effect: `translateY(-2px)` + border color change to `#F2A78E`

3. **Create `KidsList` page** — Add `app/(dashboard)/kids/page.tsx` (client component for search state):
   - Header: "GESTIÓN" eyebrow + "Niños" title + "Agregar niño" button (gradient, placeholder)
   - Search bar: magnifying glass icon + "Buscar niño…" placeholder, frontend name filtering via `useState` (filters `children` array by `name.toLowerCase().includes(query)`)
   - Classroom group header: "SALA SOLES" section label + counter showing filtered count (e.g., "8 niños" or "3 niños")
   - Grid of `KidCard` components: `grid-cols-1 md:grid-cols-2` with 14px gap
   - Uses Tailwind classes for all styling, matching mockup spacing/colors

4. **Create `KidsProfile` page** — Add `app/(dashboard)/kids/[id]/page.tsx`:
   - Dynamic route param `id` (string)
   - "Volver a Niños" back link → `/kids`
   - Two-column layout on desktop (stacks on mobile):
     - Left column: large avatar (84px) + name (Fredoka, 28px) + age/sala line, allergy alert card with icon + notes text, data table rows (fecha de nacimiento, sala, ingreso), "Editar" button (placeholder)
     - Right column: "Resumen del día" button (dark bg, placeholder), "PADRES VINCULADOS" section with parent rows showing avatar, name, role, status badge (ACTIVA=green, PENDIENTE=yellow), "Vincular otro padre" link
   - Uses mock data; if id not found, shows simple not-found state

5. **Add responsive adjustments** — Ensure both pages:
   - Mobile: single column, full-width cards, stacked profile sections, drawer nav
   - Desktop: 2-column grid for kid list, two-column profile layout, fixed sidebar
   - Handled via `(dashboard)` layout group + Tailwind responsive utilities

6. **No new CSS files** — All styling via Tailwind classes in TSX. Use arbitrary values for specific colors from mockup (`bg-[#A9D9E8]`, etc.).

---

## Acceptance Criteria

- [x] `npm run lint` passes with no errors
- [x] `npm run build` passes with no errors
- [x] `data/mock/kids.ts` exports `AllergyType`, `AvatarColor`, `ParentStatus` enums and `Child`, `LinkedParent` interfaces
- [x] Mock data contains exactly 8 children with correct names, ages, classrooms, allergy types, avatar colors, and linked parents
- [x] `/kids` page renders at desktop viewport (1440px) matching `references/pantallas/ninos.dc.html`: header with "GESTIÓN" + "Niños" + "Agregar niño", search bar, "SALA SOLES" section with child counter, 2-column grid of kid cards
- [x] `/kids` page renders at mobile viewport (375px) with single-column card layout, search bar, and header stacked appropriately
- [x] Search input "Buscar niño..." filters the kid list by name in real-time (frontend, case-insensitive)
- [x] Classroom counter updates dynamically when search filters results (e.g., "8 niños" → "1 niño")
- [x] Each kid card shows: colored avatar with initial, full name, age + parent count, and allergy badge (MANÍ/LACTOSA) or chevron where applicable
- [x] Kid cards have hover effect with `translateY(-2px)` and border color change
- [x] `/kids/mateo-fernandez` (or equivalent id) renders at desktop viewport matching `references/pantallas/perfil-nino.dc.html`: two-column layout with profile info on left, action buttons + linked parents on right
- [x] `/kids/mateo-fernandez` renders at mobile viewport (375px) with stacked single-column layout
- [x] Profile page shows: large avatar (84px), name (Fredoka 28px), age/sala line, allergy alert card with icon + notes, data table (fecha de nacimiento, sala, ingreso), "Editar" button
- [x] Profile right sidebar: "Resumen del día" button, "PADRES VINCULADOS" section with parent rows showing avatar/name/role/status badge (ACTIVA green, PENDIENTE yellow), "Vincular otro padre" link
- [x] "Volver a Niños" link navigates to `/kids`
- [x] All UI copy is in Spanish
- [x] All component code uses English naming (files, variables, types)
- [x] Existing `NavShell` and `Sidebar` components are reused via `(dashboard)` route group
- [x] No new CSS files created — all styling via Tailwind classes in TSX

---

## Decisions Taken

- **Route naming:** `/kids` and `/kids/[id]` — English route names as requested, not `/ninos`
- **Data approach:** Independent mock data file (`data/mock/kids.ts`) with typed enums (`AllergyType`, `AvatarColor`, `ParentStatus`) for type safety
- **Search functionality:** Frontend name filtering via `useState` — filters `children` array by `name.toLowerCase().includes(query)`, updates counter dynamically
- **Component structure:** Separate `KidCard` component for reusability; `KidsList` page is client component (for search state), `KidsProfile` is server component
- **Responsive strategy:** Mobile-first via Tailwind responsive utilities (`grid-cols-1 md:grid-cols-2`); `(dashboard)` layout group handles nav shell responsiveness
- **ID format:** Child IDs use kebab-case slugs derived from names (e.g., `mateo-fernandez`) for URL readability
- **Color approach:** Arbitrary Tailwind values (`bg-[#A9D9E8]`) for one-off avatar/badge colors instead of bloating `globals.css` theme tokens

## Identified Risks

- **Mock data drift:** Hardcoded mock data will diverge from real data once backend is added. This is acceptable for a visual-only spec; data layer will be addressed in a future spec.
- **Search performance:** Frontend filtering is fine for 8 children but won't scale. Mitigation: this is intentional for the visual-only phase; server-side search will replace it in a future spec.

---

## Verification Results

**Date:** Sun Sep 13 2026 (re-verified on `opencode/issue5-20260913184037`, after PR #4 / spec 04 merge)  
**Verifier:** @spec-verifier  
**Result:** ALL 19 CRITERIA PASSED

### Build & Lint
- `npm run lint` — passed (no errors)
- `npm run build` — passed (TypeScript, static generation: `/kids` static, `/kids/[id]` dynamic, 7/7 pages)

### Visual Verification (Playwright screenshots in `.playwright-mcp/`)
- `kids-desktop.png` — `/kids` at 1440px: header, search, 2-column grid (393px columns), 8 cards with avatars/allergy badges
- `kids-mobile.png` — `/kids` at 375px: single-column stacked layout (335px cards), search bar, header
- `profile-mateo-desktop.png` — `/kids/mateo-fernandez` at 1440px: two-column layout (flex-row), 84px avatar, Fredoka 28px name, allergy card, data table, linked parents with status badges (ACTIVA `rgb(207,235,216)`, PENDIENTE `rgb(247,231,166)`)
- `profile-mateo-mobile.png` — `/kids/mateo-fernandez` at 375px: single-column stacked layout (flex-column)

### Functional Tests (37/37 automated checks passed)
- Search "mateo" → filtered from "8 niños" to "1 niño", only Mateo Fernández shown; case-insensitive ("SOFÍA" → 1 result); clearing restores 8
- Hover on kid card → computed `translate: 0px -2px` + border-color `rgb(242,167,142)` (#F2A78E)
- Card avatars match mockup colors exactly (Mateo #A9D9E8, Sofía #F4B8CC, Benjamín #B9DEC4, Valentina #F4DC8E, Tomás #C9B6E8, Emma #F4B8CC, Lucas #A9D9E8, Olivia #B9DEC4 — mockup repeats pairs, data matches)
- "Volver a Niños" link → successfully navigated from `/kids/mateo-fernandez` back to `/kids`
- Unknown id (`/kids/does-not-exist`) → 404 not-found state via `notFound()`
- Static checks: `NavShell`/`Sidebar` reused via `(dashboard)` layout; only `app/globals.css` exists (no new CSS files); code naming in English

### Notes
- Spec 04 additions (`AddChildModal`, `Classroom` enum in `data/mock/kids.ts`, `"Agregar niño"` opens modal) coexist on these routes without breaking any 02 criteria
- "Vincular otro padre" links to `/kids/[id]/link-parent`, a route not yet implemented (404 until the corresponding spec lands) — consistent with parent-linking being out of scope for this spec
