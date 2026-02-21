# Settings

**Purpose:** User account settings — view profile, change password, danger zone.
**Auth:** session
**Data:** `User`
**Actions/Routes:** changePasswordAction (app/actions/auth.ts)
**Components:** page.tsx (server — fetches session/email), settings-client.tsx (client — change password form)
**State:** Form reset on success via `useActionState`
