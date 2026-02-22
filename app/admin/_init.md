# Admin Panel — Layout Convention

**Purpose:** Internal admin pages under `/admin`. Requires `role === "admin"` DB check on every page.
**Auth:** session + DB role check via `requireAdmin()` in `app/admin/_actions.ts`.
**Shell:** Same `AppSidebar` + `AppTopbar` as `/app`, sidebar shows red-accented admin nav.

## Page wrapper — mandatory pattern

Every admin page (server or client component) must use this exact outer div:

```tsx
<div className="px-4 py-6 sm:px-6 sm:py-8">
  {/* page content */}
</div>
```

Add `space-y-6` or `space-y-8` as needed for vertical rhythm.

**Rules:**
- NO `max-w-*` — admin pages are always full-width.
- NO `mx-auto` — never constrain admin content width.
- Padding is always responsive: `px-4` mobile → `px-6` sm+, `py-6` mobile → `py-8` sm+.
- If the page delegates its root JSX to a `-client.tsx` component, the wrapper goes inside the client component.

## Auth guard pattern

```ts
// In page.tsx
const session = await auth();
if (!session?.user?.id) redirect("/login");
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: { role: true },
});
if (user?.role !== "admin") redirect("/app");
```

For server actions, use `requireAdmin()` from `app/admin/_actions.ts`.

## File structure

```
app/admin/<section>/
  page.tsx               — server component: auth guard, Prisma queries, passes data to client
  <section>-client.tsx   — "use client": tables, dialogs, forms
```

Shared server actions live in `app/admin/_actions.ts`.

## Existing pages

| Route | File with wrapper |
|---|---|
| `/admin` | `page.tsx` |
| `/admin/users` | `users-client.tsx` |
| `/admin/subscriptions` | `page.tsx` |
| `/admin/jobs` | `page.tsx` |
| `/admin/support` | `support-client.tsx` |
| `/admin/features` | `features-client.tsx` |
| `/admin/notifications` | `page.tsx` |
| `/admin/templates` | `page.tsx` |
| `/admin/blog` | `page.tsx` |
