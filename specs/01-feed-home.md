# SPEC 01 — Feed como home

> **Estado:** Implementado
> **Depende de:** Ninguna
> **Fecha:** 2026-08-25
> **Objetivo:** Implementar la pantalla de Feed como página de inicio (`/`) con datos mock en `data/mock/`, visualmente idéntica al mockup `references/pantallas/feed.dc.html` en desktop y con navegación responsive (drawer), sin autenticación ni base de datos.

## Alcance

**In:**

- Fuentes Fredoka (títulos) y Nunito (cuerpo) vía `next/font/google` en `app/layout.tsx`, metadata en español (título "OpenDayCare", `lang="es"`).
- Tokens de la paleta cálida en `app/globals.css` con Tailwind v4 `@theme` (fondo `#F6ECDF`, texto `#3F362E`, tarjetas `#FFFDF9`, bordes `#ECE0D0`, acentos coral/verde/celeste/azul de badges) y valores arbitrarios (`rounded-[20px]`, `max-w-[760px]`, etc.) donde no exista utilidad exacta. Se elimina el dark mode del template.
- Navegación como componentes compartidos en `components/shared/`:
  - `nav-shell.tsx` ("use client"): sidebar desktop fija de 248px + topbar con hamburguesa + drawer con overlay en `<lg` (cierre por overlay y tecla Esc).
  - `sidebar.tsx`: contenido puro de la sidebar (logo + "Sala Soles", botón "Nueva publicación", nav con Feed activo, tarjeta de usuario "Caro Giménez"), reutilizado por el drawer.
  - Montados en `app/(dashboard)/layout.tsx` (route group).
- Componentes propios del home en `components/home/`:
  - `greeting.tsx`: eyebrow "GUARDERÍA · SALA SOLES", "Buenas, Caro", "12 niños · martes 17 jun".
  - `compose-trigger.tsx`: caja "Compartí un momento…" con avatar y botón de cámara.
  - `post-card.tsx`: publicación con 3 variantes por tipo (LOGRO/ACTIVIDAD/ANUNCIO, avatar o ícono, "Para: …", texto, placeholder de foto punteado, likes/comentarios/Editar).
- Página `/` en `app/(dashboard)/page.tsx`: ensambla greeting, compose-trigger, divisor "PUBLICADO HOY" y `posts.map(PostCard)`, con `max-w-[760px]` y paddings colapsables en móvil.
- Datos mock tipados en `data/mock/feed.ts` (importados como `@/data/mock/feed`), listos para swap por API real.
- Todos los estilos con Tailwind (clases utilitarias + tokens), sin CSS ad-hoc por componente.

**Out of scope (futuros specs):**

- Pantallas Niños, Avisos, Mi cuenta, Nueva publicación, Detalle de publicación, Foto, Login.
- Autenticación y cierre de sesión.
- Base de datos / API real.
- Interactividad real (likes, comentarios, crear/editar publicaciones).
- Modo oscuro.

## Modelo de datos

**Convención de nombres:** todo el código interno (tipos, interfaces, variables, funciones, props, archivos) va **en inglés**, siguiendo las reglas de código limpio del repo. Solo el copy visible en pantalla (textos, labels, valores de los datos mock como nombres y mensajes) queda **en español**.

```ts
// data/mock/feed.ts
export type PostType = "logro" | "actividad" | "anuncio";

export interface Post {
  id: string;
  type: PostType;
  author: string; // "Mateo" | "Anuncio general"
  initials?: string; // "M" (solo posts de niño; el anuncio usa ícono)
  time: string; // "14:20"
  audience: string; // "familia de Mateo" | "toda la sala"
  body: string;
  photo?: string; // leyenda del placeholder; ausente = sin foto
  likes: number;
  comments: number;
}

export const user = {
  name: "Caro Giménez",
  role: "Maestra · Soles",
  initials: "C",
};
export const classroom = {
  name: "Sala Soles",
  childrenCount: 12,
  date: "martes 17 jun",
};
export const posts: Post[] = [
  /* las 3 del mockup */
];
```

