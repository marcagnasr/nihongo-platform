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

### Step 3 — Components (pending)
Navbar, Modal, Toast, LessonCard, ProgressBar, FilterBar, QuizOverlay.

### Step 4 — Pages (pending)
Home, Browse (`/lessons`), Player, Dashboard, Admin.

### Step 5 — Deploy to Vercel (pending)
Needs the Vercel account.
