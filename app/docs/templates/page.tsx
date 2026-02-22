import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Prose } from "@/components/docs/prose";
import { CodeBlock } from "@/components/docs/code-block";
import { CodeTabs } from "@/components/docs/code-tabs";

export const metadata: Metadata = { title: "Templates — Rendr Docs" };

const BASE = "https://rendrpdf.com";

const createTemplate = `curl -X POST ${BASE}/api/v1/templates \\
  -H "Authorization: Bearer rk_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Invoice",
    "html": "<!DOCTYPE html><html><body style=\\"font-family:sans-serif\\"><h1>Invoice #{{invoice_number}}</h1><p>Bill to: {{client_name}}</p><p>Amount due: {{total}}</p></body></html>"
  }'`;

const createResponse = `{
  "id": "clxyz...",
  "name": "Invoice",
  "created_at": "2026-02-22T10:00:00.000Z",
  "updated_at": "2026-02-22T10:00:00.000Z"
}`;

const listTemplates = `curl ${BASE}/api/v1/templates \\
  -H "Authorization: Bearer rk_live_YOUR_KEY"`;

const listResponse = `[
  {
    "id": "clxyz...",
    "name": "Invoice",
    "created_at": "2026-02-22T10:00:00.000Z",
    "updated_at": "2026-02-22T10:00:00.000Z"
  }
]`;

const getTemplate = `curl ${BASE}/api/v1/templates/clxyz... \\
  -H "Authorization: Bearer rk_live_YOUR_KEY"
# → Returns the full template including "html" field`;

const updateTemplate = `curl -X PUT ${BASE}/api/v1/templates/clxyz... \\
  -H "Authorization: Bearer rk_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Invoice v2", "html": "<!DOCTYPE html>..."}'`;

const deleteTemplate = `curl -X DELETE ${BASE}/api/v1/templates/clxyz... \\
  -H "Authorization: Bearer rk_live_YOUR_KEY"
# → 204 No Content`;

const renderTemplate = `curl -X POST ${BASE}/api/v1/convert \\
  -H "Authorization: Bearer rk_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": {
      "type": "template",
      "template_id": "clxyz...",
      "variables": {
        "invoice_number": "INV-0042",
        "client_name": "Acme Corp",
        "total": "$1,250.00"
      }
    },
    "options": { "format": "A4" }
  }'`;

const invoiceHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
      color: #111;
      font-size: 13px;
      line-height: 1.6;
      padding: 48px 56px;
    }
    h1 { font-size: 32px; font-weight: 800; }
    .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #888; }
    table { width: 100%; border-collapse: collapse; margin-top: 32px; }
    th { text-align: left; font-size: 10px; text-transform: uppercase; color: #888; padding: 8px; }
    td { padding: 12px 8px; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <h1>INVOICE</h1>
  <p class="label">{{invoice_number}}</p>

  <p><strong>Bill to:</strong> {{client_name}}<br>{{client_address}}</p>
  <p><strong>Due:</strong> {{due_date}}</p>

  <table>
    <thead>
      <tr><th>Description</th><th>Qty</th><th>Price</th><th>Total</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>{{item_description}}</td>
        <td>{{item_qty}}</td>
        <td>{{item_price}}</td>
        <td>{{item_total}}</td>
      </tr>
    </tbody>
  </table>

  <p style="text-align:right; margin-top:24px; font-size:18px; font-weight:800">
    Total Due: {{total}}
  </p>
</body>
</html>`;

const varSyntax = `<!-- Single placeholder -->
<p>Hello, {{first_name}}!</p>

<!-- In attributes -->
<img src="{{logo_url}}" alt="Logo">

<!-- In style values (be careful) -->
<div style="background-color: {{brand_color}}">

<!-- Whitespace around the name is ignored -->
<p>{{ company_name }}</p>   ← also valid`;

const nodeRenderMany = `const TEMPLATE_ID = "clxyz...";

const invoices = [
  { invoice_number: "INV-001", client_name: "Acme Corp", total: "$500" },
  { invoice_number: "INV-002", client_name: "Globex",    total: "$750" },
];

const pdfs = await Promise.all(
  invoices.map((vars) =>
    fetch("${BASE}/api/v1/convert", {
      method: "POST",
      headers: {
        Authorization: "Bearer rk_live_YOUR_KEY",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: { type: "template", template_id: TEMPLATE_ID, variables: vars },
      }),
    }).then((r) => r.json())
  )
);

// pdfs[0].pdf_url, pdfs[1].pdf_url, ...`;

const idempotency = `// Same idempotency_key → same job returned (no duplicate render)
fetch("${BASE}/api/v1/convert", {
  method: "POST",
  headers: {
    Authorization: "Bearer rk_live_YOUR_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    input: {
      type: "template",
      template_id: "clxyz...",
      variables: { invoice_number: "INV-001" },
    },
    idempotency_key: "invoice-INV-001-2026-02",
  }),
});`;

export default function TemplatesDocsPage() {
  return (
    <div className="max-w-3xl space-y-12">
      {/* Header */}
      <div>
        <Badge variant="outline" className="mb-4 rounded-full text-xs">Templates</Badge>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Templates</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Store reusable HTML layouts once and render them many times with different data. Templates
          live in your account and are referenced by ID. Variables use <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{"{{double_braces}}"}</code> syntax and are substituted at render time.
        </p>
      </div>

      {/* Create */}
      <section>
        <Prose>
          <h2 id="create">Creating a template</h2>
          <p>
            POST to <code>/api/v1/templates</code> with a <code>name</code> and <code>html</code> string.
            The HTML is stored as-is and substitution happens per render — the template itself never changes.
          </p>
          <p>
            You can also create and edit templates in the{" "}
            <a href="/app/templates">dashboard</a> with a live preview and variable detection.
          </p>
        </Prose>
        <CodeTabs tabs={[{ label: "curl", code: createTemplate, language: "bash" }]} />
        <Prose><p>Response:</p></Prose>
        <CodeBlock code={createResponse} language="json" />
        <Prose>
          <p>
            The response does <strong>not</strong> include the HTML. Use{" "}
            <code>GET /api/v1/templates/:id</code> to retrieve the full HTML.
          </p>
        </Prose>
      </section>

      {/* List */}
      <section>
        <Prose>
          <h2 id="list">Listing templates</h2>
          <p>Returns all templates for the authenticated key. HTML is excluded from the list for performance — fetch individual templates to get the HTML.</p>
        </Prose>
        <CodeTabs tabs={[{ label: "curl", code: listTemplates, language: "bash" }]} />
        <CodeBlock code={listResponse} language="json" />
      </section>

      {/* Get / Update / Delete */}
      <section>
        <Prose>
          <h2 id="crud">Get, update, delete</h2>
        </Prose>
        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Get template (includes HTML)</p>
            <CodeBlock code={getTemplate} language="bash" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Update name or HTML (PUT)</p>
            <CodeBlock code={updateTemplate} language="bash" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Delete (returns 204)</p>
            <CodeBlock code={deleteTemplate} language="bash" />
          </div>
        </div>
      </section>

      {/* Render */}
      <section>
        <Prose>
          <h2 id="render">Rendering a template</h2>
          <p>
            Set <code>input.type</code> to <code>"template"</code> and provide the{" "}
            <code>template_id</code>. Pass variables in the <code>input.variables</code> object.
            Works with both <code>/convert</code> (sync) and <code>/convert-async</code>.
          </p>
        </Prose>
        <CodeTabs tabs={[{ label: "curl", code: renderTemplate, language: "bash" }]} />
      </section>

      {/* Variables */}
      <section>
        <Prose>
          <h2 id="variables">Variable syntax</h2>
          <p>
            Variables use <code>{"{{double_brace}}"}</code> notation anywhere in the HTML — in text
            content, attribute values, or inline style values. Whitespace around the name is ignored.
            Variable names should use lowercase letters, numbers, and underscores.
          </p>
          <p>
            Variables that appear in the template but are not provided in the render request are
            replaced with an empty string — they will not cause an error.
          </p>
        </Prose>
        <CodeBlock code={varSyntax} language="html" />
      </section>

      {/* Example template */}
      <section>
        <Prose>
          <h2 id="example">Example: Invoice template</h2>
          <p>
            A minimal but complete invoice template using inline CSS (no external dependencies —
            important for reliable PDF rendering). Variables are highlighted.
          </p>
        </Prose>
        <CodeBlock code={invoiceHtml} language="html" filename="invoice.html" />
        <Prose>
          <p>
            Keep all CSS inline or in a <code>{"<style>"}</code> block in the HTML{" "}
            <code>{"<head>"}</code>. External stylesheets work if publicly accessible, but inline
            CSS is more reliable and faster.
          </p>
        </Prose>
      </section>

      {/* Batch rendering */}
      <section>
        <Prose>
          <h2 id="batch">Batch rendering</h2>
          <p>
            To generate many PDFs from the same template (e.g. bulk invoices), fire concurrent
            requests. Each request creates an independent job. Use idempotency keys to prevent
            duplicate renders if requests are retried.
          </p>
        </Prose>
        <CodeTabs tabs={[{ label: "Node.js", code: nodeRenderMany, language: "javascript" }]} />
      </section>

      {/* Idempotency */}
      <section>
        <Prose>
          <h2 id="idempotency">Idempotency keys</h2>
          <p>
            Pass <code>idempotency_key</code> in the request body (or the <code>Idempotency-Key</code>{" "}
            header) to make render requests idempotent. If a job with the same key already exists for
            your API key, the existing job is returned instead of creating a new one. Useful for safe
            retries.
          </p>
        </Prose>
        <CodeBlock code={idempotency} language="javascript" />
      </section>

      {/* Tips */}
      <section>
        <Prose>
          <h2 id="tips">Best practices</h2>
          <ul>
            <li><strong>Inline all CSS</strong> — external stylesheets add latency and can fail silently.</li>
            <li><strong>Use system fonts or Google Fonts</strong> — <code>@import</code> from Google Fonts works inside Playwright. Fallback to <code>-apple-system, Arial, sans-serif</code>.</li>
            <li><strong>Set explicit sizes</strong> — use <code>px</code>, <code>mm</code>, or <code>pt</code> units. Avoid viewport units (<code>vw</code>, <code>vh</code>).</li>
            <li><strong>Test with the dashboard</strong> — the <a href="/app/templates">template editor</a> previews your HTML with sample data and shows detected variable names.</li>
            <li><strong>Use <code>waitFor</code></strong> — if your template uses JavaScript to render charts or animations, set <code>options.waitFor</code> to give it time before capture.</li>
            <li><strong>Avoid <code>position: fixed</code></strong> — fixed positioning behaves differently in print context. Use <code>position: absolute</code> inside a relative container instead.</li>
          </ul>
        </Prose>
      </section>
    </div>
  );
}
