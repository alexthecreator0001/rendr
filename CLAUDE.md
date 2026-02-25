# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ CRITICAL WORKFLOW — READ FIRST

**All development is local. The VPS pulls from GitHub via `git pull`.**

- **NEVER run `npm install`, `npm run build`, `npm run dev`, or any server commands locally.**
- **NEVER SSH into the VPS to fix issues. Just send the user the exact command to paste.**
- After every change that is committed and pushed, provide the user a single copy-pasteable VPS deploy command.

**Standard VPS deploy command (after `git push`):**
```bash
cd /var/www/rendr && git pull && npm install && npx prisma migrate deploy && npm run build && pm2 restart rendr-web
```

**If only code changed (no new deps, no schema change):**
```bash
cd /var/www/rendr && git pull && npm run build && pm2 restart rendr-web
```

**If only dependencies changed:**
```bash
cd /var/www/rendr && git pull && npm install && npm run build && pm2 restart rendr-web
```

**Note:** Always use `npx prisma migrate deploy` (non-interactive, for production) — never `npm run db:migrate` (`migrate dev`) on the VPS, as it prompts for input and hangs.

---

## Commands (local dev only)

```bash
npm run dev          # dev server (Turbopack) — http://localhost:3000
npm run worker       # PDF worker process (separate terminal)
npx tsc --noEmit     # type-check without emitting
npm run lint         # ESLint
npm run db:seed      # seed demo@rendr.dev / demo1234 + API key
npm run db:generate  # regenerate Prisma client after schema changes
```

Local dev requires two terminals: `npm run dev` and `npm run worker`. The worker handles all Playwright rendering.

## Versioning, Changelog & Git Push Rules

**After every meaningful change:**

1. Bump `version` in `package.json` (semver: patch for fixes, minor for features, major for breaking changes)
2. Append an entry to `CHANGELOG.md`:

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

## Route Architecture

Four distinct route groups, each with its own layout:

| URL pattern | Route group | Layout shell |
|---|---|---|
| `/`, `/features`, `/pricing`, `/blog` | `app/(public)/` | `Navbar` + `Footer` |
| `/login`, `/register` | `app/(auth)/` | Centered auth layout |
| `/docs`, `/docs/**` | `app/docs/` | Top nav + `DocsSidebar` + `DocsToc` |
| `/app`, `/app/**` | `app/app/` | `AppSidebar` + `AppTopbar` |
| `/admin`, `/admin/**` | `app/admin/` | Admin layout with admin sidebar |

The outer `app/` is the Next.js App Router root; inner `app/app/` maps to the `/app` URL segment — intentional nesting.

## Backend Architecture

### Auth Flow (`auth.ts`, `middleware.ts`)
- **NextAuth v5** with Credentials provider + JWT strategy
- `auth()` in server components gives `session.user.id`
- `middleware.ts` protects `/app/**` — redirects unauthenticated to `/login?callbackUrl=...`
- Admin actions: always re-verify `user.role === "admin"` from DB, never trust JWT alone

### API Key Auth (`lib/require-api-key.ts`)
All `/api/v1/*` routes call `requireApiKey(req)` which extracts `Authorization: Bearer rk_live_...`, SHA-256 hashes it, looks up `ApiKey` by hash, checks `revokedAt`, updates `lastUsedAt` non-blocking. Returns `{ user, apiKey }`.

### PDF Job Queue
1. API route creates `Job` (status: `queued`) → enqueues `{ jobId }` to `"pdf-conversion"` pg-boss queue
2. **Sync** (`/convert`): polls DB every 500ms for up to 8s
3. **Async** (`/convert-async`): returns 202 immediately with `status_url`
4. Worker (`worker/index.ts`): polls pg-boss every 2s, batchSize 2 → `processJob(jobId)`
5. `processJob`: mark processing → launch Chromium → render → `page.pdf()` → `saveFile` → set `downloadToken` → deliver webhooks

`lib/queue.ts` exports a `globalThis`-scoped pg-boss singleton. Safe to import in API routes (send-only). Only worker calls `boss.work()`.

### Storage (`lib/storage.ts`)
PDFs saved to `$STORAGE_LOCAL_DIR/pdfs/{jobId}.pdf` (default `/data`). Served via `/api/v1/files/[token]` — no auth, token is the credential.

### Webhooks (`lib/webhook.ts`)
Fired after job success/failure. Payload signed with `X-Rendr-Signature: sha256=<hmac>`. Exponential backoff retry. Delivered via `Promise.allSettled`.

### Server Actions (`app/actions/`)
Pattern: `useActionState(action, initialState)` in client components. Actions live in `app/actions/` (user-facing) or `app/admin/_actions.ts` (admin). Always call `revalidatePath` after mutations.

