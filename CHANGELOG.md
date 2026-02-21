# Changelog

All notable changes to Rendr are documented here.

## [0.5.2] — 2026-02-21
### Fixed
- `auth.ts`: added `trustHost: true` — required for NextAuth v5 behind nginx/Cloudflare; without it, the callback URL host check fails and throws "server configuration" error
- `auth.ts`: added explicit `secret` fallback — NextAuth v5 reads `AUTH_SECRET` but server may only have `NEXTAUTH_SECRET` set; now supports both

## [0.5.1] — 2026-02-21
### Fixed
- `loginAction`: replaced `redirect: false` + manual `redirect("/app")` with `redirectTo: "/app"` — the correct NextAuth v5 server-action API. Previously the manual redirect was unreachable and users landed on the wrong page after login.
- `registerAction`: removed the `catch {}` block that was swallowing the internal NEXT_REDIRECT thrown by NextAuth on successful sign-in, causing every new registration to redirect to `/login` instead of `/app`.

## [0.5.0] — 2026-02-21
### Changed
- Complete homepage redesign inspired by sent.dm: code-first, image-free, dark throughout
- Hero: centered layout, language-tabbed code block (Node.js / cURL / Python / PHP), install command pill
- Trust row: text-only company names replacing image placeholders
- Features grid: each card now contains embedded code/data demos (job JSON, webhook payload, template list, signed URL, font list, analytics stats)
- How it works: cleaner 3-step grid with status badges per step
- CTA: modernized, stripped back
### Added
- Pain points section: 4-card grid calling out the problems with DIY PDF stacks
- Job lifecycle section: 4-state visual timeline (queued → processing → rendered → delivered) with evolving JSON
- FAQ section: accordion with 8 common questions (shadcn Accordion)
- Pricing section now integrated into homepage flow

## [0.4.1] — 2026-02-21
### Changed
- Redesigned hero right side: replaced overflowing floating cards with a clean pipeline visualization (request card → processing indicator → PDF output card)
- Fixed hero vertical centering: removed asymmetric padding, content now properly centers in the viewport

## [0.4.0] — 2026-02-21
### Changed
- Redesigned footer: dark zinc-950 content section with gradient bridge into a full-width landscape photo (no cropping, natural aspect ratio)
- Removed light mode — site is now dark-only (`forcedTheme="dark"`)
- Removed ThemeToggle from navbar

## [0.3.0] — 2026-02-21
### Changed
- Redesigned hero section: split layout (text left, product visual right) featuring a live syntax-highlighted API request card and floating PDF output card with rendered-in timing badge
- Added Syne display font for hero headline and JetBrains Mono for code blocks — registered as `font-heading` and `font-mono` Tailwind utilities
- Refined navbar: active link now shows a thin underline indicator instead of background highlight; tightened opacity values and button hover states for dark-hero context

## [0.2.0] — 2026-02-21
### Added
- Full backend: PostgreSQL + Prisma schema (User, ApiKey, Job, Template, Webhook, UsageEvent)
- NextAuth v5 Credentials provider with JWT sessions
- API key generation (SHA-256 hashed, `rk_live_` prefix, shown once)
- REST API v1: `/convert`, `/convert-async`, `/jobs/[id]`, `/templates`, `/webhooks`, `/usage`, `/files/[token]`, `/health`
- pg-boss job queue for async PDF rendering
- Playwright Chromium worker process (`npm run worker`)
- Local disk PDF storage under `$STORAGE_LOCAL_DIR/pdfs/`
- In-memory rate limiter (60 req/min per API key)
- HMAC-SHA256 signed webhook delivery with exponential backoff
- Idempotency key support on convert endpoints
- Dashboard server actions: auth, api-keys, templates, webhooks
- Real data in dashboard pages (jobs, api-keys, templates, webhooks, usage)
- Usage analytics with 30-day daily bar chart
- Docker Compose for local dev and production
- Nginx reverse proxy config
- PM2 process management
- Deployed to Vultr VPS at rendrpdf.com

### Changed
- Replaced `argon2` with `bcryptjs` for password hashing (webpack compatibility)
- `next.config.ts`: added `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`

## [0.1.0] — 2026-02-20
### Added
- Initial UI scaffold: marketing pages, dashboard, docs
- Tailwind CSS v4 design system with OKLCH tokens
- shadcn/ui components (new-york style, zinc base)
- Dark mode via next-themes
- Mock data for all dashboard pages
- Route groups: (public), (auth), docs, app
- ImagePlaceholder component
- Navbar, Footer, AppSidebar, AppTopbar, DocsSidebar, DocsToc
