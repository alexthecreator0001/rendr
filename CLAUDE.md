# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server (Turbopack) — http://localhost:3000
npm run worker       # PDF worker process (separate terminal)
npm run build        # production build
npx tsc --noEmit     # type-check without emitting
npm run lint         # ESLint
npm run db:migrate   # run Prisma migrations
npm run db:seed      # seed demo@rendr.dev / demo1234 + API key
npm run db:generate  # regenerate Prisma client after schema changes
```

Local dev requires two terminals: `npm run dev` and `npm run worker`. The worker handles all Playwright rendering — it must be running to process PDF jobs.

## Versioning, Changelog & Git Push Rules

**After every meaningful change:**

1. Bump `version` in `package.json` (semver: patch for fixes, minor for features, major for breaking changes)
2. Append an entry to `CHANGELOG.md` at the repo root:

```md
## [x.y.z] — YYYY-MM-DD
### Added / Changed / Fixed
- Description of what changed
```

3. Commit and push to GitHub:

```bash
git add <changed files>
git commit -m "type: short description"
git push origin main
```

This is mandatory. No update is complete without a version bump, changelog entry, and a push to GitHub.

## Per-Feature Init Files

Every significant feature or page has its own `init` file co-located with its code. This keeps context self-contained and prevents getting lost across large files.

**Convention:**
- Page init: `app/app/<feature>/_init.md` — describes the page's purpose, data sources, actions, and component breakdown
- API feature init: `app/api/v1/<feature>/_init.md` — describes the endpoint contract, auth requirements, validation schema, and side effects
- Worker feature init: `worker/_init.md` — describes queue config, processor flow, and error handling

**When to create:** Before implementing a new page or API route, create its `_init.md` first. When modifying an existing feature, update its `_init.md` to reflect the change.

**Format (keep it short):**
```md
# <Feature Name>

