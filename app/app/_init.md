# App Dashboard — Layout Convention

**Purpose:** Authenticated user-facing pages under `/app`.
**Auth:** session (NextAuth v5), redirects to `/login` if missing.
**Shell:** `AppSidebar` + `AppTopbar` defined in `app/app/layout.tsx`.

## Page wrapper — mandatory pattern

Every page (server or client component) must use this exact outer div:

```tsx
<div className="px-4 py-6 sm:px-6 sm:py-8">
  {/* page content */}
</div>
```

Add `space-y-6` or `space-y-8` as needed for vertical rhythm between sections.

**Rules:**
- NO `max-w-*` — all pages are full-width inside the sidebar shell.
- NO `mx-auto` — centering is handled by the sidebar layout, not the page.
- Padding is always responsive: `px-4` mobile → `px-6` sm+, `py-6` mobile → `py-8` sm+.
- If the page delegates its root JSX to a `-client.tsx` component, the wrapper div goes inside that client component (not in the server page.tsx).

## File structure

```
app/app/<feature>/
  page.tsx          — server component: auth, Prisma queries, passes data to client
  <feature>-client.tsx  — "use client": interactivity, forms, dialogs
  _init.md          — feature-level purpose/data/actions description
```

## Existing pages

| Route | File with wrapper |
|---|---|
| `/app` | `page.tsx` |
| `/app/convert` | special: `h-full overflow-hidden` (Studio fills viewport) |
| `/app/jobs` | `page.tsx` |
| `/app/usage` | `page.tsx` |
| `/app/api-keys` | `page.tsx` |
| `/app/templates` | `page.tsx` |
| `/app/webhooks` | `webhooks-client.tsx` |
| `/app/billing` | `page.tsx` |
| `/app/settings` | `page.tsx` |
| `/app/support` | `support-client.tsx` |
| `/app/features` | `features-client.tsx` |
| `/app/teams` | `page.tsx` |
| `/app/teams/[teamId]` | `page.tsx` |
