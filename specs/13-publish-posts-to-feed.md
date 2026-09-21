# SPEC 13 — Publish Posts to Feed with Optional Photos

> **Status:** Implemented
> **Depends on:** SPEC 01, SPEC 06
> **Date:** 2026-09-21
> **Objective:** Make the create-post modal actually add posts to the feed (in-memory), with support for selecting and previewing local photos without uploading them to any server.

## Scope

**In scope:**

- Extend the `Post` interface in `data/mock/feed.ts` with a `photos?: string[]` field (array of base64 data URLs for local previews)
- Add a `PostContext` (React Context) in `contexts/post-context.tsx` that provides the post list (mock + user-created) and an `addPost` function to append new posts in memory
- Wrap the dashboard layout with `PostProvider` in `app/(dashboard)/layout.tsx`
- Modify `CreatePostModal` to:
  - Open a real file picker (`<input type="file" accept="image/*" multiple>`) when clicking "Agregar"
  - Read selected images as data URLs (`FileReader.readAsDataURL`) and display them as previews in the FOTOS section
  - Each preview has a "×" button to remove the photo
  - The "Publicar" button builds a `Post` object from the form data and calls `addPost`, then closes the modal and resets state
  - Validate that a type and description are provided before publishing (show inline visual feedback if missing)
- Modify the home page (`app/(dashboard)/page.tsx`) to read posts from the context instead of the static mock array
- The feed shows new posts alongside existing mock posts, with their photos displayed as clickable previews (visual only, no real navigation yet)
- Limit of up to 6 photos per post
- Everything in memory (no localStorage, no database)

**Not in scope (for future specs):**

- Real photo upload to Supabase Storage
- Post persistence across sessions (localStorage or DB)
- Editing and deleting published posts
- Functional likes and comments
- Real navigation to post detail
- Notifications or toasts on publish

---

## Data Model

Extension of `data/mock/feed.ts`:

```ts
// data/mock/feed.ts — extension
export interface Post {
  id: string;
  type: PostType;
  author: string;
  initials?: string;
  time: string;
  audience: string;
  body: string;
  photo?: string; // legacy: placeholder text (mock posts)
  photos?: string[]; // new: array of data URLs (user-created posts)
  likes: number;
  comments: number;
}
```

New context in `contexts/post-context.tsx`:

```ts
// contexts/post-context.tsx
interface PostContextValue {
  posts: Post[];
  addPost: (post: Omit<Post, "id" | "time" | "likes" | "comments">) => void;
}
```

The context initializes with mock posts from `data/mock/feed.ts`. `addPost` generates a unique `id` (e.g. `post-${Date.now()}-${Math.random()}`), assigns the current time (`new Date().toLocaleTimeString`), and sets `likes: 0, comments: 0`.

---

## File Structure

```
contexts/
  post-context.tsx              # React Context for posts + addPost
components/
  feed/
    create-post-modal.tsx       # functional modal: file picker, previews, publish
  home/
    post-card.tsx               # adapted to show real photos (photos array)
app/
  (dashboard)/
    layout.tsx                  # wrapped with PostProvider
    page.tsx                    # reads posts from context
data/
  mock/
    feed.ts                     # Post extended with photos?
```

---

## Implementation Plan

1. **Extend `Post` with `photos?`** — Add `photos?: string[]` to the `Post` interface in `data/mock/feed.ts`. Verification: `npm run build` compiles without errors.

2. **Create `PostContext`** — Add `contexts/post-context.tsx` with `PostProvider` that initializes with mock posts and exposes `posts` + `addPost`. Verification: the provider renders without errors and `posts` includes the 3 mock posts.

3. **Wrap dashboard with `PostProvider`** — Modify `app/(dashboard)/layout.tsx` to wrap children with `<PostProvider>`. Verification: the app loads without errors.

4. **Adapt `page.tsx` to use the context** — Since the page is a Server Component, create a client `FeedContent` component that reads posts from the context and renders the list. The server page only passes necessary data (user). Verification: the feed shows the 3 mock posts as before.

5. **Make the FOTOS section functional in the modal** — Modify `create-post-modal.tsx`:
   - Add state `selectedPhotos: string[]` (data URLs)
   - The "Agregar" button triggers a hidden `<input type="file" accept="image/*" multiple>`
   - On file selection, read each file with `FileReader.readAsDataURL` and append to state
   - Display each photo as a thumbnail (96x96, object-cover) with a "×" button to remove
   - Limit of 6 photos: hide the "Agregar" button when reached
   - Verification: photos can be selected, viewed, and removed in the modal

6. **Make the "Publicar" button functional** — Modify `create-post-modal.tsx`:
   - Import `usePostContext` from the context
   - Validate: if no `selectedType` or `description` is empty, show inline visual message ("Seleccioná un tipo" / "Escribí una descripción")
   - On publish: build the post object, call `addPost`, close modal, reset state
   - Verification: after publishing, the post appears in the feed

7. **Adapt `PostCard` to show real photos** — Modify `components/home/post-card.tsx`:
   - If `post.photos` exists and has elements, show the first photo as a real image (`<img src={post.photos[0]}>`) instead of the dotted placeholder
   - If there are multiple photos, show a "+N" indicator over the image
   - Keep the existing placeholder for mock posts that only have `photo` (string)
   - Verification: mock posts look the same, new posts show their photos

8. **Final verification** — `npm run lint` + `npm run build` without errors; Playwright screenshots in `.playwright-mcp/` showing modal with selected photos and a published post in the feed.

---

## Acceptance Criteria