**Purpose:** One sentence.
**Auth:** session | api-key | none
**Data:** Prisma models used
**Actions/Routes:** List of server actions or API methods
**Components:** Key client vs server split
**State:** What triggers re-renders or refetches
```

## Route Architecture

Four distinct route groups, each with its own layout:

| URL pattern | Route group | Layout shell |
|---|---|---|
| `/`, `/features`, `/pricing`, `/blog` | `app/(public)/` | `Navbar` + `Footer` |
| `/login`, `/register` | `app/(auth)/` | Centered auth layout with logo + ThemeToggle |
| `/docs`, `/docs/**` | `app/docs/` | Top nav + `DocsSidebar` + `DocsToc` panel |
| `/app`, `/app/**` | `app/app/` | `AppSidebar` + `AppTopbar` (fixed height, overflow-hidden shell) |

The outer `app/` is Next.js App Router root; inner `app/app/` maps to the `/app` URL segment — intentional nesting.

`app/loading.tsx` is a global loading UI (dual-ring spinner + pulsing logo).

## Backend Architecture

### Auth Flow (`auth.ts`, `middleware.ts`)
- **NextAuth v5** with Credentials provider + JWT strategy
- `auth()` in server components gives `session.user.id`
- `middleware.ts` protects `/app/**` — redirects unauthenticated to `/login?callbackUrl=...`
- Dashboard pages: `const session = await auth()` → Prisma query → pass to client component

### API Key Auth (`lib/require-api-key.ts`)
All `/api/v1/*` routes (except `/health` and `/files/[token]`) call `requireApiKey(req)` which:
1. Extracts `Authorization: Bearer rk_live_...` header
2. SHA-256 hashes the key, looks up `ApiKey` by hash
3. Checks `revokedAt` — throws 401 if revoked
4. Updates `lastUsedAt` in background (non-blocking)
5. Returns `{ user, apiKey }`

Key format: `rk_live_<32-byte-base64url>`. Only the SHA-256 hash is stored. Plaintext shown once at creation.

### PDF Job Queue
1. API route creates a `Job` record (status: `queued`) → enqueues `{ jobId }` to `"pdf-conversion"` pg-boss queue
2. **Sync** (`/convert`): polls DB every 500ms for up to 8s → 200 if succeeded, 202 if still processing
3. **Async** (`/convert-async`): returns 202 immediately with `status_url`
4. Worker (`worker/index.ts`) polls pg-boss every 2s, batchSize 2 → calls `processJob(jobId)`
5. `processJob`: mark processing → launch Chromium → render → `page.pdf()` → `saveFile` → set `downloadToken` → deliver webhooks

`lib/queue.ts` exports a `globalThis`-scoped pg-boss singleton. Safe to import in API routes (send-only). Only worker calls `boss.work()`.

### Storage (`lib/storage.ts`)
PDFs saved to `$STORAGE_LOCAL_DIR/pdfs/{jobId}.pdf` (default `/data`). Served via `/api/v1/files/[token]` — no auth, token is the credential. `downloadToken` is 32 random bytes base64url stored on the Job row.

### Rate Limiting (`lib/rate-limit.ts`)
In-memory `Map`, per-API-key, 60-req/min sliding window. Single-process only — not shared across instances. Configured via `API_RATE_LIMIT_PER_MINUTE` env var.

### Webhooks (`lib/webhook.ts`)
Fired after job success/failure. Payload signed with `X-Rendr-Signature: sha256=<hmac>`. Exponential backoff retry (default: 3 attempts, starting at 1s). Delivered in parallel via `Promise.allSettled`.

### Server Actions (`app/actions/`)
Used by dashboard client components. Pattern:
```ts
export async function createXAction(_, formData: FormData) {
  const session = await auth()
  if (!session) return { error: "..." }
  // Prisma mutation
  revalidatePath("/app/...")
  return { success: true }
}
```
Used with `useActionState(action, initialState)` in client components.

### Prisma Singleton (`lib/db.ts`)
`globalThis._prisma` pattern prevents multiple instances during hot reload. Always import `prisma` from `lib/db.ts`.

## Tech Stack Specifics

**Tailwind CSS v4** — CSS-first, no `tailwind.config.js`. All config in `app/globals.css`:
- Design tokens → `@theme inline { ... }` block
- Custom animations as `@keyframes` + `@layer utilities`
- New color token: add to both `:root`/`.dark` AND the `@theme inline` mapping

**shadcn/ui** — Vendored in `components/ui/`. Do not run `npx shadcn add`. Edit files directly.

**Dark mode** — `next-themes` with `attribute="class"`. Use `dark:` variants. For logos:
```tsx
<img src="/logo.svg" className="block dark:hidden" />
<img src="/logo-white.svg" className="hidden dark:block" />
```
Or `className="dark:invert"` for simple cases.

**`"use client"`** — Required on any component using hooks. Pages and layouts are server components by default. Pattern: server component fetches data, passes to client component for interactivity.

## Design System

OKLCH color tokens in `globals.css`. Primary accent = blue (`var(--primary)` = blue-600 light / blue-400 dark).

Animation utilities: `.animate-fade-up`, `.animate-fade-in`, `.animate-float`, `.animate-float-slow`, `.animate-pulse-glow`, `.animate-spin-slow`, `.delay-{100–500}`. Also `.glass` and `.text-gradient`.

Dark sections (hero, how-it-works, CTA) use `bg-zinc-950` with blurred gradient orbs. Light body uses `bg-background`.

Logo: `public/logo.svg` (black) and `public/logo-white.svg` (white). Navbar is scroll-aware: transparent over dark hero on `/`, frosted glass on scroll or other routes.

## Mock Data

`lib/mock/` — source of truth for UI-only states. `jobs.ts` exports `JobStatus` type consumed by `StatusPill`. When adding a new dashboard page, add a corresponding mock file first.

Real dashboard pages use `auth()` + Prisma directly in server components, not mock data.

## ImagePlaceholder

`components/media/image-placeholder.tsx` — use for any unfinished asset slot.
- `label` — descriptive text with intended dimensions
- `aspect` — CSS ratio like `"16/9"` (preferred over fixed height)
- `rounded="none"` — when parent already clips with `overflow-hidden rounded-*`

## Deployment

**Server:** Vultr VPS `45.76.92.147`, domain `rendrpdf.com` (Cloudflare proxy, SSL Flexible)

```bash
# On server — after git push from local:
cd /var/www/rendr
git pull
npm install
npm run build
pm2 restart rendr-web

# Worker (separate PM2 process):
pm2 restart rendr-worker   # or: pm2 start "npm run worker" --name rendr-worker
```

**Postgres:** Docker container `rendr-postgres` on `127.0.0.1:5432`. Check: `docker ps | grep rendr-postgres`.

**PM2:** `pm2 list` to see status. Logs: `pm2 logs rendr-web`.

**Nginx:** Config at `/etc/nginx/sites-enabled/rendr`. Proxies port 80 → 3000. SSL handled by Cloudflare (Flexible mode — no cert on origin).

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | required | PostgreSQL connection |
| `NEXTAUTH_SECRET` | required | JWT signing (32+ chars) |
| `NEXTAUTH_URL` | `http://localhost:3000` | Base URL for callbacks |
| `API_RATE_LIMIT_PER_MINUTE` | `60` | Per-key rate limit |
| `STORAGE_LOCAL_DIR` | `/data` | PDF file storage path |
| `WEBHOOK_RETRY_ATTEMPTS` | `3` | Max webhook retries |
| `WEBHOOK_RETRY_DELAY_MS` | `1000` | Initial retry delay (exponential) |
| `PLAYWRIGHT_TIMEOUT_MS` | `30000` | Chromium page timeout |
