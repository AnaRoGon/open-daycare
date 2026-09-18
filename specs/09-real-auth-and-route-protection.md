# SPEC 09 — Real Email/Password Auth and Route Protection

> **Status:** Implemented
> **Depends on:** SPEC 03, SPEC 08
> **Date:** 2026-09-18
> **Objective:** Implement real Supabase email/password login, session management via proxy, route protection (dashboard private, /login and /activate public), logout, and inline validation error display on the login form.

## Scope

**In:**

- Real Supabase email/password authentication on `/login` using `signInWithPassword`
- Session cookie management via Supabase SSR (`@supabase/ssr`)
- Route protection: `(dashboard)` routes require authentication; `/login` and `/activate` are public
- Redirect authenticated users away from `/login` → `/`
- Redirect unauthenticated users from any dashboard route → `/login`
- Logout button in the sidebar (rendered inside the dashboard nav shell)
- Inline error messages on login form: red text with exclamation icon below inputs, red border highlight on both email and password fields, generic error message ("Email o contraseña incorrectos") — no hints about which field failed
- Middleware refreshes Supabase session on every request using `supabase.auth.getClaims()`
- All UI copy in Spanish, component code in English

**Out of scope (for future specs):**

- `/activate` flow (account creation / password setup)
- Password reset flow (currently a visual placeholder)
- OAuth / social login (Google, Apple, etc.)
- Email verification requirements
- Role-based access control beyond redirecting to dashboard
- User profile management

## Data Model

No new database structures. This spec uses the existing `users` table (SPEC 08) and Supabase Auth's built-in `auth.users`. The `users.id` column is already an FK to `auth.users(id)` (documented in SPEC 08, not yet enforced by trigger).

## Implementation Plan

1. **Create `utils/supabase/proxy.ts` helper** — Create new file with `updateSession(request)` function:
   - Import `createServerClient`, `parseCookieHeader`, `serializeCookieHeader` from `@supabase/ssr`
   - Create Supabase server client with proper cookie handling via `parseCookieHeader`/`serializeCookieHeader`
   - Call `await supabase.auth.getClaims()` to refresh session before route handlers
   - Add route protection logic:
     - If path starts with `/login` or `/activate` → allow (public routes)
     - If authenticated and path is `/login` → redirect to `/`
     - If unauthenticated and path is NOT `/login` or `/activate` → redirect to `/login`
   - Return the response with updated cookies
   - Verification: `npm run build` passes

2. **Create root `proxy.ts`** — Create `proxy.ts` in project root (replaces deprecated `middleware.ts` in Next.js 16 using MCP Context7):
   - Import `updateSession` from `@/utils/supabase/proxy`
   - Export `async function proxy(request: NextRequest)` that calls `updateSession(request)`
   - Configure matcher: `'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'`
   - Verification: unauthenticated access to `/` redirects to `/login`

3. **Add Server Action for login** — Create `app/actions.ts` with a `"use server"` function `login(email: string, password: string)`:
   - Creates Supabase server client using `cookies()` from `next/headers`
   - Calls `supabase.auth.signInWithPassword({ email, password })`
   - Returns `{ success: boolean, error?: string }` — generic error message on failure
   - On success, session cookies are automatically set by Supabase client
   - Verification: Server Action compiles, returns error on bad credentials

4. **Add Server Action for logout** — Add `logout()` to `app/actions.ts`:
   - Creates Supabase server client
   - Calls `supabase.auth.signOut()`
   - Redirects to `/login` using `redirect()` from `next/navigation`
   - Verification: Server Action compiles

5. **Update login page with real authentication** — Modify `app/(auth)/login/page.tsx`:
   - Replace visual-only button with form submission calling the `login` Server Action
   - Add `useState` for error message display
   - On error: show red error message below inputs with exclamation icon, add red border (`border-red-500`) to both email and password inputs
   - On success: redirect to `/` using `useRouter()` from `next/navigation` or let middleware handle it
   - Keep existing visual design (branding panel, layout, copy)
   - Forgot password link remains a visual placeholder (`#`)
   - Verification: `/login` submits to Supabase, shows error on bad credentials, redirects on success

6. **Add logout button to sidebar** — Modify `components/shared/sidebar.tsx`:
   - Add a logout button/trigger next to the user avatar that calls the `logout` Server Action
   - Position visibly in the sidebar footer area, next to user info
   - Verification: clicking logout signs out and redirects to `/login`

7. **Tighten RLS policies on `users` table** — Apply migration to replace permissive `*_all` policies with authenticated-user-scoped policies:
   - SELECT: users can see their own record and other users in the same daycare
   - UPDATE: users can update their own record
   - INSERT/DELETE: staff role only (or keep permissive for now, tighten later)
   - Verification: `supabase_execute_sql` confirms new policies exist

8. **Verification** — `npm run lint` + `npm run build` pass; Playwright screenshots and interaction tests at 1440px and 375px for login error display, redirect behavior, and logout.

## Acceptance Criteria

