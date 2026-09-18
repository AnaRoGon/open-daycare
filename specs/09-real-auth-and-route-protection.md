# SPEC 09 — Real Email/Password Auth and Route Protection

> **Status:** Approved
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
- Logout functionality accessible from the dashboard nav shell
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

6. **Add logout button to dashboard nav shell** — Modify `components/shared/nav-shell.tsx`:
   - Add a logout button/trigger that calls the `logout` Server Action
   - Position visibly in the nav (e.g., user avatar menu or dedicated button)
   - Verification: clicking logout signs out and redirects to `/login`

7. **Tighten RLS policies on `users` table** — Apply migration to replace permissive `*_all` policies with authenticated-user-scoped policies:
   - SELECT: users can see their own record and other users in the same daycare
   - UPDATE: users can update their own record
   - INSERT/DELETE: staff role only (or keep permissive for now, tighten later)
   - Verification: `supabase_execute_sql` confirms new policies exist

8. **Verification** — `npm run lint` + `npm run build` pass; Playwright screenshots and interaction tests at 1440px and 375px for login error display, redirect behavior, and logout.

## Acceptance Criteria

- [ ] `npm run lint` passes with no errors
- [ ] `npm run build` passes with no errors
- [ ] Unauthenticated access to `/` (dashboard) redirects to `/login`
- [ ] Unauthenticated access to `/kids` redirects to `/login`
- [ ] Unauthenticated access to `/kids/[id]` redirects to `/login`
- [ ] `/login` is accessible without authentication
- [ ] `/activate` is accessible without authentication
- [ ] Authenticated user visiting `/login` is redirected to `/`
- [ ] Login form submits email/password to Supabase via `signInWithPassword`
- [ ] Invalid credentials show a generic error message ("Email o contraseña incorrectos") in red with an exclamation icon below the inputs
- [ ] Invalid credentials add red border (`border-red-500` or equivalent) to both email and password input fields
- [ ] Error message does not indicate whether email or password specifically was wrong
- [ ] Valid credentials log the user in and redirect to `/` (dashboard)
- [ ] Proxy refreshes Supabase session on every request via `getClaims()`
- [ ] Logout button exists in the dashboard nav shell
- [ ] Clicking logout signs the user out and redirects to `/login`
- [ ] After logout, accessing dashboard routes redirects to `/login`
- [ ] RLS policies on `users` table are no longer fully permissive (at least SELECT scoped to authenticated users)
- [ ] Forgot password link remains a visual placeholder (no functionality)
- [ ] Login page visual design preserved at desktop (1440px) and mobile (375px)

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
