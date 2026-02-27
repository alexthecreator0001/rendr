# Changelog

All notable changes to Rendr are documented here.

## [0.53.2] — 2026-02-27
### Added
- Google Analytics 4 (G-W4087CZ887) alongside existing Google Ads tracking
- **Google Consent Mode v2** — fully compliant implementation:
  - Consent defaults to `denied` for all 4 signals (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`)
  - gtag.js always loads (enables cookieless pings & conversion modeling)
  - Consent updated to `granted` only after user accepts
  - No more page reload on accept/decline
- CSP updated to allow `analytics.google.com`

## [0.53.0] — 2026-02-27
### Added
- **Case studies page** (`/case-studies`): 6 real-world case studies — price quotations from Lovable, e-commerce order confirmations, SaaS analytics reports, real estate brochures, legal contract generation, investor updates
- **Case study detail pages** (`/case-studies/[slug]`): full writeup with challenge, solution, how-it-works steps, results, tech stack, and quotes
- Case studies linked in Solutions dropdown (desktop + mobile), footer, and solutions listing page

## [0.52.3] — 2026-02-27
### Fixed
- **User-facing error messages**: raw Playwright errors no longer shown to users — replaced with friendly explanations and hints (bot protection, invalid URL, timeouts, file downloads, DNS errors, etc.)
- **Slow render warning**: replaced internal "Worker may be offline — check pm2 list" with user-friendly "Taking longer than usual" message

## [0.52.2] — 2026-02-27
### Fixed
- **Google Ads conversions blocked by CSP**: Content-Security-Policy was missing Google Ads domains (`googleadservices.com`, `googleads.g.doubleclick.net`, `google.com`) in `connect-src`, `script-src`, and `img-src` — conversion pings were silently dropped by the browser

## [0.52.1] — 2026-02-27
### Fixed
- **URL render timeouts**: use `load` + graceful `networkidle` fallback instead of blocking on `networkidle` alone — sites with persistent analytics/ads/websockets no longer cause 30s timeouts
- **Direct file URL errors**: reject `.pdf`, `.zip`, `.docx`, etc. URLs upfront with a clear error message instead of crashing with "Download is starting"

## [0.52.0] — 2026-02-27
### Changed
- **Cookie banner redesigned**: full-screen overlay that forces accept/decline before using the site, page refreshes after consent so gtag loads immediately
- **Admin jobs page overhauled**: expandable rows showing full error logs, error codes, input content (HTML/URL/template data), PDF options, template name, download token, result URL — everything you need to debug a failed job

## [0.51.5] — 2026-02-27
### Fixed
- **Google Ads conversions not counting**: `trackConversion()` silently failed when gtag hadn't loaded yet (no cookie consent or script still loading). Now queues the conversion in sessionStorage and flushes it once gtag initializes.

## [0.51.4] — 2026-02-26
### Fixed
- **Template data leak**: seed function was copying ALL admin templates (including personal/custom ones) to every user — removed admin template override, now always uses hardcoded STARTER_TEMPLATES (20 templates)
- Existing users now get all 20 starter templates on next visit (previously only got admin's 8)

## [0.51.3] — 2026-02-26
### Fixed
- **Critical**: login/registration still broken — removed `passwordChangedAt` from authorize() SELECT (crashes if migration not applied), moved to separate try-catch DB read in JWT callback so auth never crashes regardless of DB state

## [0.51.2] — 2026-02-26
### Fixed
- **Critical**: fixed login/registration completely broken — `passwordChangedAt` Date was serialized to string by NextAuth, causing `.getTime()` to throw and destroy all sessions

## [0.51.1] — 2026-02-26
### Fixed
- Existing users now automatically receive new starter templates on their next visit to the Templates page (previously only seeded for brand-new users with zero templates)

## [0.51.0] — 2026-02-26
### Fixed
- **Template visibility bug**: added `force-dynamic` to all `/app` pages and layout — prevents Next.js from caching user-specific data across users
- **Session invalidation on password change/reset**: added `passwordChangedAt` column; JWT callback checks it every 5 minutes and invalidates stale sessions
- **Banned user enforcement**: JWT validation now detects mid-session bans and invalidates the session
- **TypeScript fixes**: resolved duplicate property names in template SAMPLE, fixed cookie-banner cast, fixed SSRF guard DNS type

### Changed
- All 17 server-rendered `/app` pages now export `dynamic = "force-dynamic"` for guaranteed per-request rendering

## [0.50.1] — 2026-02-26
### Fixed
- **CSP hardened**: removed `unsafe-eval`, whitelisted `googletagmanager.com` explicitly
- **SSRF guard** added to `convertUrlAction` (UI URL submissions were missing the check API routes had)
- **SSRF guard** added to `POST /api/v1/webhooks` (webhook creation via API was missing the check)
- **CSRF protection** added to Stripe cancel/resume routes; fixed origin check logic across all Stripe routes (was using fragile `startsWith`, now uses strict equality)
- **Password reset tokens** now SHA-256 hashed before storage (raw token emailed, only hash in DB)
- **Webhook signing** uses a derived key instead of `NEXTAUTH_SECRET` directly (prevents JWT secret leakage via webhook signatures)

## [0.50.0] — 2026-02-26
### Added
- 6 more starter templates: Resume/CV, Pay Stub, Boarding Pass, Quote/Estimate, Warranty Card, Donation Receipt (20 total)

## [0.49.0] — 2026-02-26
### Added
- 6 new starter templates: Shipping Label, Event Ticket, Non-Disclosure Agreement, Packing Slip, Meeting Minutes, Gift Card (14 total)
- Sample preview data for all new templates

## [0.48.2] — 2026-02-25
### Added
- GDPR cookie consent banner — Accept/Decline with 1-year cookie persistence
- Google Ads gtag now only loads after user accepts cookies (was unconditional)

## [0.48.1] — 2026-02-25
### Added
- Google Ads conversion tracking tag (AW-17977237081) via `next/script`

## [0.48.0] — 2026-02-25
### Added
- **PDF compression**: Select dropdown (Off/Low/Medium/High) replaces decorative toggle in Studio — Low uses pdf-lib object streams (5-15% reduction), Medium/High also reduce image quality (75%/50% JPEG) before capture. Growth+ plans only.
- **Watermark customization**: collapsible settings panel (color, opacity, font size, rotation) appears when watermark text is entered. Growth+ plans only; text input remains available on all plans.
- `compression` field added to Zod schema — API consumers can now pass `compression: "low" | "medium" | "high"` in options

### Changed
- Worker `processor.ts`: pdf-lib save now uses `useObjectStreams` when compression is enabled; image quality reduction runs via `page.evaluate` before PDF capture
- Server action `convert.ts`: parses 5 new form fields (compression, watermarkColor, watermarkOpacity, watermarkFontSize, watermarkRotation) with plan gating

## [0.47.2] — 2026-02-25
### Fixed
- Replaced fake testimonial ("James D., Acme Corp") on login page with real product messaging
- Changed register name placeholder from "Joe" to "Your name"

## [0.47.1] — 2026-02-25
### Fixed
- Admin panel used plan name `"pro"` instead of `"business"` — plans set via admin didn't match the system's plan names, causing wrong render limits and feature gates

## [0.47.0] — 2026-02-25
### Fixed
- PDF preview in Studio now works — changed `X-Frame-Options` from `DENY` to `SAMEORIGIN` and added `'self'` to CSP `frame-src`
- Compression toggle in Studio now enabled for Growth and Business plans (was hardcoded disabled for all)
- Plan detection in Stripe webhook: `planFromPriceId()` now also checks legacy `STRIPE_GROWTH_PRICE_ID` / `STRIPE_BUSINESS_PRICE_ID` env vars as fallback
- Updated CLAUDE.md with all multi-currency Stripe price env vars

## [0.46.0] — 2026-02-25
### Changed
- Removed light theme entirely — site is dark-only again (`forcedTheme="dark"`)
- Removed theme toggle (sun/moon) from navbar on all pages
- Removed `useTheme` and theme-detection logic from spiral background

## [0.45.0] — 2026-02-25
### Changed
- **Complete light theme overhaul**: EVERY element on the landing page now responds to theme toggle — no forced dark sections anywhere
- Hero section: uses `bg-background`, `text-foreground`, gradient fades use `from-background`
- Spiral background: renders in black on light theme, white on dark theme (reads `resolvedTheme`)
- Navbar: fully theme-aware using `dark:` variants and semantic tokens, removed `isDark` boolean logic, logo swaps via `dark:hidden`/`dark:block`
- All feature demo blocks: use `bg-muted/50`, `border-border`, `text-foreground` instead of forced dark
- Code block in "How it works": uses `bg-muted/30`, `text-muted-foreground` instead of forced dark
- Job lifecycle field blocks: use `bg-muted/50` instead of forced dark
- CTA buttons: `bg-zinc-900 dark:bg-white` pattern for proper contrast in both themes
- Footer: kept dark with explicit `dark` class + `colorScheme: "dark"` (standard pattern)
- Highlighted pricing card: uses `bg-zinc-900 dark:bg-zinc-950` instead of forced `dark` class
- Mobile menu: uses `bg-background` and semantic tokens throughout

## [0.44.0] — 2026-02-25
### Changed
- **Full light theme for entire landing page**: converted all marketing sections from hardcoded dark styles to semantic tokens (bg-background, text-foreground, border-border, etc.)
- Sections converted: Pain Points, Features Grid, How It Works, Job Lifecycle, Testimonials, Comparison Table, FAQ, CTA, Pricing wrapper
- Code blocks and mini demos inside feature cards stay dark for readability
- Footer stays dark (common pattern) with explicit `dark` class
- Highlighted pricing card (Growth) stays dark with explicit `dark` class
- Removed "Trusted by engineering teams at" (TrustRow) section from landing page

## [0.43.2] — 2026-02-25
### Added
- Theme toggle (sun/moon) in the landing page navbar header — visible on both desktop and mobile

## [0.43.1] — 2026-02-25
### Changed
- **"How it works" section redesign**: replaced 3-card grid with clean vertical timeline + live code example (cURL request + JSON response), works well on mobile too
- **Features grid redesign**: rethought all features to match actual Rendr capabilities — now 9 cards in a clean 3×3 grid: HTML/URL to PDF, sync/async modes, webhooks, template library, signed URLs, PDF merge, watermarks, metadata/filenames, usage analytics. Each with an interactive mini demo.

## [0.43.0] — 2026-02-25
### Changed
- Light theme default across all pages (defaultTheme changed from "dark" to "light")
- Navbar adapts to light/dark context: dark on homepage hero, light on other pages (pricing, features, blog, etc.)
- Solutions megamenu dropdown supports both light and dark modes
- Redesigned mobile navigation menu: clean white panel, smooth slide-in animation, body scroll lock, animated solutions dropdown
- Landing page pricing section scoped to dark mode to match surrounding dark sections
- Pricing toggle uses `bg-primary/10` instead of `bg-white/10` for light mode compatibility

### Added
- Bottom-to-top black gradient fade on mobile hero image

## [0.42.0] — 2026-02-24
### Added
- **Forgot password flow**: "Forgot password?" link on login page, email with reset link (1h expiry), set new password page
- `PasswordResetToken` Prisma model with migration `20260224000003`
- Server actions: `forgotPasswordAction`, `resetPasswordAction` with rate limiting and anti-enumeration
- Pages: `/forgot-password`, `/reset-password?token=...`
### Fixed
- Features page build error: escaped JSX braces in code block

## [0.41.0] — 2026-02-24
### Added
- **Light theme**: dashboard (`/app`) and docs (`/docs`) now support light/dark toggle via sun/moon button in the topbar
- Theme toggle added to app topbar (next to notifications bell)
- Docs already had toggle — now functional
### Changed
- Root ThemeProvider: removed `forcedTheme="dark"`, enabled `enableSystem` for system preference detection
- Marketing pages, auth pages, and verify-email page force `dark` class on their wrapper to stay dark regardless of theme setting

## [0.40.0] — 2026-02-24
### Changed
- **Hero image**: replaced with new dashboard screenshot (hero.png)
- **Features page "How it works"**: redesigned from generic 3-card grid to vertical timeline with syntax-highlighted code example and response preview
- **Docs search**: replaced static placeholder input with working client-side search across all docs pages, keyboard navigation, and results dropdown
### Added
- **Name field on registration**: new optional name input on sign-up form, stored in User model, displayed in dashboard greeting ("Good morning, Joe")
- Prisma migration `20260224000002_add_user_name`
### Fixed
- **Docs search not working**: the input was purely decorative with no event handlers — now fully functional

## [0.39.0] — 2026-02-24
### Changed
- **Features page redesign**: replaced bento grid + deep dives with clean hero, 3-step "how it works" section, curl example, and bottom CTA — kept "Everything in one API" capabilities grid
### Fixed
- **Navbar clickability**: Solutions megamenu dropdown no longer blocks clicks on logo/home when closed (was rendering an invisible overlay)
### Added
- **Blog posts**: 5 seed blog posts covering HTML-to-PDF approach, AI template creation, webhook delivery, PDF merge API, and security model

## [0.38.0] — 2026-02-24
### Added
- **PDF merge endpoint**: `POST /api/v1/merge` — combine 2–50 existing PDFs into a single document with optional metadata and custom filename
- **Features page**: new "All capabilities" section listing 24 features across 4 categories (Rendering, Post-processing, Delivery & Integration, Platform)
- Merge schema added to shared `lib/schemas.ts`
- Merge endpoint added to API reference docs with request/response examples

## [0.37.0] — 2026-02-24
### Added
- **waitForSelector**: Wait for a CSS selector to appear before PDF capture (10s timeout, more reliable than fixed delay)
- **Custom filename**: Set `filename` to control the download filename in Content-Disposition header
- **Custom HTTP headers**: Pass `input.headers` for URL renders to authenticate with target pages (max 20, dangerous headers blocked)
- **PDF metadata**: Set title, author, subject, and keywords via `options.metadata` using pdf-lib
- **Watermark**: Overlay text watermark on every page via `options.watermark` with customizable color, opacity, size, and rotation
- **Per-job webhook**: `webhook_url` now properly stored and delivered on both success and failure (SSRF-guarded)
- New `lib/schemas.ts` — shared Zod schemas extracted from duplicated route code
- Studio UI: new inspector controls for waitForSelector, filename, metadata (title/author), and watermark
- Docs: API reference and quick-start updated with all 6 new features

### Changed
- Both `/convert` and `/convert-async` now import schemas from shared `lib/schemas.ts`

## [0.36.2] — 2026-02-24
### Fixed
- CodeTabs component now renders page-specific `tabs` prop (was silently falling through to default examples)
- DocsToc auto-detects h2/h3 headings from the page DOM (was hardcoded to 5 generic items)
- Removed broken `/changelog` link from docs sidebar
- Seed script: demo and test users now have `emailVerified` set (fixes /verify-email redirect)
- Seed script: test user plan changed from "pro" to "growth" (valid plan name)

## [0.36.1] — 2026-02-24
### Fixed (Security)
- **CRITICAL:** Banned users now blocked from login (auth.ts) and API access (require-api-key.ts)
- **CRITICAL:** SSRF DNS rebinding prevented — Chromium launched with `--host-resolver-rules` to pin resolved IP
- **CRITICAL:** SSRF guard added at API layer for URL inputs in both `/convert` and `/convert-async` routes
- **HIGH:** Webhook URL updates now validated with `assertSafeUrl` (server actions + API route)
- **HIGH:** Auth rate limiting added — login, register, and email verification endpoints (15min window, 10 attempts)
- **HIGH:** Verification codes now use `crypto.randomInt()` instead of `Math.random()`
- **HIGH:** Template variable values HTML-escaped before substitution (prevents script injection in Chromium)
- **HIGH:** Monthly plan render limits enforced on API routes (not just dashboard)
- **HIGH:** AI chat input validated with Zod — roles restricted to user/assistant, message sizes capped
- **HIGH:** Upload file serving now requires authentication
- **MEDIUM:** Stripe webhook secret checked for existence before use (no more `!` assertion)
- **MEDIUM:** Template/webhook API routes now support team-scoped access (not just owner)
- **MEDIUM:** Content-Security-Policy header added to all responses
- **MEDIUM:** Webhook event types validated in server actions (restricted to job.completed/job.failed)
- **LOW:** CSRF origin check added to Stripe checkout and portal POST routes
- **LOW:** OpenAI error response body no longer logged (prevents potential key leakage)

## [0.36.0] — 2026-02-24
### Changed
- Hero spiral background: increased opacity ~2.5x (0.04±0.012 → 0.09±0.035) for better visibility
- Features page: replaced 4 empty ImagePlaceholder components with contextual code-based illustrations (async pipeline, webhook delivery, versioned templates, font embedding)

### Added
- Terms of Service page (`/terms`) — 16-section legal document covering service usage, billing, liability, and GDPR
- Privacy Policy page (`/privacy`) — 12-section policy covering data collection, retention, security, and user rights (GDPR/CCPA)

## [0.35.4] — 2026-02-24
### Fixed
- Hero mobile: image now touches bottom border (removed bottom fade/padding, negative margin cancels section padding)
- Hero desktop: image width increased to 52%
- Auth spiral: opacity tripled (0.06 → 0.18), vignette softened so spiral is clearly visible

## [0.35.3] — 2026-02-24
### Changed
- Hero: new hero image (hero.webp), mobile layout anchored bottom-right at 90% width
- Auth pages (login/register): replaced gradient orbs with animated spiral background + radial vignette

## [0.35.2] — 2026-02-24
### Added
- AI Studio: load existing templates — browse saved templates in the empty state and load them into AI Studio to continue refining via chat
- Loaded template HTML is seeded into the AI conversation context so the AI knows the current template when you ask for changes
- Toolbar shows loaded template name for context

## [0.35.1] — 2026-02-24
### Changed
- AI Studio: completely redesigned chat UI — large message bubbles, gradient AI avatar, typing indicator with animated dots, proper spacing
- AI Studio: logo upload always visible in top config bar (not hidden after first generation)
- AI Studio: left panel wider (380px), chat area has subtle background, messages are instant (user bubble appears immediately on send)
- AI Studio: clickable suggestion chips in empty state ("SaaS invoice with line items", etc.)
- AI Studio: input area redesigned as a contained box with rounded border, credits shown inline

## [0.35.0] — 2026-02-24
### Added
- AI Studio: chat-based template refinement — iterate with AI to perfect templates, not just one-shot
- AI Studio: templates now use {{ variable }} placeholders with realistic sample data for preview
- AI Studio: logo upload — upload your logo and it's embedded into the template via {{ logo_url }}
- AI Studio: saved templates preserve raw {{ variables }} for use with the rendering API

### Changed
- AI Studio: complete UI redesign — left panel is now a chat interface, right panel is A4 preview
- OpenAI wrapper now accepts conversation history for multi-turn chat
- Server action rewritten as direct async call (chatGenerateAction) for better chat flow

## [0.34.1] — 2026-02-24
### Changed
- AI Studio: preview now renders in A4 paper format (centered page) instead of fullscreen
- AI Studio: templates now generate with realistic sample data instead of {{ variable }} placeholders
- Completely revamped OpenAI prompt for professional, production-quality document output

## [0.34.0] — 2026-02-24
### Added
- AI Studio: AI-powered HTML template generator using GPT-4o
- Users describe document type, style, and details to generate ready-to-use HTML templates
- Live iframe preview of generated templates with copy HTML and save-as-template actions
- Per-plan AI credit limits: starter=1/mo, growth=20/mo, business=50/mo
- New sidebar navigation entry with Sparkles icon
- New env var: `OPENAI_API_KEY` for OpenAI API access

## [0.33.2] — 2026-02-24
### Changed
- Hero image: only bottom fade, removed all side/top fades
- Hero spiral background opacity reduced (0.05 → 0.03 base)

## [0.33.1] — 2026-02-24
### Changed
- Hero image back to 55% width (was too small at 45%)
- Fire ASCII animation properly sized to fill available height, scales responsively

## [0.33.0] — 2026-02-24
### Changed
- Hero image 10% smaller (55% → 45% width), no longer overlapping text
- Hero: removed npm install box and "Read the docs" button
- Hero: "No credit card" text color fixed (zinc-700 → zinc-500) for readability
- Features page: animated fire ASCII art next to "What Rendr actually does" heading
- Footer ASCII art 10% smaller (70% → 63% width)

## [0.32.15] — 2026-02-24
### Changed
- Hero image fades significantly reduced — less black overlay on all edges

## [0.32.14] — 2026-02-24
### Changed
- Hero spiral opacity reduced slightly (0.07 → 0.05 base)

## [0.32.13] — 2026-02-24
### Fixed
- Hero image fade gradients were solid black (from-zinc-950), completely hiding the spiral behind them
- Changed all fades to semi-transparent so the spiral animation shows through the image area

## [0.32.12] — 2026-02-24
### Changed
- Hero spiral opacity halved (0.14 → 0.07 base)
- Hero image anchored to bottom of section instead of vertically centered

## [0.32.11] — 2026-02-24
### Fixed
- Hero spiral visible on left side — image fade gradient was covering entire left 58% of viewport, now scoped only to the image area on the right 55%

## [0.32.10] — 2026-02-24
### Changed
- Hero spiral ASCII opacity boosted ~4x (0.04 → 0.14 base, pulse ±0.04)

## [0.32.9] — 2026-02-24
### Changed
- Hero spiral animation rewritten: smooth radial wave from center instead of random flickering, opacity boosted ~30%
- Hero spiral properly centered using computed art dimensions
- Footer ASCII art opacity increased to 50%

## [0.32.8] — 2026-02-24
### Fixed
- Hero spiral ASCII background was invisible due to broken variable references and missing z-index layering
- Added proper z-index stacking: glow orbs (z-0) → spiral ASCII (z-1) → hero image (z-2) → content (z-10)

### Changed
- Footer ASCII art opacity increased from 8% to 15% for better visibility
- Footer ASCII art width reduced to 70% of container (30% smaller)

## [0.32.7] — 2026-02-24
### Changed
- Hero spiral ASCII background now scales dynamically to fill the entire hero section
- Footer ASCII art redesigned: large "Rendr" text rendered below footer content (Pandawa-style), white at 8% opacity, scales to full width
- Footer divider changed to dashed line with corner markers
- Old subtle canvas-overlay footer background removed

## [0.32.6] — 2026-02-24
### Changed
- Hero background replaced with animated spiral ASCII art (from ascii-art file) instead of grid lines
- Spiral ASCII art animates by cycling characters through different symbols

## [0.32.5] — 2026-02-24
### Changed
- Hero image on the right side at 50% width, text on the left

## [0.32.4] — 2026-02-24
### Changed
- Hero image moved to left side at 40% width, text pushed to right via `ml-auto`
- Footer ASCII art reduced 30% (18px → 13px)

## [0.32.3] — 2026-02-24
### Changed
- Hero image now massive and absolutely positioned, bleeding across the right side of the viewport with gradient fades on all edges
- Removed "Now in beta · 100 free renders/month" badge from hero
- Footer ASCII art animation 3x larger (font size 6→18)

## [0.32.2] — 2026-02-24
### Changed
- Hero section: left/right grid layout with text on left, product screenshot on right with soft glow and edge fades (no card wrapper)
- Footer: animated ASCII art "Rendr" background with cycling symbols ($, #, @, %, &, *, etc.) rendered on canvas at low opacity

## [0.32.1] — 2026-02-24
### Changed
- Hero section redesigned: centered text layout with full-width product screenshot, subtle perspective tilt, glow backdrop, and smooth bottom fade into page background

## [0.32.0] — 2026-02-24
### Added
- Full team workspaces: teams now have their own API keys, jobs, templates, webhooks, and usage pages
- Team-scoped pages under `/app/teams/[teamId]/*` (jobs, api-keys, templates, webhooks, usage, convert)
- Sidebar navigation dynamically scopes links based on current workspace (personal vs team)
- Team layout with membership gate — all team sub-pages verify membership automatically
- Team API keys: create and revoke keys scoped to a team, shared across all members
- Team webhooks: receive notifications for team job events
- Team Studio: render PDFs using team templates, jobs attributed to the team
- Team usage page: view render stats without per-user quota bar (billing stays per-user)
- Team dashboard now shows job count and API key count stat cards
- `teamId` column added to ApiKey, Job, Webhook, and UsageEvent models
- Worker passes `teamId` through to webhook delivery and usage tracking
- API routes (`/api/v1/*`) now scope templates, webhooks, jobs by team when using a team API key
- `lib/team-auth.ts` helper for verifying team membership in server actions

## [0.31.0] — 2026-02-24
### Fixed
- Pricing cards now show correct prices from `lib/currency.ts` ($9.90/$49.90 instead of $49/$199)
- Pricing cards detect EUR/USD currency from visitor location via CF-IPCountry header
- Monthly/annual toggle replaced with clickable buttons that work reliably
- Starter plan features corrected: 100 renders/month (was 500), matches server-enforced limit
- FAQ section updated to match correct 100 renders/month free tier
### Changed
- Hero section right side: replaced code terminal with a live dashboard mockup
- Team workspace page redesigned as a proper dashboard with stat cards, templates, and members
- Removed duplicate profile picture/user menu from topbar (kept in sidebar only)

## [0.30.6] — 2026-02-24
### Changed
- Hero section right side: replaced code terminal with a live dashboard mockup showing stat cards, activity chart, jobs table, and mini sidebar — gives visitors an instant feel for the product

## [0.30.5] — 2026-02-23
### Fixed
- Settings page now shows the user's actual plan instead of hardcoded "Starter"
- Team invite page now shows a landing with "Create account" + "Sign in" buttons for unauthenticated visitors (previously redirected directly to /login)
### Added
- Workspace switcher in sidebar — compact dropdown above nav shows Personal + all teams the user belongs to, with current workspace highlighted

## [0.30.4] — 2026-02-23
### Added
- USD/EUR currency auto-detection via CF-IPCountry header (EU → EUR, all others → USD)
- `lib/currency.ts` — EU country set, detectCurrency(), PLAN_PRICES per currency, getPriceId()
- 8 Stripe price IDs: Growth + Business × monthly + yearly × EUR + USD
- Downgrade to Free button — cancels subscription at period end via `/api/stripe/cancel`
- Resume button — removes cancel_at_period_end via `/api/stripe/resume`
- CancellationBanner shown on billing page when subscription is pending cancellation
### Changed
- Billing page detects currency server-side and passes to BillingPlansSection
- Plan comparison shows correct currency symbol; note shows detected currency
- planFromPriceId updated to check all 8 price IDs

## [0.30.3] — 2026-02-23
### Added
- `lib/plans.ts` — single source of truth for plan limits (render counts + file size)
- 2 MB PDF size limit enforced in worker for Free plan; Studio shows "Free plan: max 2 MB" notice
- Blocking render-limit gate in `convertUrlAction` (returns error instead of queuing when at limit)
### Changed
- New logo asset replacing old one; sidebar logo uses `invert dark:invert-0` (black in light mode, white in dark mode)
- Sidebar usage section redesigned: flat layout, no card — plan dot indicator, usage bar, upgrade link
- Free plan limit updated to 100 renders/month (was 500); billing page + studio updated
- Prices updated — Growth: €9.90/mo · €99.90/yr · Business: €49.90/mo · €490.90/yr
- Growth/Business plan limits: 5,000 and 50,000 renders/month (sidebar now shows correct limit per plan)

## [0.30.2] — 2026-02-23
### Added
- Yearly billing toggle on billing page with "2 months free" badge
- Growth and Business now have separate monthly + yearly price IDs
### Changed
- Updated plan prices to €9.90/mo (Growth) and €49.90/mo (Business)

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
