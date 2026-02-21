# Templates

**Purpose:** Reusable HTML templates with `{{variable}}` placeholder substitution for PDF generation.
**Auth:** session (dashboard CRUD) | api-key (REST API)
**Data:** `Template`, `Job`
**Actions/Routes:**
- `createTemplateAction` — create template owned by session user
- `updateTemplateAction` — update name/HTML, ownership-checked
- `deleteTemplateAction` — delete template, ownership-checked
- `GET/POST /api/v1/templates` — list/create via API key
- `GET/PUT/DELETE /api/v1/templates/[id]` — individual template management via API key
**Components:**
- `page.tsx` (server) — fetches all user templates (including HTML for variable extraction), passes to client
- `templates-client.tsx` (client) — card grid, create/edit/delete dialogs
**State:** Dialog open/close per card, `useActionState` per form
**Variable syntax:** `{{variableName}}` in HTML — replaced at render time by worker processor
