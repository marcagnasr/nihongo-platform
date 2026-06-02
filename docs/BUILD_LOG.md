# Nihongo Platform — Build Log

A plain-language record of what got built, **why**, and **how it works** — so
you can follow every decision. Newest entries at the bottom of each phase.

The master checklist lives in `../nihongo_implementation_plan.md`. This log is
the "how we actually did it" companion to that plan.

---

## How to run the project

```bash
cd nihongo-platform
npm run dev      # start dev server → http://localhost:3000
npm run build    # production build (also the best way to catch errors)
npm run start    # serve the production build
npm run lint     # eslint
```

## Stack (as actually installed)

| Thing      | Version  | Notes |
|------------|----------|-------|
| Next.js    | 16.2.7   | Plan said 14; latest stable is 16. Same App Router architecture. |
| React      | 19       | |
| Tailwind   | v4       | Configured in CSS (`@theme` in globals.css), **not** a `tailwind.config.ts` file like the plan assumed. |
| TypeScript | strict   | |

> **Next.js 16 note:** The scaffold's `AGENTS.md` warns that v16 has breaking
> changes vs. older Next.js. Bundled docs live in
> `node_modules/next/dist/docs/` — check them before using an unfamiliar API.

---

## Phase 1 — Project Scaffold + Design Port

### Step 0 — Scaffold (done)

