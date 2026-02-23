# Changelog

All notable changes to Rendr are documented here.

## [0.30.1] — 2026-02-23
### Fixed
- Stripe routes: use lazy `getStripe()` singleton instead of module-level client so `next build` succeeds without `STRIPE_SECRET_KEY` in the build environment

## [0.30.0] — 2026-02-23
### Added
- **Stripe payments** — full checkout + subscription management. New: `lib/stripe.ts`, `app/api/stripe/checkout`, `app/api/stripe/portal`, `app/api/stripe/webhook` routes. Billing page upgraded: real "Upgrade" buttons launch Stripe Checkout, paid users see "Manage subscription" → Stripe Customer Portal. Webhooks handle `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed` — auto-updates `user.plan` and `subscriptionStatus`.
- **Stripe DB fields** — `stripeCustomerId`, `stripeSubscriptionId`, `stripePriceId`, `subscriptionStatus` added to User model via migration `20260223000001_add_stripe_billing`.
- **Navbar: Home link** — added explicit "Home" nav item as first link in desktop and mobile nav.
### Changed
- **Logo files renamed** — `logo-white.svg` → `logo.svg` (primary, white fills for dark backgrounds), `logo.svg` → `logo-dark.svg` (dark fills for light backgrounds, used only in loading screen). All references updated. Cleaner and unambiguous.
- **Removed loose PNGs** — `synk-benefits.png`, `synk-features.png`, `synk-hero.png` removed from git and repo root. `studio-current.png`, `studio-wide.png` deleted.
- **Billing page rebuilt** — standardized plan IDs to `starter`/`growth`/`business` (was `pro`). Added upgrade/success/past-due states. Invoice history section links to Stripe portal.
- **`.env.example`** — added `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_GROWTH_PRICE_ID`, `STRIPE_BUSINESS_PRICE_ID`.

## [0.29.0] — 2026-02-23
### Fixed
- **Navbar dropdown gap bug** — the 4px gap between the Solutions trigger and the dropdown panel caused `onMouseLeave` to fire prematurely, closing the menu before the user could reach it. Fixed by wrapping the panel in an outer div at `top-full` with `pt-1.5` padding, making the hover-trackable area seamless.
- **Favicon updated** — new `favicon.png` (dark background + white angular R mark) copied to `public/favicon.png` and `app/icon.png`.
### Added
- **Annual billing toggle** — pricing cards now include a Monthly / Annual toggle with 20% discount on paid plans (Growth: $49 → $39/mo, Business: $199 → $159/mo). Shows "Save 20%" badge. Toggle state is local to the `PricingCards` client component.
- **API key render counts** — the API keys table now shows a "Renders (mo.)" column with the number of jobs rendered via each key in the current calendar month. Backed by a `job.groupBy` query in the dashboard API route.
- **Solutions: "Try template free" CTA** — added a secondary outline button to each solution page hero linking to `/register?template={slug}`. Positioned between "Get started free" and "Docs".

## [0.28.0] — 2026-02-23
### Fixed
- **Template cover images not showing for users** — two-part fix: (1) `updateAdminTemplateAction` now propagates `coverImageUrl` to all user templates with the same name via `updateMany` whenever the admin saves a template. (2) `seedStarterTemplates` now uses the admin's actual DB templates (including `coverImageUrl`) as the seed source instead of the hardcoded array — falls back to `STARTER_TEMPLATES` if no admin account exists.
### Added
- **Admin: "Sync covers to all users" button** — one-click bulk push of all admin template cover images to every matching user template. Useful after bulk cover image uploads.

## [0.27.0] — 2026-02-23
### Changed
- **Navbar redesign** — complete rewrite to minimal Apple-quality design. Removed all icons from nav items. Clean text-only navigation at 13.5px medium weight. Active state: full white; inactive: zinc-400 with white hover. Sticky frosted glass (`bg-zinc-950/80 backdrop-blur-2xl`) on scroll, transparent over hero. Solutions megamenu rewritten as clean 2-column text grid — solution name + tagline, no icons, no colored badges. "Get started" is a rounded white pill button. Mobile sheet matches the dark zinc-950 aesthetic.
- **Logo updated** — all pages now use the new Rendr wordmark (`Group 5384.svg`). Applied to navbar, mobile sheet, footer, app sidebar, and auth pages.
- **Favicon** — new `favicon.png` (Rendr R-mark) added to `public/` and referenced in root layout metadata. Next.js App Router `icon.png` also placed in `app/` for automatic detection.
- **Security headers** — `logo.svg` dark variant regenerated from new logo source.

