# SPEC 04 — Add Child Modal

> **Status:** Implemented
> **Depends on:** SPEC 02
> **Date:** 2026-09-13
> **Objective:** Implement a modal dialog for adding a child that appears when clicking "Agregar niño" on the `/kids` page, matching the reference mockup `agregar-nino.dc.html`, with required field validation and classroom options.

## Scope

**In:**

- `AddChildModal` component in `components/kids/add-child-modal.tsx` — modal with overlay, card layout, header (Cancelar / Agregar niño / Guardar), and form fields
- Required fields: nombre completo, fecha de nacimiento (custom dd/mm/yyyy formatting), sala (native select dropdown)
- Optional fields: alergias (text input), notas médicas (textarea)
- Validation: red border on empty required fields when "Guardar" is pressed; modal stays open
- Modal dismiss: click overlay, press Escape, or click "Cancelar"
- "Guardar" closes the modal only — no state mutation or API call
- Add `Classroom` enum with "Soles", "Hojas Verdes", "Arcoiris" to `data/mock/kids.ts`
- Wire modal into `app/(dashboard)/kids/page.tsx` — open via button click, controlled by React state
- All UI copy in Spanish, component code in English
- All styling via Tailwind classes matching the reference design exactly

**Out of scope (for future specs):**

- Actually adding the child to mock data or API
- Server-side persistence
- Photo/avatar upload
- Parent linking from the modal
- Edit child functionality
- Success/error toasts or notifications

## Data Model

This spec extends the existing `data/mock/kids.ts` with a `Classroom` enum:

```ts
// data/mock/kids.ts — addition
export enum Classroom {
  Soles = "Soles",
  HojasVerdes = "Hojas Verdes",
  Arcoiris = "Arcoiris",
}

export const classrooms = Object.values(Classroom);
```

No new interfaces are introduced. The modal form fields map to existing `Child` properties (`name`, `birthday`, `classroom`, `allergy`, `allergyNotes`).

## Implementation Plan

1. **Add `Classroom` enum to mock data** — Extend `data/mock/kids.ts` with `Classroom` enum ("Soles", "Hojas Verdes", "Arcoiris") and exported `classrooms` array. Verification: `npm run build` compiles, enum values accessible.

2. **Create `AddChildModal` component** — Add `components/kids/add-child-modal.tsx` (client component):
   - Props: `{ open: boolean; onClose: () => void }`
   - Render nothing when `open` is false
   - Overlay: fixed full-screen, semi-transparent dark background (`bg-black/40`), z-index above sidebar
   - Card: centered, `max-w-[520px]`, `rounded-[24px]`, `bg-[#FBF4EC]`, `border border-[#ECE0D0]`, shadow
   - Header: "Cancelar" (left, clickable → `onClose`), "Agregar niño" (center, Fredoka, 18px, semibold), "Guardar" (right, coral `#D9583C`, bold)
   - Form fields:
     - **Nombre completo** (required): text input, placeholder "Ej. Martina López"
     - **Fecha de nacimiento** (required): text input with auto-formatting as user types (dd/mm/yyyy pattern — inserts `/` after day and month digits)
     - **Sala** (required): native `<select>` with classroom options, styled to match text inputs (rounded border, white bg, chevron icon)
     - **Alergias** (optional): text input, placeholder "Ej. Maní, Lactosa"
     - **Notas médicas** (optional): textarea, placeholder "Indicaciones, medicación, contactos…", min-height ~90px
   - Input styling: `rounded-[14px]`, `border-[1.5px] border-[#EADFD0]`, `bg-white`, `px-4 py-3`, `text-[15px]`
   - Label styling: `text-[12px] font-extrabold tracking-[0.7px] text-taupe`
   - Validation: on "Guardar" click, check required fields; if empty, add red border (`border-[#D9583C]`); if all valid, call `onClose()`
   - Date formatting: as user types digits, auto-insert `/` separators (max 10 chars: dd/mm/yyyy)
   - Escape key handler: call `onClose()` when pressed
   - Overlay click handler: call `onClose()` when clicked (not when card is clicked)
   - Verification: component renders without errors, modal opens/closes correctly