- [x] `npm run lint` passes with no errors
- [x] `npm run build` passes with no errors
- [x] `data/mock/feed.ts` exports `Post` with `photos?: string[]` field
- [x] `contexts/post-context.tsx` exists and exports `PostProvider` and `usePostContext`
- [x] `PostProvider` initializes with mock posts from `feed.ts`
- [x] `addPost` generates a unique id, timestamp, and `likes: 0, comments: 0`
- [x] `app/(dashboard)/layout.tsx` wraps content with `PostProvider`
- [x] The feed shows mock posts on page load
- [x] The "Agregar" button in FOTOS opens a real file picker
- [x] Selected images are displayed as thumbnails in the FOTOS section
- [x] Each thumbnail has a remove button
- [x] Up to 6 photos can be selected per post
- [x] The "Agregar" button is hidden when 6 photos are reached
- [x] If no type is selected on publish, a visual message is shown
- [x] If description is empty on publish, a visual message is shown
- [x] Publishing with valid data adds the post to the feed
- [x] The published post appears in the feed with its type, audience, description, and photos
- [x] `PostCard` shows real photos when `post.photos` has elements
- [x] Mock posts without `photos` still show the existing dotted placeholder
- [x] The modal fully resets after publishing
- [x] Everything is kept in memory (no localStorage or DB persistence)
- [x] The app works correctly after a refresh (only mock posts visible)

---

## Decisions Taken

- **Yes:** React Context to share posts between modal and feed — simple, in-memory, no persistence, easy to migrate to real API later
- **Yes:** data URLs (base64) for photo previews — no Storage required, works entirely client-side
- **Yes:** limit of 6 photos per post — reasonable for daycare use, prevents the modal from growing too large
- **Yes:** `FeedContent` as a client component inside the server page — keeps the page as a Server Component while allowing client state for the feed
- **Yes:** simple inline validation messages — sufficient for this visual phase
- **No:** localStorage for post persistence across sessions — user confirmed visual-only for now
- **No:** Supabase Storage for photos — confirmed as local preview only
- **No:** editing/deleting posts — future spec

## Identified Risks

| Risk                                                 | Mitigation                                                                     |
| ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| Large image data URLs can consume significant memory | Limit of 6 photos; browser frees on refresh; visual-only for now               |
| `crypto.randomUUID()` not available in all browsers  | Use `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` as fallback |
| Modal grows too tall with many selected photos       | Internal scroll in the FOTOS section if more than 3 photos                     |

---

## What is **not** in this spec

- Real photo upload to Supabase Storage
- Post persistence across sessions
- Editing and deleting posts
- Functional likes and comments
- Notifications or toasts

Each one of those, if it lands, goes in its own spec.

---

## Verification

**Date:** 2026-09-21
**Verified by:** @spec-verifier (Playwright E2E + code inspection)
**Result:** 22/22 — All criteria passed ✅

| #   | Criterion                                         | Status | Evidence                                                            |
| --- | ------------------------------------------------- | ------ | ------------------------------------------------------------------- |
| 1   | `npm run lint` passes                             | ✅     | 0 errors, 2 warnings (no-img-element, acceptable for data URLs)     |
| 2   | `npm run build` passes                            | ✅     | TypeScript compiled, all pages generated                            |
| 3   | `Post` with `photos?: string[]`                   | ✅     | `data/mock/feed.ts` line 39                                         |
| 4   | `PostProvider` + `usePostContext` exported        | ✅     | `contexts/post-context.tsx` lines 13, 40                            |
| 5   | Provider initializes with mock posts              | ✅     | `useState<Post[]>(mockPosts)` line 14                               |
| 6   | `addPost` generates id, time, likes:0, comments:0 | ✅     | Lines 18-27 of post-context.tsx                                     |
| 7   | Layout wraps with `PostProvider`                  | ✅     | `app/(dashboard)/layout.tsx` line 9                                 |
| 8   | Feed shows mock posts on load                     | ✅     | Playwright: 3 posts visible (Mateo logro, Mateo actividad, Anuncio) |
| 9   | "Agregar" opens real file picker                  | ✅     | Playwright: file chooser triggered on click                         |
| 10  | Selected images as thumbnails                     | ✅     | Playwright: 2 thumbnails (96x96, object-cover) visible after upload |
| 11  | Each thumbnail has remove button                  | ✅     | Playwright: "×" buttons visible on each thumbnail                   |
| 12  | Up to 6 photos per post                           | ✅     | Code: `MAX_PHOTOS = 6`, slices files to remaining                   |
| 13  | "Agregar" hidden at 6 photos                      | ✅     | Code: `{selectedPhotos.length < MAX_PHOTOS && (...)}`               |
| 14  | Visual message if no type                         | ✅     | Playwright: "Seleccioná un tipo" shown in red                       |
| 15  | Visual message if empty description               | ✅     | Playwright: "Escribí una descripción" + red border on textarea      |
| 16  | Publish adds post to feed                         | ✅     | Playwright: new post appeared as first item in feed                 |
| 17  | Post shows type, audience, description, photos    | ✅     | Playwright: LOGRO badge, "toda la sala", body text, photo visible   |
| 18  | PostCard shows real photos                        | ✅     | Playwright: `<img>` rendered with uploaded photo                    |
| 19  | Mock posts show dotted placeholder                | ✅     | Playwright: post-2 shows "Foto · pintando con témperas" placeholder |
| 20  | Modal resets after publishing                     | ✅     | Playwright: reopened modal — all fields cleared                     |
| 21  | No localStorage or DB                             | ✅     | Grep: no localStorage/sessionStorage/Supabase storage calls         |
| 22  | Refresh shows only mock posts                     | ✅     | Playwright: hard reload → only 3 mock posts visible                 |

**Screenshots saved to:** `.playwright-mcp/spec-13-publish-posts-to-feed/`

- `modal-with-photos.png` — modal with 2 selected photo thumbnails
- `published-post-in-feed.png` — feed with newly published post (LOGRO, with photo)