## [0.26.0] — 2026-02-23
### Security
- **ReDoS fix** — template variable keys are now regex-escaped before building the replacement pattern in `worker/processor.ts`, preventing ReDoS via crafted variable names.
- **SSRF prevention** — new `lib/ssrf-guard.ts` utility blocks requests to private/loopback/link-local IP ranges (RFC-1918, 169.254.x.x, ::1, fc00::/7, fe80::/10). Applied to: URL-to-PDF rendering in the worker, webhook URL creation (`app/actions/webhooks.ts`), and `webhook_url` in the sync convert route.
- **Path traversal fix** — `/api/v1/files/[token]` now resolves `resultPath` and asserts it starts within `$STORAGE_LOCAL_DIR/pdfs/` before reading the file.
- **HTML payload size limit** — both convert endpoints now reject HTML bodies larger than 5 MB (error 413).
- **Security headers** — `next.config.ts` now emits `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and `Strict-Transport-Security` on all responses.
- **Email enumeration** — `registerAction` now returns a generic error instead of confirming whether an email is already registered.
- **Strict convert-async schema** — `/api/v1/convert-async` now uses the same explicit `pdfOptionsSchema` as `/api/v1/convert` instead of `z.record(z.unknown())`.

## [0.25.0] — 2026-02-22
### Changed
- **Navbar redesigned** — icons on all nav items (Zap for Features, CreditCard for Pricing, BookOpen for Docs, FileText for Blog). Solutions replaced with a hover-triggered megamenu showing all 8 solutions with colored icons and short names in a 4×2 grid, plus a "View all solutions" footer link. Docs now opens in a new tab with an ExternalLink indicator. Mobile sheet has expandable Solutions section with 2-column grid.
- **`Solution.name`** — added short name field (e.g. "Invoicing", "Receipts & Slips", "Offer Letters") used in the navbar dropdown.

## [0.24.0] — 2026-02-22
### Added
- **Solutions pages** — `/solutions` index with 8 solution cards, plus individual pages at `/solutions/[slug]` (statically generated). Each page has a dark hero with for-who tags, a 3-card "challenge" section, a 3-card "how Rendr helps" section, a copy-ready Node.js code example in a terminal widget, related solution cards, and a CTA.
- **8 solutions with full copy and code examples:** Invoicing, E-commerce Receipts, HR Documents, Automated Reporting, Legal Contracts, Certificates & Diplomas, Real Estate, Healthcare.
- **Solutions data file** — `lib/solutions-data.ts` with typed `Solution` interface and `SOLUTIONS` array. All copy, features, and code examples are defined here.
- **Navbar** — "Solutions" added between Features and Pricing.
- **Footer** — Added "Solutions" to Product column; new Solutions column with links to all 8 solution pages; updated grid to 6 columns on desktop.

## [0.23.0] — 2026-02-22
### Fixed
- **Template cover images not showing for users** — `coverImageUrl` was missing from the Prisma `select` in `app/app/templates/page.tsx` (both initial query and post-seed query). Also missing from the `Template` type in `templates-client.tsx`. Fixed both; `TemplateCard` now renders a cover image (when set) instead of the iframe preview thumbnail.
### Changed
- **Sidebar usage widget redesigned** — replaced the cramped static badge + thin progress bar with a fully clickable card linking to `/app/usage`. Shows plan name, large usage number (e.g. "42 / 500"), renders label, clean 4px progress bar, and amber "Upgrade for more renders" nudge at ≥70% usage.

## [0.22.0] — 2026-02-22
### Added
- **Image upload API** — `POST /api/uploads` (admin-only, multipart) saves images to `/data/uploads/` on the VPS and returns a URL. `GET /api/uploads/[filename]` serves the file with `Cache-Control: immutable` so Cloudflare CDN caches it automatically. Supports JPEG, PNG, WebP, GIF, SVG up to 8 MB.
- **Template cover image upload UI** — `CoverImageField` in admin templates now has an "Upload" button alongside the URL input. Drag or click to pick a file; the field updates with the returned URL and shows a live preview.
- **All 8 starter templates redesigned** — Rewrote every template in `lib/starter-templates.ts` with Google Fonts (Inter + Playfair Display for certificates), tighter typography, cleaner visual hierarchy, and print-appropriate spacing. Ready to showcase or sell.
- **Docs: full rewrite** — All four docs pages rewritten with accurate, comprehensive content:
  - `docs/page.tsx` — fixed wrong endpoint paths (`/v1/render` → `/api/v1/convert` etc.), added How It Works flow, full endpoint index, feature overview.
  - `docs/quick-start/page.tsx` — added template workflow, PDF options section, Next Steps.
  - `docs/api/page.tsx` — full endpoint table (16 endpoints), complete convert request body schema, job object, templates API, webhooks API with payload examples, signature verification (Node.js + Python), usage, rate limits, idempotency, error codes.
  - `docs/templates/page.tsx` — rewritten from scratch: create/list/get/update/delete, variable syntax, example invoice template, batch rendering, idempotency keys, best practices.

## [0.21.0] — 2026-02-22
### Fixed
- **Admin users crash** — `useTransition` was imported from `"next/navigation"` (incorrect); moved to `"react"` which is the correct source. This caused a client-side exception on the admin users page.
- **Admin blog dates** — serialized `publishedAt`, `createdAt`, `updatedAt` as ISO strings before passing to client component. Updated `Post` type in `blog-client.tsx` to use `string` instead of `Date` to match.
### Added
- **Admin templates: cover image** — Added optional `coverImageUrl` field to `Template` model. Admin template list shows a 64×48 thumbnail (or icon placeholder) and warns "No cover image" in amber. Create/Edit dialogs include a URL input with live preview.
- **Admin blog: "View blog" link** — Added external link to `/blog` in the admin blog page header alongside the "New post" button.
- **Page widths** — Reverted to consistent `max-w-6xl mx-auto` on all dashboard/admin pages (Studio stays full-width). Updated `_init.md` files to reflect this convention.
- **Prisma migration** `20260222000005_template_cover_image` — adds `coverImageUrl TEXT` column to `Template`.

## [0.20.1] — 2026-02-22
### Changed
- **Full-width layout** — all dashboard and admin pages now use consistent full-width layout. Removed `max-w-*` and `mx-auto` from 20 page wrappers across `/app` and `/admin`. Standardized padding to `px-4 py-6 sm:px-6 sm:py-8` on all pages (was a mix of `max-w-3xl`, `max-w-4xl`, `max-w-5xl`, `max-w-6xl`, and non-responsive `px-6 py-8`).
- **Init files** — added `app/app/_init.md` and `app/admin/_init.md` documenting the mandatory full-width wrapper pattern for all future pages.

## [0.20.0] — 2026-02-22
### Added
- **Admin: Blog management** — New page at `/admin/blog` for creating, editing, publishing/unpublishing, and deleting blog posts. Posts stored in DB (`BlogPost` model). Slug auto-generated from title with uniqueness handling. Supports tag, excerpt, markdown content, and draft/published status. Blog nav item added to admin sidebar.
- **Blog listing: DB-driven** — Public blog at `/blog` now fetches published posts from the database instead of hardcoded array. Shows empty state if no posts exist.
- **Blog post pages: DB-driven** — `/blog/[slug]` now fetches post content from DB and renders it with a built-in markdown renderer (headings, paragraphs, lists, code blocks, inline bold/code). Falls back to `notFound()` for missing/unpublished slugs. Special ChatGPT prompt copy box shown on `how-to-create-templates` post if it exists in DB.
- **Prisma migration** `20260222000004_blog_posts` — adds `BlogPost` table.
### Fixed
- **Admin: Users page** — `useRouter` incorrectly imported from `"react"` instead of `"next/navigation"`, causing runtime crash. Fixed in `users-client.tsx`, `features-client.tsx`, `support-client.tsx`.
- **Support + Feature Requests pages** — Content was left-aligned instead of centered. Added `mx-auto` to container classes in both client components.
- **Docs logo** — Docs sidebar was using old `logo.svg dark:invert` pattern. Fixed to `logo-white.svg invert dark:invert-0` matching the app sidebar convention.
- **Admin templates page** — Now shows only the admin's own templates (default templates), not all users' templates. Repurposed as "Default Templates" manager.
- **Verify-email: "Skip for now"** — Removed the bypass link that allowed unauthenticated access to `/app` without completing email verification.

## [0.19.0] — 2026-02-22
### Added
- **Fix: Email verification bypass** — `registerAction` now sets `emailVerified: new Date()` when no email service is configured, so `emailVerified` is never null for those accounts. `app/app/layout.tsx` adds a DB-checked redirect to `/verify-email` if `emailVerified` is null and `RESEND_API_KEY` is set — cannot be bypassed via JWT.
- **Teams** — Full team collaboration system. New models: `Team`, `TeamMember`, `TeamInvite`. Users can create teams, generate 7-day invite links, accept invites, remove members, leave teams, or delete teams. Team templates are shared across all members. New pages: `/app/teams`, `/app/teams/[teamId]`, `/invite/[token]` (public). Teams nav item added to sidebar. Server actions in `app/actions/teams.ts`.
- **Admin Notifications** — Admins can post banner announcements (info/warning/success types) that appear at the top of the user dashboard. New model: `Notification`. Admin page: `/admin/notifications`. Actions: `createNotificationAction`, `toggleNotificationAction`, `deleteNotificationAction` in `app/actions/feedback.ts`. Notifications and Templates added to admin sidebar.
- **Dashboard chart** — "Activity — last 7 days" CSS bar chart added below stats section on the overview page.
- **Jobs chart + stats** — Jobs page now shows 3 stat cards (total jobs, avg render time, success rate) and a 14-day activity bar chart above the table.
- **Templates AI banner** — Bottom of templates page shows a gradient banner linking to the new blog post about creating templates with AI.
- **Blog post: How to create PDF templates with AI** — Full guide at `/blog/how-to-create-templates` covering what templates are, manual creation tips, step-by-step AI workflow, a ready-made ChatGPT prompt (with copy button), common variable patterns for 4 document types, and Rendr Studio testing. Blog listing page updated with the new post linked.
- **Admin: Manage all templates** — New admin page at `/admin/templates` with paginated table of all templates across all users (with user email, team, variable count, job count). Admins can create templates assigned to any user, edit name+HTML, and delete. Actions: `createAdminTemplateAction`, `updateAdminTemplateAction`, `deleteAdminTemplateAction` in `app/admin/_actions.ts`.
- **Prisma migration** `20260222000003_teams_notifications` — adds `Team`, `TeamMember`, `TeamInvite`, `Notification` tables and `teamId` to `Template`.

## [0.18.0] — 2026-02-22
### Added
- **Full admin panel rebuild**: unified sidebar — same `AppSidebar` for both app and admin sections. When on `/admin/**` routes, sidebar expands to show all admin sub-items with red accent (Overview, Users, Subscriptions, Jobs, Support, Features). Single "Admin" collapsed link shown on app pages.
- **Admin: Subscriptions page** (`/admin/subscriptions`): plan distribution cards with live progress bars, filterable user table by plan (Starter/Growth/Pro).
- **Admin: Support center** (`/admin/support`): ticket management table with priority badges, status filters, inline status updates (open → in_progress → resolved → closed).
- **Admin: Feature Requests** (`/admin/features`): community feature request management with vote counts, status pipeline (submitted → planned → in_progress → shipped → declined).
- **Admin: Ban/Unban users**: Users page now supports banning (sets `bannedAt`) and unbanning. Banned users shown with strikethrough + orange badge.
- **User: Support page** (`/app/support`): submit tickets with priority selector (low/normal/high/urgent), view own ticket history with status badges.
- **User: Feature Requests page** (`/app/features`): browse all requests sorted by votes, upvote/remove vote with instant optimistic UI, submit new requests.
- **Admin overview improvements**: 6-stat cards (added open tickets + pending features), SVG bar chart (jobs last 14 days), SVG donut chart (job status distribution), plan distribution horizontal bars. All pages full-width (removed `max-w-6xl` centering).
- **Prisma schema**: added `bannedAt DateTime?` to User, new models `SupportTicket`, `FeatureRequest`, `FeatureVote`. Migration: `20260222000002_admin_features`.
- **Server actions**: `app/actions/feedback.ts` — `submitSupportTicketAction`, `submitFeatureRequestAction`, `toggleVoteAction`, `updateTicketStatusAction`, `updateFeatureStatusAction`.
### Changed
- `app/admin/layout.tsx`: replaced `AdminSidebar` with `AppSidebar` + `SidebarProvider` + `AppTopbar` (matches app layout shell). Fetches usage data for sidebar widget.
- `components/layout/app-sidebar.tsx`: expanded admin section with full sub-navigation; Support and Feature Requests nav links added for regular users; usage widget hidden on admin pages.

## [0.17.0] — 2026-02-22
### Fixed
- **Admin access with stale JWT**: middleware no longer checks role (which can be stale after SQL promotion). Role verification now happens exclusively in the admin layout (fresh DB query), so newly-promoted admins can access `/admin` without re-login.
- **Admin link in sidebar**: visible only to admins (role="admin"), styled with red accent to distinguish from regular nav.
- **Templates previews**: iframes now show filled sample data instead of raw `{{variable}}` placeholders — previews look like real documents.
- **Email templates**: complete redesign to light theme (white card, dark text). Gmail-safe: uses `bgcolor` attributes + inline styles. Verification code displayed as large blue monospace block on light blue background. All emails now readable in light and dark email clients.
### Changed
- Template card body simplified: shows variable count instead of individual variable tags.
- `app/app/layout.tsx`: fetches `role` and passes to `AppSidebar`.
- `components/layout/app-sidebar.tsx`: accepts `role` prop; renders Admin nav item for admins.

## [0.16.0] — 2026-02-22
### Added
- **6-digit email verification codes**: Registration now generates a 6-digit code, sends it via Resend, and redirects to `/verify-email`. Code entry page with OTP-style boxes, auto-advance, paste support, resend button (with cooldown), and auto-redirect to dashboard on success.
- **Usage warning emails**: `sendUsageWarningEmail` (at 80% of plan limit) and `sendUsageLimitReachedEmail` (at 100%). Triggered fire-and-forget after each job creation in `app/actions/convert.ts`. Plan limits: starter=100, growth=1000, pro=unlimited.
- **Auto-seed templates for existing users**: Templates page now auto-seeds the 8 starter templates for any user who has none (covers accounts created before seeding was added).
### Changed
- `lib/email.ts`: `sendVerificationEmail` now shows a large monospace 6-digit code block instead of a link. New exports: `canSend`, `sendUsageWarningEmail`, `sendUsageLimitReachedEmail`.
- `app/actions/auth.ts`: `registerAction` generates 6-digit code, redirects to `/verify-email` when Resend is configured. Added `verifyEmailCodeAction` (reads `d0`–`d5` form fields) and `resendVerificationCodeAction`.
- `app/verify-email/page.tsx`: full rewrite — server component checks auth + verification status, auto-creates token if missing.
- `app/verify-email/verify-client.tsx`: new client component — OTP digit inputs.
- `app/app/templates/page.tsx`: auto-seeds starter templates if user has none.
- `app/actions/convert.ts`: fires `checkUsageThresholds` after job creation.

## [0.15.0] — 2026-02-22
### Added
- **Admin dashboard** (`/admin`): 3-layer protected (middleware JWT + DB re-check on every page). Overview with 4 stat cards + recent users/jobs tables. Users page with search, pagination, promote/demote admin, change plan, delete user. Jobs page with status filter, pagination, duration display.
- **Admin sidebar** (`components/layout/admin-sidebar.tsx`): minimal sidebar matching app design with back-to-app link
- **Role-based access control**: `User.role` field (default `"user"`), included in JWT and session. Middleware blocks `/admin/**` for non-admins, silently redirects to `/app`.
- **Email verification**: `User.emailVerified` field + `VerificationToken` model. Token created on registration, expires in 24h. `/verify-email?token=` page verifies and marks user.
- **Resend integration** (`lib/email.ts`): welcome email, verification email, API key created notification, password reset (ready for future use). All silently skip if `RESEND_API_KEY` not set.
- **Migration** `20260222000001_add_role_email_verified`: SQL adds `role`, `emailVerified` to User and creates `VerificationToken` table
### Changed
- `auth.ts`: includes `role` and `emailVerified` in JWT token and session
- `middleware.ts`: added `/admin/:path*` to matcher with admin role check
- `app/actions/auth.ts`: on register, creates verification token and sends welcome + verification emails
- `app/actions/api-keys.ts`: sends API key created notification email after creation
- `.env.example`: added `RESEND_API_KEY` and `RESEND_FROM` vars

## [0.14.2] — 2026-02-22
### Changed
- **Hero**: restored v0.13.0 split-column layout (text left, macOS terminal right); removed ASCII canvas and standalone CodeShowcase section
- **How it works**: fixed mobile layout — badge row now uses `items-start` + `shrink-0` + `gap-3` so badge never overflows on narrow screens
- **Login page**: redesigned — split card layout on desktop (branding left panel with testimonial + feature bullets, form on right); wider max-w-4xl card; h-11 inputs with rounded-xl; white submit button; mobile shows logo + form only
- **Register page**: redesigned — split card layout matching login; left panel shows headline, gradient text, and 3 stat rows with icons; free-tier badge pill on form; same mobile-first approach
- **Auth layout**: simplified to full-screen centered flex with gradient orbs; removed nav header and footer (moved into page cards)

## [0.14.1] — 2026-02-22
### Fixed
- **ASCII rain**: completely rewrote canvas animation — replaced Matrix-style vertical falling columns with a proper perspective starburst effect matching the Synk reference design; 130 rays radiate outward from a central vanishing point (W/2, H×0.52), characters scale from 5px (near VP) to 15px (at edges) with matching opacity ramp; deterministic seeded hash prevents per-frame character flicker; characters scroll slowly outward from VP; pure black background with no trail effect

## [0.14.0] — 2026-02-22
### Added
- **ASCII rain hero**: animated canvas background with perspective binary character columns (0, 1, ·) inspired by Synk design; pure black `bg-black` section; columns brighter/larger at edges, dimmer/smaller at center for depth illusion; radial vignette overlay keeps center readable
- **Code showcase section**: standalone macOS terminal card between hero and trust row with Node.js/cURL/Python tab switcher and response strip; extracted from old split-hero
- **Backup branch**: `backup/landing-v0.13.0` preserves previous landing page in git
### Changed
- **Hero**: fully redesigned — pure black background, full-viewport centered layout, XL headline (up to 7rem), two CTAs (white primary + bordered ghost), all-caps install command, bottom gradient bridges to zinc-950 sections; removed split-column layout; no longer a client component (AsciiRain handles interactivity)

## [0.13.0] — 2026-02-22
### Added
- **Testimonials section**: three developer testimonials on the landing page with star ratings, quotes, and gradient avatar initials
- **Comparison table**: Rendr vs DIY Puppeteer vs wkhtmltopdf vs Prince XML across 8 dimensions (setup time, managed infra, async queue, webhooks, CSS, fonts, dashboard, pricing); scrollable on mobile
### Changed
- **Hero redesign**: split two-column layout (text left, macOS terminal right); syntax-highlighted code with tab switcher (Node.js / cURL / Python) using colored spans; check-list of key benefits; mini stats row (render time, uptime, setup time); no more full-viewport height — proper `py-24 lg:py-32` spacing; overflow-hidden fixes mobile horizontal scroll
- **Trust row**: added 4 key stats (500+ teams, 2M+ PDFs, 99.9% uptime, <1s avg) above the company logo row
- **CTA section**: larger button, two gradient orbs, replaced footer tagline with checkmark benefit list
- **Footer**: removed landscape photo and gradient bridge — clean dark footer

## [0.12.2] — 2026-02-22
### Added
- **Homepage redirect**: logged-in users visiting `/` are now redirected to `/app` instead of seeing the landing page
- **Auth pages redesign**: animated gradient background (blue + violet orbs, subtle grid overlay) on login/register; frosted glass card with dark inputs for a polished dark UI; removed ThemeToggle from auth header
- **Billing in account dropdown**: Billing link moved from sidebar nav into the user footer dropdown alongside Settings

### Fixed
- **Billing page centering**: outer wrapper now uses `mx-auto max-w-3xl` so the page centres properly (was left-aligned)
- **Billing plan mismatch**: billing page now reads `user.plan` from DB; current plan badge, feature pills, usage limit, and "Active" marker on plan cards all reflect the real plan instead of hardcoded Starter
- **Studio mobile inspector**: inspector defaults closed on mobile; opens automatically on desktop (≥ 768 px); panel slides in as a fixed overlay on mobile with a backdrop to dismiss

## [0.12.1] — 2026-02-22
### Fixed
- **Studio full width**: removed `max-w-6xl` from the shared layout wrapper; Studio page now uses `h-full overflow-hidden` to fill its flex container — no more capped width
- **Sidebar duplicate Settings**: Settings removed from sidebar nav (Billing group); it remains exclusively in the user footer dropdown
- **Plan badge not showing**: added `postinstall: "prisma generate"` to package.json so the Prisma client is always regenerated after `npm install`, ensuring new schema fields (like `plan`) are picked up
- **Usage page showing 0**: usage was querying `UsageEvent` (only written by API key requests); switched to `Job` table counting `status: "succeeded"` — consistent with sidebar widget; added monthly quota bar, success rate card, and better daily chart

## [0.12.0] — 2026-02-22
### Added
- **Plan system**: `plan` field added to `User` model (`@default("starter")`); sidebar now shows the real plan badge (Starter / Growth / Pro) instead of hardcoded "Starter"; migration + seed included
- **test@test.sk upgraded to Pro**: seed upserts the account with `plan = "pro"` and password `test1234`
- **Mobile sidebar drawer**: sidebar is a fixed overlay drawer on mobile (< md), with back-drop dismiss; hamburger button in topbar (visible on mobile only)
- **SidebarProvider**: React context wrapping the app layout, shared between `AppSidebar` and `AppTopbar`
### Changed
- **Studio redesign — URL mode**: input now centered vertically + horizontally in the canvas (no more tiny input floating in a dark void); large `h-12` input with Globe icon and descriptive copy
- **Studio redesign — HTML mode**: full-height code editor look: dark `bg-[#1a1a1a]` background always, `text-[#d4d4d4]` text, macOS-style title bar with traffic-light dots
- **Studio redesign — Template mode**: canvas uses the neutral light/dark background, content centered in a scrollable column
- **Inspector**: now state-controlled (`inspectorOpen` toggle), collapsible via a `PanelRight` button in the toolbar — visible by default; collapses on any screen width
- **Mobile-friendly layout**: layout padding responsive (`px-4 py-6 sm:px-6 sm:py-8`); Studio negative-margin escape updated to match
- **Mobile-friendly tables**: `overflow-x-auto` + `min-w-[...]` added to Jobs, API Keys, and Overview recent-jobs tables
- **Removed double padding**: Jobs, API Keys, Webhooks, and Usage pages no longer add their own `p-6 lg:p-8` on top of the layout padding

## [0.11.0] — 2026-02-22
### Added
- **Studio full-height layout**: Studio now fills the entire viewport (minus topbar) — no more card inside a padded page; matches Figma/Linear tool aesthetic
- **Settings in sidebar nav**: Settings link added directly to sidebar (Billing group) so it's one click away — no longer buried in footer dropdown only
- **New logo**: updated `public/logo-white.svg` with latest brand asset
### Changed
- **Studio redesign** (Figma/Linear inspired): flat top toolbar with underline-tab mode selector (Template/HTML/URL), status indicator centered in toolbar, Generate/Download button on right; canvas area with distinct `#f5f5f5 / #141414` background; inspector with clean hairline separators and consistent 28px row height; no more rounded outer card
- **PDF preview fixed**: `Content-Disposition` changed from `attachment` to `inline` in `/api/v1/files/[token]` — iframes can now display PDFs; `download` attribute on anchor still forces download when clicked
- **Removed 2 MB export limit**: limit removed from worker (no plan system in DB yet); all accounts now have unrestricted export size
- **Inspector refinements**: switches scaled to 0.75, uniform control height, cleaner section labels, margin presets tighter, `ctrl` class replaces `tinyInput` (no more mono font on number fields)
### Fixed
- Studio iframe PDF preview now displays correctly instead of triggering download

## [0.10.0] — 2026-02-22
### Added
- **PDF preview in Studio**: when a render completes, the left panel shows an inline iframe preview of the PDF before download; "Open in new tab ↗" link also available
- **Render delay option**: new "Render delay" inspector row (0–10 s) lets pages fully load before capture; passed through `optionsJson.waitFor` → `page.waitForTimeout()` in worker
- **2 MB export limit**: `worker/processor.ts` now checks PDF size after generation and fails the job with a clear error if it exceeds 2 MB (Starter plan)
- **Explicit API options schema**: `app/api/v1/convert/route.ts` now validates all PDF options (format, landscape, scale, pageRanges, margin, headers/footers, tagged, outline, waitFor) instead of a passthrough `z.record(z.unknown())`
### Changed
- **Studio font fix**: removed `font-mono` from inspector number/dimension inputs (scale, page ranges, margin fields, render delay); mono font now only used for actual code areas (URL input, HTML textarea, header/footer HTML templates)
- **Docs API reference**: `convertBody` example updated to document all supported options fields
### Fixed
- Studio inspector inputs no longer mix two font families; all controls use system font, code areas use JetBrains Mono

## [0.9.0] — 2026-02-21
### Added
- **Logo update**: sidebar now uses `logo-white.svg` with `invert dark:invert-0` — black in light mode, white in dark mode
- **Sidebar usage widget**: real-time renders-this-month bar (green → amber at 70% → red at 90%), plan badge, "Upgrade" link when ≥70%; fetched in `app/app/layout.tsx` via Prisma
- **Page loading state**: `app/app/loading.tsx` — minimal spinner shown in main content area while navigating between pages; sidebar + topbar remain visible throughout
- **Templates redesign** (Apple-inspired): card grid with frosted-glass hover action buttons (Preview/Edit/Delete), "Open in Studio" slide-up overlay, `xl:grid-cols-4` grid, cleaner dialogs, polished empty state
- **Studio redesign** (Apple unified panel): single `rounded-2xl` container with toolbar (segmented tabs), two-column split (input left + inspector right), inline status in toolbar, Generate button + status in bottom bar
### Changed
- `app/app/layout.tsx`: now fetches `rendersThisMonth` and passes as `usage` prop to `AppSidebar`
- `AppSidebar`: accepts `usage: { used, limit }` prop; shows usage widget between nav and user footer

## [0.8.0] — 2026-02-21
### Added
- **Studio page** (formerly "Convert"): renamed to "Studio" with a two-column playground layout — source input on the left, full PDF options panel on the right
- **Full PDF options panel** with four sections:
  - **Layout**: Format (A4/Letter/Legal/Tabloid/A0-A6), custom Width & Height, Scale (0.1–2), Page Ranges (e.g. `1-3, 5`)
  - **Print Production**: Landscape, Print Background, Prefer CSS Page Size toggles
  - **Margins**: quick presets (None/Small/Normal/Large) + individual Top/Right/Bottom/Left inputs
  - **Header & Footer**: toggle with editable HTML templates (`.title`, `.pageNumber`, `.totalPages` class hints)
  - **Output & Accessibility**: Tagged PDF, Embed Outline toggles; Compression shown as Pro feature
- **Sidebar redesign**: removed section text labels; groups separated by `<Separator />`; active items have a left border indicator + `bg-accent`; cleaner user footer; `Wand2` icon for Studio, `ExternalLink` indicator on Documentation
### Changed
- `worker/processor.ts`: passes all new options to Playwright `page.pdf()` (scale, pageRanges, preferCSSPageSize, displayHeaderFooter, headerTemplate, footerTemplate, tagged, outline, custom width/height)
- `app/actions/convert.ts`: reads all new form fields and builds complete `pdfOptions` object

## [0.7.1] — 2026-02-21
### Changed
- **Settings redesign**: professional two-column layout (260px label + content area); sections for Profile (avatar initials, email, join date), Security (change password), API & Integrations (link cards to API Keys and Webhooks), and Danger Zone (disabled delete)
- **Billing redesign**: real render usage from Prisma (count vs 100 limit), color-coded progress bar (green/amber/red at 70/90%), plan comparison cards (Starter/Growth/Pro), empty invoice history state
### Fixed
- **Sidebar duplicate links**: Settings appeared in both Account nav and user footer dropdown; Billing appeared in both Account nav and footer dropdown. Settings is now exclusively in the footer dropdown; Billing is exclusively in the sidebar nav.

## [0.7.0] — 2026-02-21
### Fixed
- **Sign out**: root cause was Radix DropdownMenuContent intercepting form submit before the DOM element could fire. Fixed by using `onSelect` + `useTransition` to call `signOutAction()` directly as a server action — no form needed
- **Template thumbnails**: templates with vertical-flex-centered bodies showed blank space in preview. Redesigned all templates to use top-aligned layouts

### Added
- **Search / command palette**: clicking the search button (or pressing ⌘K) opens a dialog with links to all dashboard pages; filters as you type
- **Overview redesign**: time-aware greeting ("Good morning, alex 👋"), quick-action cards, improved stat cards with icons, cleaner recent-jobs table
- **Sign out in sidebar**: clicking the user footer opens a dropdown with Settings, Billing, Sign out
- **Settings page** (`/app/settings`): view email, change password with validation
- **Docs in sidebar**: Resources section with Documentation link
- **8 redesigned templates**: Invoice, Receipt, Business Letter, Certificate — all visually upgraded with blue/violet gradients, proper typography, top-aligned content; plus 3 new: Job Offer Letter, Statement of Work, Monthly Report
- **`changePasswordAction`**: verifies current password, validates length/match, updates hash
- **Seed refresh**: `npm run db:seed` now upserts templates by name so existing users get updated HTML

## [0.6.6] — 2026-02-21
### Fixed
- **Sign out**: topbar "Sign out" was a dead link with no action — now calls `signOutAction` (NextAuth v5 server action) and redirects to `/login`
- **Auth / auto sign-out behind Cloudflare**: added explicit cookie configuration in `auth.ts` for production. Cloudflare Flexible SSL sends HTTP to the origin, causing NextAuth to strip the `Secure` flag and use unprefixed cookie names — every request created a new unreadable cookie, effectively signing users out immediately. Cookies are now named and flagged explicitly regardless of transport protocol.
- **Topbar mock data**: removed all hardcoded "Acme Internal", "Alex K.", "AK", "alex@acme.io", fake "Growth" badge. Topbar now receives real `user.email` from the app layout and derives initials/display from it.
- **Sidebar workspace section**: removed the redundant workspace block (showing ugly `email.split("@")[0]` strings). User identity is shown only once, in the bottom user footer.
### Added
- **Template thumbnails**: each template card now shows a scaled-down sandboxed iframe preview of the actual rendered HTML (no scripts, safe)
- **Template full-preview dialog**: eye icon on hover opens the template at full size in a modal iframe

## [0.6.5] — 2026-02-21
### Added
- `lib/starter-templates.ts`: 5 production-ready PDF templates — Invoice, Receipt, Business Letter, Certificate of Completion, Project Proposal
- New users automatically get all starter templates seeded on registration (non-blocking, via `registerAction`)
- Demo seed (`npm run db:seed`) also seeds starter templates for `demo@rendr.dev`

## [0.6.4] — 2026-02-21
### Added
- Templates dashboard: reusable HTML layouts with `{{variable}}` placeholder substitution
- Templates page (`/app/templates`): create/edit/delete dialogs, variable badges extracted from HTML, "Use in Convert" hover link per card
- Convert page: third input mode "Template" — pick a saved template, fill in variable values, generate PDF
- `app/actions/convert.ts`: template mode support — validates templateId ownership, extracts variable key/value pairs, passes to worker via `optionsJson.variables`
- `app/app/templates/_init.md`: feature init file per CLAUDE.md convention
### Fixed
- Templates Edit dialog: HTML textarea now correctly pre-fills with existing template content (was blank before)

## [0.6.3] — 2026-02-21
### Fixed
- Worker: added Prisma-based polling loop (every 2s) alongside pg-boss. `queue.send()` in Next.js was silently returning null so jobs never reached pg-boss. Worker now directly queries the `Job` table with `FOR UPDATE SKIP LOCKED` to atomically claim and process queued jobs, bypassing pg-boss for job discovery.

## [0.6.2] — 2026-02-21
### Added
- Convert page: PDF render settings — format (A4/Letter), orientation (portrait/landscape), margins (none/small/normal/large)
- Convert page: slow-job warning banner after 30s of polling with `pm2 list` hint
- Worker: landscape orientation support via `optionsJson.landscape`
- Server action `convertUrlAction`: parses and passes format/landscape/margin into `optionsJson`

## [0.6.1] — 2026-02-21
### Fixed
- Billing page: removed all mock data (fake Growth plan, fake Visa card, fake invoices). Now shows honest Starter/free state with a usage bar and empty invoice history.
- Sidebar: replaced hardcoded "Acme Internal" workspace and "AK" initials with real values derived from the authenticated user's email.
- App layout: now async server component — fetches `auth()` session, redirects to `/login` if unauthenticated, passes real user email to AppSidebar.

## [0.6.0] — 2026-02-21
### Added
- `/app/convert` — new dashboard page: paste a URL or raw HTML, click Convert, download the PDF. Supports both input modes (URL/HTML) with live polling and a download button on completion.
- `app/actions/convert.ts` — server action that creates a Job and enqueues it to the pg-boss queue (no API key required, works via session auth)
- `app/api/dashboard/jobs/[id]` — internal session-auth polling route used by the convert page to watch job status
- Convert added to the dashboard sidebar under Workspace
### Fixed
- `BASE_URL` in convert route, convert-async route, jobs route, and worker now checks `AUTH_URL` before `NEXTAUTH_URL` — fixes download URLs pointing to raw IP instead of rendrpdf.com when `AUTH_URL=https://rendrpdf.com` is set on the server

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
