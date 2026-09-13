# SPEC 03 — Login and Activate Account Screens

> **State:** Approved
> **Depends on:** None
> **Date:** 2026-09-13
> **Objective:** Implement the `/login` and `/activate` routes as visual-only auth screens matching the reference mockups, responsive, outside the dashboard nav shell, with internal role tracking on login for future use.

## Scope

**In:**

- `/login` route — two-column layout (branding panel left, login form right) on desktop; single centered form on mobile (branding panel hidden)
- `/activate` route — centered activation form with welcome message, child info card, invitation code, email, password, photo authorization checkbox
- Route group `(auth)` with its own layout — no sidebar, no nav shell, full-width/centered layouts
- Internal role state tracking on login (default: staff) for future use — no role toggle UI shown
- All UI copy in Spanish, component code in English
- Visual-only: no real authentication, no form validation, no persistence, no URL params
- Responsive at all viewports: desktop (1440px) and mobile (375px)

**Out of scope (for future specs):**

- Real authentication / login flow
- Password reset flow
- Role selection UI (Personal / Familia toggle deferred)
- Form validation (email format, password strength, required fields)
- URL token handling for activation
- Navigation after login/activate (links are visual placeholders)
- Session management or localStorage

## Data Model

This feature introduces no new data structures. All values are hardcoded strings matching the mockup. Internal role state uses a simple client-side `useState<"staff" | "parent">("staff")` for future extensibility.

## Implementation Plan

1. **Create `(auth)` layout** — Add `app/(auth)/layout.tsx`:
   - Server component
   - Wraps children with a minimal layout: no sidebar, no nav shell
   - Background: `#FBF4EC` (warm background token)
   - Children render centered or full-width depending on the page
   - Verification: `npm run build` compiles, visiting `/login` shows blank page with warm background

2. **Create login page** — Add `app/(auth)/login/page.tsx` (client component for role state):
   - Two-column grid on desktop: branding panel (left, ~50%) + login form (right, centered)
   - Branding panel: gradient background (coral tones), OpenDayCare logo + icon, headline "El día de cada niño, compartido con su familia.", subtitle, classroom name "Guardería Sala Soles"
   - Login form: "Iniciar sesión" heading, subtitle "Ingresá para ver el día de hoy.", email input, password input, "¿Olvidaste tu contraseña?" link, "Iniciar sesión" button (gradient), footer link "¿Te invitó la guardería? Activá tu cuenta" → `/activate`
   - Internal role state: `useState<"staff" | "parent">("staff")` — no UI toggle, tracked for future use
   - Login button is a visual placeholder (no navigation)
   - Verification: `/login` renders at 1440px matching `references/pantallas/login.dc.html` (minus role toggle)

3. **Create activate page** — Add `app/(auth)/activate/page.tsx` (server component):
   - Centered layout, max-width ~440px
   - OpenDayCare icon (gradient rounded square with sun icon)
   - Heading "Bienvenida a OpenDayCare", subtitle "Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar la cuenta."
   - Child info card: avatar circle + "Te invitaron a seguir a" + "Mateo · Sala Soles"
   - Fields: "CÓDIGO DE INVITACIÓN" (value "7K4P9"), "EMAIL" (value "lucia.fernandez@gmail.com"), "CREAR CONTRASEÑA" (type password)
   - Checkbox with label "Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de la app." (checked, green)
   - "Activar mi cuenta" button (gradient), footer link "¿Ya tenés cuenta? Iniciar sesión" → `/login`
   - Verification: `/activate` renders at 1440px matching `references/pantallas/activar-cuenta.dc.html`

4. **Add responsive adjustments** — Ensure both pages:
   - Mobile (375px): login shows only the form centered (branding panel hidden via `hidden lg:flex`), activate stays centered with full-width inputs
   - Desktop (1440px): login shows two-column layout, activate stays centered
   - No horizontal scroll at any viewport
   - Verification: Playwright screenshots at 375px for both pages

5. **Verification** — `npm run lint` + `npm run build` pass; Playwright screenshots in `.playwright-mcp/` at 1440px and 375px for both routes.

## Acceptance Criteria

- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` passes with no errors
- [ ] `/login` renders at desktop viewport (1440px) matching `references/pantallas/login.dc.html`: two-column layout with branding panel (gradient, logo, headline, subtitle, classroom name) on left, login form (heading, email, password, forgot password link, login button, footer link to activate) on right
- [ ] `/login` renders at mobile viewport (375px) with branding panel hidden and login form centered
- [ ] No horizontal scroll at 375px on `/login`
- [ ] `/activate` renders at desktop viewport (1440px) matching `references/pantallas/activar-cuenta.dc.html`: centered form with icon, welcome heading, child info card, invitation code, email, password, authorization checkbox, activation button, footer link to login
- [ ] `/activate` renders at mobile viewport (375px) with centered form and full-width inputs
- [ ] No horizontal scroll at 375px on `/activate`
- [ ] Both routes are outside the `(dashboard)` route group — no sidebar, no nav shell visible
- [ ] Login page includes internal role state (`useState<"staff" | "parent">("staff")`) — no role toggle UI
- [ ] All UI copy is in Spanish
- [ ] All component code uses English naming (files, variables, types)
- [ ] All styling via Tailwind classes (no CSS files created)
- [ ] Login button and activate button are visual placeholders — no navigation occurs on click
- [ ] Footer links navigate between `/login` and `/activate`
- [ ] Fonts: Fredoka for headings, Nunito for body (inherited from root layout)
- [ ] Colors match mockup: warm background `#FBF4EC`, text `#3F362E`, coral gradient for buttons/branding panel

## Decisions

- **Yes:** `(auth)` route group — keeps auth pages separate from dashboard, no nav shell inherited
- **No:** reusing `(dashboard)` layout — auth pages need full-width/centered layouts, not sidebar
- **Yes:** internal role state tracking without UI toggle — prepares for future role selection without adding UI now
- **No:** role toggle (Personal / Familia) — user explicitly deferred
- **Yes:** hardcoded values on activate page — visual-only spec, no URL params or token handling
- **No:** form validation — deferred to auth implementation spec
- **Yes:** branding panel hidden on mobile — no mobile mockup for login, standard pattern to simplify mobile
- **Yes:** English route names (`/login`, `/activate`) — consistent with `/kids` convention from spec 02
- **Yes:** login page as client component (for role state), activate page as server component — minimal client JS
- **Yes:** SVGs inline (like mockup) — no icon library needed

## Risks

| Risk                                                                          | Mitigation                                                                             |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Branding panel gradient/colors differ from mockup when translated to Tailwind | Use exact hex values from mockup with arbitrary Tailwind values (`bg-[#F6A98E]`, etc.) |
| Future auth implementation will need to replace visual-only forms             | Mock data and state are isolated in `(auth)` pages; future spec swaps in real logic    |

## What is **not** in this spec

- Real authentication / login flow
- Password reset
- Role selection UI
- Form validation
- URL token handling for activation
- Session management
- Navigation to dashboard after login

Each one of those, if it lands, goes in its own spec.