- [x] `npm run lint` passes with no errors
- [x] `npm run build` passes with no errors
- [x] Unauthenticated access to `/` (dashboard) redirects to `/login`
- [x] Unauthenticated access to `/kids` redirects to `/login`
- [x] Unauthenticated access to `/kids/[id]` redirects to `/login`
- [x] `/login` is accessible without authentication
- [x] `/activate` is accessible without authentication
- [x] Authenticated user visiting `/login` is redirected to `/`
- [x] Login form submits email/password to Supabase via `signInWithPassword`
- [x] Invalid credentials show a generic error message ("Email o contraseña incorrectos") in red with an exclamation icon below the inputs
- [x] Invalid credentials add red border (`border-red-500` or equivalent) to both email and password input fields
- [x] Error message does not indicate whether email or password specifically was wrong
- [x] Valid credentials log the user in and redirect to `/` (dashboard)
- [x] Proxy refreshes Supabase session on every request via `getClaims()`
- [x] Logout button exists in the sidebar (rendered inside the dashboard nav shell)
- [x] Clicking logout signs the user out and redirects to `/login`
- [x] After logout, accessing dashboard routes redirects to `/login`
- [x] RLS policies on `users` table are no longer fully permissive (at least SELECT scoped to authenticated users)
- [x] Forgot password link remains a visual placeholder (no functionality)
- [x] Login page visual design preserved at desktop (1440px) and mobile (375px)

## Decisions

- **Yes:** Server Actions for login/logout — follows Next.js 16 App Router patterns, avoids API routes
- **Yes:** `getClaims()` in proxy — refreshes session without full network call to `getUser()`
- **Yes:** Generic error message on login failure — prevents user enumeration attacks
- **Yes:** Both inputs highlighted in red on error — clear visual feedback without revealing which field failed
- **Yes:** Redirect authenticated users from `/login` → `/` — prevents unnecessary login when already signed in
- **No:** Password reset in this spec — deferred, currently visual placeholder
- **No:** Activate flow in this spec — deferred to its own spec
- **Yes:** RLS tightened on `users` — was permissive for dev, needs basic auth scoping

## Risks

| Risk                                                           | Mitigation                                                                   |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Supabase Auth not configured for email/password in the project | Verify Supabase dashboard has Email provider enabled before implementation   |
| Session cookies not persisting across redirects                | Middleware calls `getClaims()` which triggers cookie refresh via `setAll`    |
| RLS tightening breaks existing dev workflows                   | Test with seeded staff user; keep INSERT/DELETE permissive if needed for dev |

## What is **not** in this spec

- `/activate` flow (account creation)
- Password reset functionality
- OAuth / social login
- Email verification
- Role-based access control
- User profile management

Each one of those, if it lands, goes in its own spec.

---

## Verification Log

**Date:** 2026-09-18
**Verified by:** @spec-verifier
**Result:** 20/20 criterios pasaron

### Resumen de verificación

| Criterio                                | Estado  | Evidencia                                                                                                                |
| --------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------ |
| `npm run lint`                          | ✅ Pass | Sin errores ESLint                                                                                                       |
| `npm run build`                         | ✅ Pass | TypeScript + static generation OK                                                                                        |
| Unauthenticated `/` → `/login`          | ✅ Pass | Playwright: redirect confirmado                                                                                          |
| Unauthenticated `/kids` → `/login`      | ✅ Pass | Playwright: redirect confirmado                                                                                          |
| Unauthenticated `/kids/[id]` → `/login` | ✅ Pass | Middleware protege todas las rutas no-públicas                                                                           |
| `/login` sin auth                       | ✅ Pass | Playwright: carga directa                                                                                                |
| `/activate` sin auth                    | ✅ Pass | Playwright: carga directa                                                                                                |
| Authenticated `/login` → `/`            | ✅ Pass | Playwright: login con Ana@opendaycare.com, luego navegar a `/login` redirige a `/`                                       |
| Login usa `signInWithPassword`          | ✅ Pass | `app/actions.ts` línea 10                                                                                                |
| Error genérico en rojo con ícono        | ✅ Pass | Screenshot: `.playwright-mcp/spec-09-real-auth-and-route-protection/login-error-invalid-credentials.png`                 |
| Red border en ambos inputs              | ✅ Pass | CSS eval: ambos inputs tienen `border-red-500`                                                                           |
| Error no indica campo específico        | ✅ Pass | Mensaje genérico verificado en código y UI                                                                               |
| Valid credentials → `/`                 | ✅ Pass | Playwright: login con Ana@opendaycare.com redirige a `/`                                                                 |
| Proxy `getClaims()`                     | ✅ Pass | `utils/supabase/proxy.ts` línea 50                                                                                       |
| Logout button en sidebar                | ✅ Pass | `components/shared/sidebar.tsx` línea 172, botón "Cerrar sesión" visible                                                 |
| Logout → `/login`                       | ✅ Pass | Playwright: click en logout redirige a `/login`                                                                          |
| After logout → dashboard → `/login`     | ✅ Pass | Playwright: navegar a `/` tras logout redirige a `/login`                                                                |
| RLS policies no permissivas             | ✅ Pass | 4 policies: SELECT (own + daycare), UPDATE (own), INSERT (staff/admin), DELETE (staff/admin)                             |
| Forgot password = placeholder           | ✅ Pass | `href="#"` en `login/page.tsx` línea 109                                                                                 |
| Visual desktop + mobile                 | ✅ Pass | Screenshots: `.playwright-mcp/spec-09-real-auth-and-route-protection/login-desktop-1440px.png`, `login-mobile-375px.png` |

### Notas

- Los botones de selección de rol (Personal/Familia) fueron intencionalmente removidos de la implementación.
- El botón de logout se encuentra en `components/shared/sidebar.tsx` (no en `nav-shell.tsx`), ya que el sidebar se renderiza dentro del nav shell. Se actualizó el spec para reflejar esto.
- Se creó usuario de prueba `Ana@opendaycare.com` en Supabase Auth para verificación end-to-end.
