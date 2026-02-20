# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow

Work locally, then push to git after each meaningful edit:

```bash
npm run dev          # dev server (Turbopack) — http://localhost:3000
npm run build        # production build
npx tsc --noEmit     # type-check without emitting
npm run lint         # ESLint
```

After edits: `git add <files> && git commit -m "..." && git push`
Server (Vultr, 45.76.92.147): `git pull && npm run dev -- -H 0.0.0.0` (port 3000, `ufw allow 3000` already done)

## Route Architecture

Three distinct route groups, each with its own layout:

| URL pattern | Route group | Layout shell |
|---|---|---|
| `/`, `/features`, `/pricing`, `/blog` | `app/(public)/` | `Navbar` + `Footer` |
| `/login`, `/register` | `app/(auth)/` | Centered auth layout with logo + ThemeToggle |
| `/docs`, `/docs/**` | `app/docs/` | Top nav + `DocsSidebar` + `DocsToc` panel |
| `/app`, `/app/**` | `app/app/` | `AppSidebar` + `AppTopbar` (fixed height, overflow-hidden shell) |

The outer `app/` is Next.js App Router root; the inner `app/app/` folder maps to the `/app` URL segment — this nesting is intentional.

`app/loading.tsx` is a global loading UI (dual-ring spinner + pulsing logo).

## Tech Stack Specifics

**Tailwind CSS v4** — CSS-first, no `tailwind.config.js`. All config lives in `app/globals.css`:
- Design tokens → `@theme inline { ... }` block
- Custom animations registered there and as `@keyframes` + `@layer utilities` classes
- Adding a new color token: add to both `:root`/`.dark` blocks AND the `@theme inline` mapping

**shadcn/ui** — Components are vendored in `components/ui/`. Do not run `npx shadcn add` (it would overwrite customizations). Edit files directly if changes are needed. New primitives should be added manually following the existing pattern.

**Dark mode** — `next-themes` with `attribute="class"`. The `.dark` class is applied to `<html>`. Use `dark:` Tailwind variants. Never use `useTheme()` for logo swaps — use dual `<img>` tags:
```tsx
<img src="/logo.svg" className="block dark:hidden" />
<img src="/logo-white.svg" className="hidden dark:block" />
```
Or `className="dark:invert"` on the black logo for simple cases.

**`"use client"`** — Required on any component using hooks (`useState`, `useEffect`, `usePathname`, etc.). Layout and page components are server components by default.

## Design System

OKLCH color tokens (defined in `globals.css`). Primary accent is blue — `var(--primary)` = blue-600 light / blue-400 dark.

Logo files: `public/logo.svg` (black paths) and `public/logo-white.svg` (white paths). The `Navbar` component applies scroll-aware transparency: transparent + white text over the dark hero on `/`, frosted glass on scroll or other routes.

Animation utilities available (defined in globals.css): `.animate-fade-up`, `.animate-fade-in`, `.animate-float`, `.animate-float-slow`, `.animate-pulse-glow`, `.animate-spin-slow`, `.delay-{100–500}`. Also `.glass` (frosted glass surface) and `.text-gradient`.

Dark sections (hero, how-it-works, cta) use `bg-zinc-950` with CSS gradient orbs (`blur-[120px]` colored `div`s). Light page body uses `bg-background` (zinc-50/zinc-950). The hero fades into the page with `bg-gradient-to-t from-zinc-100 dark:from-zinc-950`.

## Mock Data

All mock data is in `lib/mock/`. These are the source of truth for all dashboard and UI state — no API calls anywhere.

- `jobs.ts` — exports `JobStatus` type (`"queued" | "processing" | "done" | "failed"`) and `Job` interface. `StatusPill` in `components/dashboard/` consumes `JobStatus`.
- `api-keys.ts` — keys named "Production", "CI Bot", "Staging" with `rk_live_…` format
- `templates.ts`, `webhooks.ts`, `usage.ts` — follow same typed interface + mock array pattern

When adding new dashboard pages, add a corresponding mock file before writing the page.

## ImagePlaceholder

`components/media/image-placeholder.tsx` — used everywhere a real screenshot or image will eventually go. Always use this instead of a real `<img>` for asset slots. Key props:
- `label` — descriptive text including intended dimensions, e.g. `"Dashboard screenshot (1200×720 @2x)"`
- `aspect` — CSS aspect-ratio string like `"16/9"` (preferred over fixed `height`)
- `rounded="none"` — use when the parent already clips with `overflow-hidden rounded-*`
