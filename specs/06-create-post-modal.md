# SPEC 06 — Create Post Modal

> **Status:** Implemented
> **Depends on:** SPEC 01, SPEC 02
> **Date:** 2026-09-13
> **Objective:** Implement a visual modal that appears when clicking "Nueva publicación" in the sidebar, matching the reference mockup `crear-publicacion.dc.html`, with interactive audience and type chips, an editable textarea, and a visual-only photo section, without persisting the post.

## Scope

**In:**

- `CreatePostModal` component in `components/feed/create-post-modal.tsx` — modal with overlay, card layout, header (Cancelar / Nueva publicación / Publicar), and sections PARA, TIPO, DESCRIPCIÓN, FOTOS
- Audience chips (PARA): derived from `data/mock/kids.ts` + "Toda la sala" button; selectable individually or multiple; selecting "Toda la sala" deselects all children; selecting any child deselects "Toda la sala"
- Type chips (TIPO): 7 types — Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio; single selection
- Editable textarea with placeholder "Contá cómo le fue hoy…"
- FOTOS section: visual only (existing photo placeholder + "Agregar" button with no functionality)
- Modal dismiss: click "Cancelar", click overlay, or press Escape
- "Publicar" button closes the modal without persisting anything
- Wire the modal in `components/shared/sidebar.tsx` — the "Nueva publicación" button opens the modal via React state
- Extend `PostType` in `data/mock/feed.ts` to the 7 types from the mockup
- All styling via Tailwind, exact visual match to the mockup
- UI copy in Spanish, component code in English

**Out of scope (for future specs):**

- Actually creating and persisting posts
- Photo upload / file picker
- Required field validation
- Notifications or toasts on publish
- Feed integration (adding the created post to the list)
- Dark mode

## Data Model

Extension of `data/mock/feed.ts`:

```ts
// data/mock/feed.ts — extension
export type PostType =
  | "comida"
  | "siesta"
  | "actividad"
  | "logro"
  | "animo"
  | "foto"
  | "anuncio";

export const postTypeLabels: Record<PostType, string> = {
  comida: "Comida",
  siesta: "Siesta",
  actividad: "Actividad",
  logro: "Logro",
  animo: "Ánimo",
  foto: "Foto",
  anuncio: "Anuncio",
};

export const postTypeColors: Record<PostType, { bg: string; text: string }> = {
  comida: { bg: "#9A7B1E", text: "#fff" },
  siesta: { bg: "#E7DCF6", text: "#7B5FC0" },
  actividad: { bg: "#2E89A6", text: "#fff" },
  logro: { bg: "#CFEBD8", text: "#3E9B6C" },
  animo: { bg: "#F9D2DE", text: "#C56486" },
  foto: { bg: "#FBD8CC", text: "#D9684A" },
  anuncio: { bg: "#CCD8F4", text: "#4E72C8" },
};
```

Audience chips are derived from `data/mock/kids.ts` (the existing children) plus the "Toda la sala" option. No new data interfaces are introduced.

## File Structure

```
components/
  feed/
    create-post-modal.tsx     # create post modal
data/
  mock/
    feed.ts                   # PostType extension + labels + colors
components/
  shared/
    sidebar.tsx               # wire "Nueva publicación" button to modal
```

## Implementation Plan

1. **Extend `PostType` in mock data** — Extend `data/mock/feed.ts` with the 7 types from the mockup, the `postTypeLabels` map, and `postTypeColors`. Verification: `npm run build` compiles without errors.

2. **Create `CreatePostModal` component** — Add `components/feed/create-post-modal.tsx` (client component):
   - Props: `{ open: boolean; onClose: () => void }`
   - Renders nothing when `open` is false
   - Overlay: fixed full-screen, semi-transparent (`bg-black/40`), z-index above sidebar
   - Card: centered, `max-w-[580px]`, `rounded-[24px]`, `bg-[#FBF4EC]`, `border border-[#ECE0D0]`, shadow
   - Header: "Cancelar" (left, gray `#94887B`, click → `onClose`), "Nueva publicación" (center, Fredoka 18px semibold), "Publicar" (right, coral `#D9583C`, bold, click → `onClose`)
   - Internal state: `selectedChildren: string[]` (array of child ids), `allRoom: boolean`, `selectedType: PostType | null`, `description: string`
   - PARA section: child chips derived from `data/mock/kids.ts` (circular avatar with `avatarColor` + initial + name) + "Toda la sala" button; multi-select; toggle logic:
     - Selecting "Toda la sala": `setAllRoom(true)`, `setSelectedChildren([])`
     - Selecting a child: `setAllRoom(false)`, toggle child id in `selectedChildren`
     - Active style: border `#3F362E`, background `#3F362E`, white text; inactive: border `#ECE0D0`, background `#FFFDF9`
   - TIPO section: 7 type chips with colors from `postTypeColors`; single selection (click one to select, click same to deselect)
   - DESCRIPCIÓN section: textarea with placeholder "Contá cómo le fue hoy…", `min-h-[120px]`, `rounded-[14px]`, border `#EADFD0`, value controlled by state
   - FOTOS section: existing photo placeholder (96x96, background `#F4ECE1`, image icon SVG) + "Agregar" button (96x96, dashed border `#DBCDBA`, + icon SVG + "Agregar" text) — visual only, no functionality
   - Escape key handler: calls `onClose()`
   - Overlay click handler: calls `onClose()` when clicking outside the card
   - State reset on open: when `open` changes from false to true, clear all selections
   - Verification: component renders without errors, modal opens/closes correctly