- Created with `create-next-app`: TypeScript, Tailwind, App Router, ESLint,
  `@/*` import alias, **no** `src/` dir (matches the plan's `app/` layout).
- Verified the dev server returns HTTP 200.

### Step 1 — Design system (done)

**Goal:** port the prototype's look (fonts + colour palette + component styles)
into the Next.js app, faithfully, so later screens just reuse it.

**Files touched:**

- `app/layout.tsx` — loads the three Google fonts via `next/font/google`
  (self-hosted, no layout shift). Each exposes a CSS variable:
  - `--font-shippori` → Shippori Mincho (headings, logo, Japanese text)
  - `--font-dm-sans`  → DM Sans (body, buttons, labels)
  - `--font-dm-mono`  → DM Mono (timestamps, lesson numbers)
  These variable names are attached to `<html>`, so any CSS can read them.

- `app/globals.css` — the design system, ported ~1:1 from the prototype's
  `main.css` + `navbar.css`. Structure:
  1. `@import "tailwindcss";`
  2. **`:root` tokens** — the exact colour values from the prototype
     (`--ink`, `--paper`, `--red`, …), names preserved.
  3. **`@theme inline` bridge** — re-exposes those tokens to Tailwind v4 so
     utility classes work too: `bg-paper`, `text-ink`, `text-red`,
     `border-border`, `font-shippori`, etc.
  4. Reset + base `body` styles, then all the component/screen classes
     (`.btn`, `.lesson-card`, `.hero`, `.dash-card`, …) and the responsive
     `@media` block.

- `app/page.tsx` — **temporary** placeholder that renders a few buttons, tags,
  and lesson cards to prove the fonts + tokens work. Gets replaced by the real
  Home screen in the "pages" step.

**Key decision — why a global stylesheet instead of rewriting as Tailwind utilities:**
The plan says the prototype CSS "ports over nearly 1:1." Keeping the design as a
global stylesheet (a) guarantees a pixel-for-pixel match, (b) lets later
components attach the same semantic class names you already know from the
prototype (`className="lesson-card"`), keeping the port mechanical and readable,
and (c) still gives us Tailwind utilities via the `@theme` bridge when handy.

**You get both styling worlds:**
- Semantic classes from the prototype: `<div className="lesson-card">`
- Tailwind utilities from the tokens: `<div className="bg-paper text-ink">`

**Known follow-ups (intentionally deferred):**
- Shippori Mincho is loaded with the `latin` subset only (keeps the font file
  small). The decorative Japanese kana will fall back to a system serif until
  we decide whether the `japanese` subset is worth the larger download.

**Verified:** `npm run build` compiles, TypeScript passes, fonts resolve.

### Step 2 — Data layer (done)

**Goal:** move the lessons + quizzes out of the prototype's `data.js` into a
typed, single source of truth the screens can import.

**File:** `lib/data.ts`

- **Types** (`Level`, `Topic`, `Lesson`, `QuizQuestion`, `QuizMap`) — everything
  is typed, so a typo like a wrong `level` value is caught at build time. Field
  names match the prototype exactly, so porting the screens stays mechanical.
- **Content** — all 11 lessons and the `lesson-ha-ga` quiz set, copied over verbatim.
- **Topic metadata** — `TOPICS` (display order) and `TOPIC_KANA` (the 文/語/字/話
  glyphs) that the Browse screen needs.
- **Selectors** — `getLessonById`, `getQuizForLesson`, `lessonsByTopic`. Screens
  call these instead of poking at the arrays directly. **Why this matters:** in
  Phase 2 the data moves to the database; we then change *only* these three
  functions to query Prisma, and every screen keeps working unchanged. That's
  the separation-of-concerns payoff.

**Forward-compatible by design:** the types mirror the Phase 2 Prisma schema, so
this file becomes the seed data with minimal reshaping.

**Verified:** `npx tsc --noEmit` passes (no type errors).

### Step 3 — Components (done)

**Goal:** the reusable React building blocks the screens assemble from.

**Big idea — "call from anywhere" without globals.** The prototype called
`Modal.open()` and `showToast()` as global functions. The React-idiomatic
replacement is **Context Providers + hooks**, mounted once in `app/layout.tsx`:

```
<ToastProvider>      ← exposes useToast()  → showToast(msg)
  <ModalProvider>    ← exposes useModal()  → openModal("login" | "signup")
    <Navbar />
    {children}       ← every page
```

Toast wraps Modal because the modal fires a toast when you submit. Any
component under the tree can now call `useToast()` / `useModal()`.

**Components (in `components/`):**

| File | Type | Notes |
|------|------|-------|
| `Toast.tsx` | provider + `useToast` | single toast, auto-hides after 2.8s, re-fire resets the timer. |
| `Modal.tsx` | provider + `useModal` | login/signup forms (cosmetic in Phase 1). Submit → route to `/dashboard` + toast. ESC and backdrop-click close. **Phase 2 swaps only the submit handler.** |
| `Navbar.tsx` | client | active link from `usePathname()` (URL is the source of truth, not a store). Uses `<Link>` for real prefetched navigation. |
| `ProgressBar.tsx` | **server** | pure presentational; `value` + `fill` + `mini`. The only non-client component here. |
| `LessonCard.tsx` | client | presentational tile; reports clicks via `onSelect` so the **parent** decides locked→modal vs free→navigate. |
| `FilterBar.tsx` | client | generic over the option type; parent owns the active value (no internal state). |
| `QuizOverlay.tsx` | client | the in-video quiz interaction (pick → lock → feedback → continue). Parent decides *when* to show it. |

**Decisions worth remembering:**
- **Presentational where possible.** `LessonCard`/`FilterBar`/`QuizOverlay`/`ProgressBar`
  hold little or no state and take callbacks/props — so they're reusable and the
  page that uses them owns the behaviour. That's the separation we want.
- **`<Link>` not `<button>` for nav** — proper navigation + prefetch + a11y.
  Updated the `.nav-links` CSS to target `a` as well as `button`.
- **State reset in `QuizOverlay`** uses React's "adjust state during render"
  pattern (compare prev prop), not a `useEffect` — ESLint flagged the effect
  version as a cascading-render anti-pattern.

**Verified:** `npm run build` (compile + types) and `npm run lint` both pass.

### Step 4 — Pages (done)

**Goal:** assemble the components + data into the five real screens.

| Route | File | Notes |
|-------|------|-------|
| `/` | `app/page.tsx` | Home: hero, features, pricing. Replaced the placeholder. |
| `/lessons` | `app/lessons/page.tsx` | Browse: FilterBar + LessonCards grouped by topic via `lessonsByTopic()`. |
| `/player` | `app/player/page.tsx` | Simulated video + QuizOverlay orchestration. |
| `/dashboard` | `app/dashboard/page.tsx` | Hardcoded stats (real data in Phase 5); reuses ProgressBar. |
| `/admin` | `app/admin/page.tsx` | Lesson table with live search + quiz-editor placeholder. |

**Decision — why these are Client Components.** Each screen is genuinely
interactive (filter state, the video timer, modal triggers, live search). In
Phase 2/5, the pattern flips: the page becomes a Server Component that fetches
data and passes it to a small interactive client child. That's an extraction,
not a rewrite — the markup stays.

**The tricky one — Player.** The fake video is a `setInterval` that advances
1 second per 200ms tick. A naive version breaks because the interval callback
"closes over" stale state. Fix: the authoritative values (progress, current
quiz index, playing) live in **refs** that the timer reads live; React state
just mirrors them so the UI re-renders. When the playhead reaches a quiz's
timestamp it pauses and shows `<QuizOverlay>`; "Continue" advances past the
trigger and resumes. Spacebar toggles play/pause (bound once, reads refs).

**The React way to do live search (Admin).** The prototype hid table rows by
setting `row.style.display` directly. Here, search is state and we render only
the rows whose title matches — no manual DOM manipulation.

**Verified:** lint + build pass; dev server returns HTTP 200 for all five
routes with no runtime errors.

### Step 5 — Deploy to Vercel (pending)
Needs the Vercel account. This is the only Phase 1 step that requires you to do
something (create the account + connect the repo).