3. **Wire modal into `/kids` page** — Modify `app/(dashboard)/kids/page.tsx`:
   - Add `useState<boolean>` for modal visibility
   - Add `onClick` handler to "Agregar niño" button → `setModalOpen(true)`
   - Render `<AddChildModal open={modalOpen} onClose={() => setModalOpen(false)} />`
   - Verification: clicking "Agregar niño" opens the modal; clicking "Cancelar", overlay, or pressing Esc closes it

4. **Verification** — `npm run lint` + `npm run build` pass; Playwright screenshots in `.playwright-mcp/` at 1440px and 375px showing modal open state.

## Acceptance Criteria

- [x] `npm run lint` passes with no errors
- [x] `npm run build` passes with no errors
- [x] `data/mock/kids.ts` exports `Classroom` enum with values "Soles", "Hojas Verdes", "Arcoiris"
- [x] `components/kids/add-child-modal.tsx` exists and is a client component
- [x] Modal does not render when `open` prop is false
- [x] Modal renders centered overlay with card matching `references/pantallas/agregar-nino.dc.html` at 1440px
- [x] Modal header shows "Cancelar" (left), "Agregar niño" (center, Fredoka), "Guardar" (right, coral)
- [x] Form contains all 5 fields: nombre completo, fecha de nacimiento, sala, alergias, notas médicas
- [x] Labels use taupe color, 12px, extrabold, with letter-spacing
- [x] Inputs have rounded corners (14px), light border, white background
- [x] "Fecha de nacimiento" auto-formats as dd/mm/yyyy while typing (slashes inserted automatically)
- [x] "Sala" is a native `<select>` dropdown with 3 classroom options
- [x] Clicking "Guardar" with empty required fields shows red borders on those fields and modal stays open
- [x] Clicking "Guardar" with all required fields filled calls `onClose()` and modal closes
- [x] Clicking "Cancelar" closes the modal
- [x] Clicking the overlay backdrop closes the modal
- [x] Pressing Escape key closes the modal
- [x] "Agregar niño" button on `/kids` page opens the modal
- [x] Modal is responsive and usable at 375px viewport (no horizontal scroll, inputs full-width)
- [x] All UI copy is in Spanish
- [x] All component code uses English naming
- [x] All styling via Tailwind classes (no CSS files created)

## Decisions

- **Yes:** simple React state modal (no portal) — keeps implementation simple, no z-index conflicts in this app
- **Yes:** modal closes on overlay click + Escape + Cancelar — standard modal UX, user confirmed
- **Yes:** red border validation feedback — minimal, matches design language, user confirmed
- **Yes:** native `<select>` for sala — simpler, accessible, matches mockup appearance, user confirmed
- **Yes:** custom date input with auto-formatting — avoids native date picker inconsistencies across browsers, user confirmed
- **No:** actual child creation / state mutation — visual-only for now, deferred to CRUD spec
- **No:** success toast or notification — modal simply closes, future spec may add feedback
- **Yes:** `Classroom` enum in mock data — centralized source of truth, easy to extend later

## Risks

| Risk                                                                | Mitigation                                                                                                           |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Date auto-formatting edge cases (paste, backspace, cursor position) | Keep formatting logic simple: only insert `/` when typing digits, ignore other events; can be refined in future spec |
| Modal z-index conflict with sidebar/drawer                          | Use Tailwind `z-50` or higher; verify at both viewports                                                              |
| Native `<select>` styling differs across browsers                   | Use appearance-none + custom chevron SVG for consistent look                                                         |

## What is **not** in this spec

- Actually adding the child to mock data or API
- Photo/avatar upload
- Parent linking from the modal
- Edit child functionality
- Success/error toasts or notifications
- Server-side persistence

Each one of those, if it lands, goes in its own spec.
