# Rendr

A premium HTML-to-PDF rendering SaaS — Phase 1 UI scaffold.

Built with Next.js 15, Tailwind CSS v4, and shadcn/ui. UI-only: no backend, no database, no real auth. All data is mocked.

---

## Local dev

```bash
# Install dependencies
npm install

# Start dev server (Turbopack)
npm run dev

# Open http://localhost:3000
```

Other commands:

```bash
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
npx tsc --noEmit     # Type-check without emitting
```

---

## Tech stack

| Layer         | Choice                                              |
|---------------|-----------------------------------------------------|
| Framework     | Next.js 15 (App Router, Turbopack)                  |
| Language      | TypeScript 5                                        |
| Styles        | Tailwind CSS v4 + shadcn/ui (new-york, zinc base)   |
| Icons         | lucide-react                                        |
| Fonts         | Inter (next/font/google)                            |
| Dark mode     | next-themes                                         |

---

## Route map

### Public — `app/(public)/`

| Route       | File                            | Description                        |
|-------------|---------------------------------|------------------------------------|
| `/`         | `app/(public)/page.tsx`         | Landing page (7 sections)          |
| `/features` | `app/(public)/features/page.tsx`| Features detail + deep dives        |
| `/pricing`  | `app/(public)/pricing/page.tsx` | 3-tier pricing + FAQ accordion     |
| `/blog`     | `app/(public)/blog/page.tsx`    | Blog placeholder                   |

### Auth — `app/(auth)/`

| Route       | File                          | Description   |
|-------------|-------------------------------|---------------|
| `/login`    | `app/(auth)/login/page.tsx`   | Sign in form  |
| `/register` | `app/(auth)/register/page.tsx`| Create account|

### Docs — `app/docs/`

| Route                | File                                | Description                     |
|----------------------|-------------------------------------|---------------------------------|
| `/docs`              | `app/docs/page.tsx`                 | Docs home — quick links + endpoints |
| `/docs/quick-start`  | `app/docs/quick-start/page.tsx`     | Quick start + CodeTabs          |
| `/docs/api`          | `app/docs/api/page.tsx`             | API reference + error codes     |
| `/docs/templates`    | `app/docs/templates/page.tsx`       | Templates guide                 |

### Dashboard — `app/app/`

| Route              | File                           | Description                       |
|--------------------|--------------------------------|-----------------------------------|
| `/app`             | `app/app/page.tsx`             | Overview — summary cards + jobs   |
| `/app/api-keys`    | `app/app/api-keys/page.tsx`    | Key management + create dialog    |
| `/app/jobs`        | `app/app/jobs/page.tsx`        | Job table + status filter         |
| `/app/templates`   | `app/app/templates/page.tsx`   | Template cards + create form      |
| `/app/webhooks`    | `app/app/webhooks/page.tsx`    | Webhook list + Switch toggles     |
| `/app/usage`       | `app/app/usage/page.tsx`       | Progress bars + chart placeholder |
| `/app/billing`     | `app/app/billing/page.tsx`     | Plan + invoices                   |

---

## shadcn/ui components used

If you ever need to re-install:

```bash
npx shadcn@latest add button card badge table dialog tabs accordion \
  dropdown-menu input label select switch tooltip separator sheet \
  avatar navigation-menu scroll-area
```

Components are written manually in `components/ui/` — they match the shadcn new-york style exactly.

---

## Design system

| Token       | Light                  | Dark                  |
|-------------|------------------------|-----------------------|
| Background  | zinc-50                | zinc-950              |
| Foreground  | zinc-900               | zinc-50               |
| Muted text  | zinc-500               | zinc-400              |
| Border      | zinc-200               | zinc-800 (10% white)  |
| Primary     | blue-600               | blue-400              |
| Card        | white                  | zinc-900              |

All tokens are defined as OKLCH CSS variables in `app/globals.css`.

---

## Adding a chart to Usage page

Install recharts:

```bash
npm install recharts
```

In `app/app/usage/page.tsx`, replace the `<ImagePlaceholder>` with:

```tsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

<ResponsiveContainer width="100%" height={220}>
  <LineChart data={mockUsage.daily}>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
    <YAxis tick={{ fontSize: 11 }} />
    <Tooltip />
    <Line
      type="monotone"
      dataKey="jobs"
      stroke="var(--color-primary)"
      strokeWidth={2}
      dot={false}
    />
  </LineChart>
</ResponsiveContainer>
```

---

## Mock data

All mock data lives in `lib/mock/`. Each file exports a typed array and an interface:

| File              | Exports                        |
|-------------------|--------------------------------|
| `jobs.ts`         | `mockJobs`, `Job`, `JobStatus` |
| `api-keys.ts`     | `mockApiKeys`, `ApiKey`        |
| `templates.ts`    | `mockTemplates`, `Template`    |
| `webhooks.ts`     | `mockWebhooks`, `Webhook`      |
| `usage.ts`        | `mockUsage`, `UsageSummary`    |

Replace each export with a real API call (SWR, TanStack Query, or RSC fetch) when the backend is ready.

---

## Image placeholders

Every `<ImagePlaceholder>` has a comment above it describing:
- The intended final asset (screenshot, illustration, icon, SVG)
- Suggested export format (PNG / SVG)
- Exact dimensions and aspect ratio

Search for `ImagePlaceholder` across the codebase to find all placeholder slots:

```bash
grep -r "ImagePlaceholder" app/ components/ --include="*.tsx" -l
```

---

## GitHub setup

```bash
# 1. Initialize git
git init

# 2. Stage all files
git add .

# 3. First commit
git commit -m "feat: initial Rendr Phase 1 UI scaffold

- Next.js 15 App Router + TypeScript + Tailwind CSS v4
- shadcn/ui components (new-york, zinc base)
- Marketing pages: landing, features, pricing, blog
- Auth pages: login, register
- Docs layout + pages: home, quick-start, API reference, templates
- Dashboard: overview, api-keys, jobs, templates, webhooks, usage, billing
- ImagePlaceholder component for all asset slots
- Mock data in lib/mock/ for all dashboard pages
- Dark mode via next-themes"

# 4. Add remote (your repo is already created)
git remote add origin git@github.com:alexthecreator0001/rendr.git

# 5. Push
git push -u origin main
```

If your default branch is `master` instead of `main`:

```bash
git branch -M main
git push -u origin main
```

---

## Project structure

```
rendr/
├── app/
│   ├── layout.tsx              ← Root layout (Inter, ThemeProvider)
│   ├── globals.css             ← Design tokens (OKLCH), base styles
│   ├── (public)/               ← Marketing layout (Navbar + Footer)
│   │   ├── page.tsx
│   │   ├── features/
│   │   ├── pricing/
│   │   └── blog/
│   ├── (auth)/                 ← Clean auth layout
│   │   ├── login/
│   │   └── register/
│   ├── docs/                   ← Docs layout (sidebar + TOC)
│   │   ├── page.tsx
│   │   ├── quick-start/
│   │   ├── api/
│   │   └── templates/
│   └── app/                    ← Dashboard layout (sidebar + topbar)
│       ├── page.tsx
│       ├── api-keys/
│       ├── jobs/
│       ├── templates/
│       ├── webhooks/
│       ├── usage/
│       └── billing/
├── components/
│   ├── ui/                     ← shadcn/ui components
│   ├── layout/                 ← Navbar, Footer, sidebars, topbar
│   ├── media/                  ← ImagePlaceholder
│   ├── marketing/              ← Hero, FeaturesGrid, PricingCards, etc.
│   ├── docs/                   ← CodeBlock, CodeTabs, Prose
│   ├── dashboard/              ← SummaryCards, EmptyState, StatusPill
│   └── theme-toggle.tsx
├── lib/
│   ├── utils.ts                ← cn() helper
│   └── mock/                   ← Mock data arrays + TypeScript types
├── package.json
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── components.json             ← shadcn config
```
