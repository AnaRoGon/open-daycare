# SPEC 05 — Link Parent Modal

> **Status:** Aprroved
> **Depends on:** SPEC 02
> **Date:** 2026-09-13
> **Objective:** Implement a modal dialog for linking a parent to a child that appears when clicking "Vincular otro padre" on the `/kids/[id]` page, matching the reference mockup `vincular-padre.dc.html`, with required field validation and visual-only submission.

## Scope

**In:**

- `LinkParentModal` component in `components/kids/link-parent-modal.tsx` — modal with overlay, card layout, and form fields
- Props: `{ open: boolean; childName: string; onClose: () => void }`
- Required fields: nombre del padre/madre, email, parentesco (Mamá / Papá / Tutor/a)
- Display-only invitation code section (fixed mock value)
- Validation: red border on empty required fields when "Enviar invitación" is pressed; modal stays open
- Modal dismiss: click overlay, press Escape, or click close (X) button
- "Enviar invitación" closes the modal only — no state mutation or API call (visual-only)
- Wire modal into `app/(dashboard)/kids/[id]/page.tsx` — replace the existing `<Link>` with a button that opens the modal
- Header shows child name ("a {childName}") taken from the current child
- All UI copy in Spanish, component code in English
- All styling via Tailwind classes matching the reference design exactly

**Out of scope (for future specs):**

- Actually sending email invitations
- Generating real invitation codes
- Saving linked parent to mock data or API
- Parent activation flow
- Editing or removing linked parents
- Success/error toasts or notifications

## Data Model

This feature introduces no new data structures. The invitation code is a fixed mock string (e.g. `"7K4P9"`) displayed read-only. The form fields are local state only.

## Implementation Plan

1. **Create `LinkParentModal` component** — Add `components/kids/link-parent-modal.tsx` (client component):
   - Props: `{ open: boolean; childName: string; onClose: () => void }`
   - Render nothing when `open` is false
   - Overlay: fixed full-screen, semi-transparent dark background (`bg-black/40`), z-index above sidebar
   - Card: centered, `max-w-[480px]`, `rounded-[24px]`, `bg-[#FBF4EC]`, `border border-[#ECE0D0]`, shadow
   - Header: left side shows title "Vincular padre" + subtitle "a {childName}" (Fredoka 18px semibold); right side has X close button (rounded 10px, clickable → `onClose`)
   - Info banner: blue background `#E3ECFB`, info icon, text "Le enviaremos un correo con un código para que active su cuenta. Solo verá el feed de {childName}."
   - Form fields:
     - **Nombre del padre/madre** (required): text input, placeholder "Ej. Diego Fernández"
     - **Email** (required): email input, placeholder "correo@ejemplo.com"
     - **Parentesco** (required): three pill buttons in a row — "Mamá", "Papá", "Tutor/a" — selected state has blue border/bg, unselected has neutral border
   - Invitation code display: yellow dashed box with "CÓDIGO DE INVITACIÓN" label, fixed code "7K4P9" in Fredoka 34px, "Vence en 7 días" subtitle
   - Submit button: "Enviar invitación" — coral gradient, full-width, with send icon
   - Input styling: `rounded-[14px]`, `border-[1.5px] border-[#EADFD0]`, `bg-white`, `px-4 py-3`, `text-[15px]`
   - Label styling: `text-[12px] font-extrabold tracking-[0.7px]` in taupe
   - Validation: on "Enviar invitación" click, check required fields; if empty, add red border; if all valid, call `onClose()`
   - Escape key handler: call `onClose()` when pressed
   - Overlay click handler: call `onClose()` when clicked (not when card is clicked)
   - Verification: component renders without errors, modal opens/closes correctly

2. **Wire modal into `/kids/[id]` page** — Modify `app/(dashboard)/kids/[id]/page.tsx`:
   - Add `"use client"` directive if not already present (or wrap in a client component)
   - Add `useState<boolean>` for modal visibility
   - Replace the existing `<Link href="/kids/${child.id}/link-parent">` with a `<button>` that opens the modal
   - Render `<LinkParentModal open={modalOpen} childName={child.name} onClose={() => setModalOpen(false)} />`
   - Verification: clicking "Vincular otro padre" opens the modal; clicking X, overlay, or pressing Esc closes it

3. **Verification** — `npm run lint` + `npm run build` pass; Playwright screenshots in `.playwright-mcp/` at 1440px and 375px showing modal open state.

## Acceptance Criteria

- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` passes with no errors
- [ ] `components/kids/link-parent-modal.tsx` exists and is a client component
- [ ] Modal does not render when `open` prop is false
- [ ] Modal renders centered overlay with card matching `references/pantallas/vincular-padre.dc.html` at 1440px
- [ ] Modal header shows "Vincular padre" + "a {childName}" (Fredoka) and X close button
- [ ] Info banner shows blue background with info icon and explanatory text referencing child name
- [ ] Form contains 3 required fields: nombre del padre/madre, email, parentesco
- [ ] Labels use taupe color, 12px, extrabold, with letter-spacing
- [ ] Inputs have rounded corners (14px), light border, white background
- [ ] Parentesco shows 3 pill buttons: "Mamá", "Papá", "Tutor/a" — one can be selected
- [ ] Invitation code box displays fixed code "7K4P9" in Fredoka, dashed yellow border, "Vence en 7 días"
- [ ] Submit button shows "Enviar invitación" with send icon, coral gradient, full-width
- [ ] Clicking "Enviar invitación" with empty required fields shows red borders and modal stays open
- [ ] Clicking "Enviar invitación" with all required fields filled calls `onClose()` and modal closes
- [ ] Clicking X button closes the modal
- [ ] Clicking the overlay backdrop closes the modal
- [ ] Pressing Escape key closes the modal
- [ ] "Vincular otro padre" button on `/kids/[id]` page opens the modal (replaces previous Link)
- [ ] Modal is responsive and usable at 375px viewport (no horizontal scroll, inputs full-width)
- [ ] All UI copy is in Spanish
- [ ] All component code uses English naming
- [ ] All styling via Tailwind classes (no CSS files created)

## Decisions

- **Yes:** modal inline replacing the Link — consistent with SPEC 04 (AddChildModal), avoids creating a new route
- **Yes:** fixed mock invitation code "7K4P9" — visual-only for now, real code generation deferred
- **Yes:** parentesco as pill buttons (not dropdown) — matches mockup, better UX for 3 options
- **Yes:** required fields only (nombre, email, parentesco) — user confirmed all three mandatory
- **Yes:** visual-only submission — no email sending or state mutation, deferred to future spec
- **No:** separate `/kids/[id]/link-parent` route — replaced by modal approach
- **No:** real invitation code generation — fixed value for now, future spec may add backend

## Risks

| Risk                                                  | Mitigation                                                                               |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Modal z-index conflict with sidebar/drawer            | Use Tailwind `z-50` or higher; verify at both viewports                                  |
| Parentesco selection state management                 | Simple `useState<string>` for selected value; validate non-empty on submit               |
| Page is server component but modal needs client state | Wrap modal in a client component or add `"use client"` to page; verify SSR compatibility |

## What is **not** in this spec

- Actually sending email invitations
- Generating real invitation codes
- Saving linked parent to mock data or API
- Parent activation flow
- Editing or removing linked parents
- Success/error toasts or notifications

Each one of those, if it lands, goes in its own spec.