3. **Wire modal into sidebar** — Modify `components/shared/sidebar.tsx`:
   - Add `useState<boolean>` for modal visibility
   - Import `CreatePostModal`
   - Add `onClick` handler to "Nueva publicación" button → `setModalOpen(true)`
   - Render `<CreatePostModal open={modalOpen} onClose={() => setModalOpen(false)} />`
   - Verification: clicking "Nueva publicación" opens the modal; clicking "Cancelar", overlay, or pressing Escape closes it

4. **Verification** — `npm run lint` + `npm run build` pass; Playwright screenshots in `.playwright-mcp/` at 1440px and 375px showing modal open state.

## Acceptance Criteria

- [x] `npm run lint` passes with no errors
- [x] `npm run build` passes with no errors
- [x] `data/mock/feed.ts` exports `PostType` with 7 values: comida, siesta, actividad, logro, animo, foto, anuncio
- [x] `data/mock/feed.ts` exports `postTypeLabels` and `postTypeColors`
- [x] `components/feed/create-post-modal.tsx` exists and is a client component
- [x] Modal does not render when `open` prop is false
- [x] Modal renders centered overlay with card matching `references/pantallas/crear-publicacion.dc.html` at 1440px
- [x] Header shows "Cancelar" (left), "Nueva publicación" (center, Fredoka), "Publicar" (right, coral)
- [x] PARA section shows chips for all children from mock data + "Toda la sala" button
- [x] Child chips show circular avatar with initial + name (matching the mockup)
- [x] Selecting "Toda la sala" deselects any previously selected children
- [x] Selecting a child deselects "Toda la sala" if it was active
- [x] Multiple children can be selected simultaneously
- [x] TIPO section shows 7 chips: Comida, Siesta, Actividad, Logro, Ánimo, Foto, Anuncio
- [x] Type chips have the colors from the mockup
- [x] Only one type can be selected at a time
- [x] DESCRIPCIÓN textarea is editable with placeholder "Contá cómo le fue hoy…"
- [x] FOTOS section shows image placeholder + "Agregar" button (visual only, no functionality)
- [x] Clicking "Cancelar" closes the modal
- [x] Clicking the overlay backdrop closes the modal
- [x] Pressing Escape key closes the modal
- [x] Clicking "Publicar" closes the modal
- [x] "Nueva publicación" button in the sidebar opens the modal
- [x] Modal is responsive and usable at 375px viewport (no horizontal scroll, content legible)
- [x] All UI copy is in Spanish
- [x] All component code uses English naming
- [x] All styling via Tailwind classes (no CSS files created)

## Decisions

- **Yes:** visual-only modal without persistence — real post CRUD will go in a future spec
- **Yes:** audience chips derived from `data/mock/kids.ts` — consistent with the rest of the app, easy to migrate to real API
- **Yes:** multi-select children with mutual exclusion with "Toda la sala" — expected UX behavior, user confirmed
- **Yes:** single type selection — only one type per post
- **Yes:** 7 post types (comida, siesta, actividad, logro, animo, foto, anuncio) — faithful to the mockup
- **Yes:** "Publicar" closes modal without action — visual-only for now
- **Yes:** photo section visual only — real file picker will go in a future spec
- **No:** field validation — not required for this visual phase
- **No:** feed integration — the post is not added to the list

## Risks

| Risk                                               | Mitigation                                                                                         |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Child chips may become too many if mock data grows | Modal uses flex-wrap; if there are many children, vertical scroll can be added to the PARA section |
| Type colors hardcoded                              | Centralized in `postTypeColors` in mock data, easy to maintain                                     |

## What is **not** in this spec

- Actually creating and persisting posts
- Photo upload / file picker
- Field validation
- Feed integration
- Dark mode

Each one of those, if it lands, goes in its own spec.

---

## Verification

**Date:** 2026-09-13
**Verified by:** @spec-verifier
**Result:** 27/27 PASS

Screenshots:
- `.playwright-mcp/spec-06-create-post-modal/modal-open-1440.png`
- `.playwright-mcp/spec-06-create-post-modal/modal-open-375.png`

All acceptance criteria verified via: `npm run lint` + `npm run build`, code review, Playwright interaction tests (open/close via Cancelar, overlay, Escape, Publicar; selection logic for children and types; textarea editing), and responsive testing at 1440px and 375px.