Los valores string ("Mateo", "familia de Mateo", "martes 17 jun", etc.) son copy de UI y se mantienen en español; solo los identificadores están en inglés. Colores de badge/avatar se derivan de `type` dentro de `PostCard` (no van en los datos). La fecha del saludo es texto mock fijo ("martes 17 jun"), no `new Date()`.

## Estructura de archivos

```
app/
  layout.tsx                  # fuentes Fredoka/Nunito + metadata
  globals.css                 # tokens Tailwind v4 (@theme)
  (dashboard)/
    layout.tsx                # compone el nav shell
    page.tsx                  # home: ensambla greeting + trigger + posts
components/
  shared/
    nav-shell.tsx             # "use client": sidebar desktop + topbar/hamburguesa + drawer con overlay
    sidebar.tsx               # contenido puro de la sidebar (reutilizado por el drawer)
  home/
    greeting.tsx              # eyebrow + "Buenas, Caro" + "12 niños · martes 17 jun"
    compose-trigger.tsx       # caja "Compartí un momento…"
    post-card.tsx             # publicación (3 variantes por tipo)
data/
  mock/
    feed.ts                   # tipos + datos mock
```

Criterio de las subcarpetas: `shared/` = elementos comunes a varias pantallas, `home/` = propios del feed.

## Plan de implementación

1. **Fuentes y tokens**: reemplazar Geist por Fredoka + Nunito en `app/layout.tsx`, actualizar metadata, reescribir `app/globals.css` (paleta cálida en `@theme`, sin dark mode). Verificación: `npm run dev` carga con fondo `#F6ECDF` y Nunito.
2. **Datos mock**: crear `data/mock/feed.ts` con tipos y las 3 publicaciones. Verificación: `npm run build` compila.
3. **Sidebar y layout**: crear `components/shared/sidebar.tsx` y `app/(dashboard)/layout.tsx`; mover `app/page.tsx` → `app/(dashboard)/page.tsx` (mismo paso, para no romper `/`). Verificación: sidebar de 248px visible en `/` en desktop.
4. **Nav shell responsive**: crear `components/shared/nav-shell.tsx` (topbar con hamburguesa + drawer con overlay, cierre por overlay y Esc, en `<lg`). Verificación: a 375px aparece la barra superior y el drawer abre/cierra.
5. **Componentes del home**: crear `components/home/greeting.tsx`, `compose-trigger.tsx` y `post-card.tsx` (3 variantes por `type`). Verificación: render de una publicación de prueba.
6. **Página home**: reemplazar el boilerplate de `app/(dashboard)/page.tsx` por el feed completo (saludo, disparador, divisor "PUBLICADO HOY", `posts.map(PostCard)`) con `max-w-[760px]` y paddings colapsables en móvil. Verificación: comparación visual lado a lado contra el mockup.
7. **Verificación final**: `npm run lint` + `npm run build` sin errores; capturas con Playwright en `.playwright-mcp/` a 1440px y 375px.

## Criterios de aceptación

- [x] `npm run lint` y `npm run build` pasan sin errores.
- [x] En `≥1024px`, `/` muestra la sidebar fija de 248px y columna central de 760px, idéntica al mockup.
- [x] En `<1024px`, la sidebar se oculta, hay barra superior con hamburguesa, y el drawer se abre/cierra (clic en overlay y Esc cierran).
- [x] A 375px no hay scroll horizontal y el contenido es legible.
- [x] El saludo muestra exactamente "GUARDERÍA · SALA SOLES", "Buenas, Caro" y "12 niños · martes 17 jun".
- [x] Se renderizan exactamente 3 publicaciones con badges LOGRO (verde), ACTIVIDAD (celeste) y ANUNCIO (azul).
- [x] La publicación de actividad muestra el placeholder punteado "Foto · pintando con témperas".
- [x] Ningún elemento navega fuera de `/` (no hay 404 al interactuar).
- [x] Los títulos usan Fredoka y el cuerpo Nunito.
- [x] Con el esquema oscuro del SO activo, la página sigue mostrando la paleta cálida (sin dark mode).
- [x] Los estilos usan exclusivamente clases Tailwind (sin CSS ad-hoc por componente).
- [x] Todo el código interno (tipos, variables, funciones, props, nombres de archivo) está en inglés; los strings visibles (labels, textos de las publicaciones, nombres) están en español.
- [x] La comparación visual contra el mockup coincide en espaciados, radios, colores y tipografías.

