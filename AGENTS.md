<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

Next.js 16.3.2 App Router app ("OpenDayCare", a daycare/childcare app) — React 19, TypeScript strict, Tailwind CSS v4 via `@tailwindcss/postcss`. No `src/` dir: routes live in `app/`, and the `@/*` alias maps to the repo root (not `src/`).

App Router docs for this exact version ship in `node_modules/next/dist/docs/01-app/` (file conventions under `03-api-reference/03-file-conventions/`). Typed route props such as `LayoutProps<"/">` are already in use (see `app/layout.tsx`).

## Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run lint` — ESLint (flat config, no args)
- `npm run build` — production build; also runs type checking

No test suite exists yet. Verify changes with `npm run lint` then `npm run build`.

## Design source of truth

- `references/pantallas/*.dc.html` — static HTML mockups of every screen (login, feed, avisos, niños, perfil-niño, resumen-día, vincular-padre, …). `index.dc.html` is the screen index. Build the UI to match these.
- `references/screenshots/` — reference screenshots.
- UI copy is in Spanish. Fonts: Fredoka (headings) + Nunito (body); warm palette (bg `#f6ecdf`, text `#3f362e`, accent `#f2a78e`).

## Spec-driven workflow

Large features go through the spec skills in `.agents/skills/` (tracked by `skills-lock.json`):

- `/spec <short description>` — produces `specs/NN-slug.md` in Draft state (the user marks it Approved). No code is written here.
- `/spec-impl NN-slug` — implements an Approved spec on a `spec-NN-slug` branch.

## MCPs

- Playwright: Screenshots y cualquier cosa relacionada a Playwright tienen que estar en la carpeta `.playwright-mcp` (gitignored).
- Context7: Usaremos este MCP para consultar la documentación actualizada del framework.

## Notes

- `CLAUDE.md` only imports this file (`@AGENTS.md`) — add guidance here, don't duplicate it there.