### Stripe Billing (`lib/stripe.ts`, `app/api/stripe/`)
- `lib/stripe.ts` — Stripe client + `planFromPriceId(priceId)` helper mapping price IDs → plan names
- `POST /api/stripe/checkout` — creates Checkout Session (or Customer Portal redirect if already subscribed)
- `POST /api/stripe/portal` — opens Stripe Customer Portal
- `POST /api/stripe/webhook` — handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`. Always use raw body (`req.text()`) for signature verification.
- Plan names: `"starter"` (free) | `"growth"` ($49/mo) | `"business"` ($199/mo). Stored on `user.plan`.
- Billing client components (`app/app/billing/billing-actions.tsx`) are `"use client"` and POST to these routes, then redirect to `data.url`.

### Prisma Singleton (`lib/db.ts`)
`globalThis._prisma` pattern. Always import `prisma` from `lib/db.ts`.

### Schema Migrations
When changing `prisma/schema.prisma`:
1. Create `prisma/migrations/YYYYMMDDNNNNNN_description/migration.sql` manually
2. Write the raw SQL ALTER TABLE statements
3. Commit and push — VPS applies it via `npx prisma migrate deploy`
4. Run `npm run db:generate` locally after schema changes

## Per-Feature Init Files

Every significant feature has a co-located `_init.md`:
- `app/app/<feature>/_init.md` — page purpose, data sources, actions, component split
- `app/api/v1/<feature>/_init.md` — endpoint contract, auth, validation, side effects

Create `_init.md` before implementing a new page. Update it when modifying.

## Tech Stack Specifics

**Tailwind CSS v4** — CSS-first, no `tailwind.config.js`. All config in `app/globals.css` under `@theme inline { ... }`. New color token: add to both `:root`/`.dark` AND `@theme inline`.

**shadcn/ui** — Vendored in `components/ui/`. Edit files directly, never run `npx shadcn add`.

**Dark mode** — Site uses `forcedTheme="dark"` (always dark). All backgrounds are dark zinc. Use `dark:` variants where needed for edge cases (docs page uses `invert dark:invert-0` for logo).

**Logo files:**
- `public/logo.svg` — white fills, used everywhere (navbar, sidebar, footer, auth pages)
- `public/logo-dark.svg` — dark fills (#18181b), used only in `app/loading.tsx`

**`"use client"`** — Required on any component using hooks. Pages fetch data server-side, pass to client components for interactivity.

## Design System

OKLCH color tokens in `globals.css`. Primary accent = blue (`var(--primary)`).

Animation utilities: `.animate-fade-up`, `.animate-fade-in`, `.animate-float`, `.animate-float-slow`, `.animate-pulse-glow`, `.animate-spin-slow`, `.delay-{100–500}`. Also `.glass` and `.text-gradient`.

Dark sections (hero, CTA) use `bg-zinc-950` with blurred gradient orbs. Body uses `bg-background`.

Navbar: scroll-aware — transparent over dark hero on `/`, frosted glass (`bg-zinc-950/80 backdrop-blur-2xl`) on scroll or non-home routes.

## Deployment

**Server:** Vultr VPS `45.76.92.147`, domain `rendrpdf.com` (Cloudflare proxy, SSL Flexible)

**Postgres:** Docker container `rendr-postgres` on `127.0.0.1:5432`. Check: `docker ps | grep rendr-postgres`.

**PM2:** `pm2 list` — status. `pm2 logs rendr-web` — logs. Worker: `pm2 restart rendr-worker`.

**Nginx:** `/etc/nginx/sites-enabled/rendr`. Proxies port 80 → 3000.

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection (required) |
| `NEXTAUTH_SECRET` | JWT signing, 32+ chars (required) |
| `NEXTAUTH_URL` | Base URL for Stripe redirects + NextAuth callbacks |
| `RESEND_API_KEY` | Email delivery (verification, usage warnings) |
| `RESEND_FROM` | Sender address e.g. `Rendr <noreply@rendrpdf.com>` |
| `STRIPE_SECRET_KEY` | Stripe API key (`sk_live_...` or `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `STRIPE_GROWTH_PRICE_ID` | Legacy single Growth price ID (fallback) |
| `STRIPE_BUSINESS_PRICE_ID` | Legacy single Business price ID (fallback) |
| `STRIPE_GROWTH_MONTHLY_EUR_PRICE_ID` | Growth monthly EUR Stripe Price ID |
| `STRIPE_GROWTH_YEARLY_EUR_PRICE_ID` | Growth yearly EUR Stripe Price ID |
| `STRIPE_GROWTH_MONTHLY_USD_PRICE_ID` | Growth monthly USD Stripe Price ID |
| `STRIPE_GROWTH_YEARLY_USD_PRICE_ID` | Growth yearly USD Stripe Price ID |
| `STRIPE_BUSINESS_MONTHLY_EUR_PRICE_ID` | Business monthly EUR Stripe Price ID |
| `STRIPE_BUSINESS_YEARLY_EUR_PRICE_ID` | Business yearly EUR Stripe Price ID |
| `STRIPE_BUSINESS_MONTHLY_USD_PRICE_ID` | Business monthly USD Stripe Price ID |
| `STRIPE_BUSINESS_YEARLY_USD_PRICE_ID` | Business yearly USD Stripe Price ID |
| `API_RATE_LIMIT_PER_MINUTE` | Per-API-key rate limit (default 60) |
| `STORAGE_LOCAL_DIR` | PDF storage path (default `/data`) |
| `PLAYWRIGHT_TIMEOUT_MS` | Chromium render timeout (default 30000) |
| `WEBHOOK_RETRY_ATTEMPTS` | Webhook retry count (default 3) |
| `WEBHOOK_RETRY_DELAY_MS` | Initial retry delay ms (default 1000) |