## Decisiones

- **Sí:** código interno en inglés (tipos, variables, funciones, props, archivos: `Post`, `PostType`, `posts`, `user`, `classroom`, etc.) y copy de UI en español — cumple las reglas de código limpio del repo; los strings del mock son contenido visible, no identificadores.
- **No:** nombres en español para tipos y variables (`Publicacion`, `usuario`, `sala`) — mezclar idiomas en el código dificulta lectura y mantenimiento.
- **Sí:** estilos 100% Tailwind con tokens en `@theme` y arbitrary values para valores exactos del mockup — sin CSS ad-hoc por componente.
- **Sí:** datos mock tipados en `data/mock/feed.ts` (carpeta dedicada `data/mock/`) — el swap futuro por API real solo toca esa carpeta y las importaciones.
- **No:** JSON importado — menos tipado, sin ventaja.
- **Sí:** carpeta `components/` con subcarpetas por dominio (`shared/`, `home/`) — legibilidad y reutilización; las pantallas futuras agregan las suyas (p. ej. `ninos/`, `avisos/`).
- **Sí:** nav completa (sidebar + topbar + drawer) en `shared/` — la heredan todas las pantallas del dashboard.
- **Sí:** `PostCard` en `home/` — hoy solo lo usa el feed; se promueve a `shared/` si el futuro detalle de publicación lo reutiliza.
- **No:** fragmentar más (logo, botón de logout, badges como archivos propios) — archivos de 5 líneas no aportan legibilidad.
- **Sí:** sidebar como componente compartido en route group `app/(dashboard)/` — las pantallas futuras la heredan.
- **Sí:** links visuales sin navegación — cada pantalla llega con su spec y evita 404s.
- **Sí:** responsive con patrón drawer + barra superior en `<lg` — no hay mockup móvil y es el patrón estándar que menos altera el diseño desktop.
- **No:** sidebar de solo íconos en tablet y barra inferior tipo app — más estados intermedios y/o mayor desvío del mockup sin referencia visual.
- **Sí:** eliminar dark mode — el diseño de referencia no lo tiene.
- **Sí:** fecha del saludo fija como mock ("martes 17 jun") — los datos dinámicos llegan con la API real.
- **Sí:** SVGs inline en los componentes (como el mockup) — sin librería de íconos ni de componentes.

## Riesgos

| Riesgo                                                                     | Mitigación                                                                                           |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Diferencias visuales sutiles al traducir estilos inline a Tailwind         | Usar valores exactos del mockup con arbitrary values; comparación visual como criterio de aceptación |
| El route group `(dashboard)` rompe `/` si `page.tsx` se mueve en otro paso | El paso 3 mueve la página y verifica la ruta en el mismo commit                                      |
| No existe mockup móvil                                                     | El drawer reutiliza el mismo componente de sidebar; solo cambia el contenedor                        |

## Lo que **no** está en este spec

- Pantallas Niños, Avisos, Mi cuenta, Nueva publicación, Detalle, Foto, Login.
- Autenticación / logout.
- Base de datos / API.
- Interactividad real (likes, comentarios, crear/editar).
- Modo oscuro.

Cada una de esas, si llega, va en su propio spec.
