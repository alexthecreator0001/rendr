import type { Metadata } from "next";
import { Prose } from "@/components/docs/prose";
import { CodeBlock } from "@/components/docs/code-block";
import { CodeTabs } from "@/components/docs/code-tabs";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "API Reference — Rendr Docs" };

const BASE = "https://rendrpdf.com/api/v1";

// ── Request bodies ────────────────────────────────────────────────────────────

const convertBody = `{
  // ── input (required) ───────────────────────────────────────────────────────
  "input": {
    // "html"     → render raw HTML string
    // "url"      → fetch a public URL and render it
    // "template" → use a stored template (by ID)
    "type": "html" | "url" | "template",

    "content": "<h1>Hello {{name}}</h1>",  // required for type: html or url
    "template_id": "clxyz...",             // required for type: template
    "variables": { "name": "World" },      // {{var}} substitution (any type)

    // Custom HTTP headers — only allowed when type: "url"
    "headers": {                           // max 20 entries; Host, Content-Length blocked
      "Authorization": "Bearer tok_...",
      "Cookie": "session=abc123"
    }
  },

  // ── options (all optional) ─────────────────────────────────────────────────
  "options": {
    // Paper size — use format OR width+height (not both)
    "format": "A4",              // A4 | Letter | Legal | Tabloid | A3 | A5 | A6 (default: A4)
    "width": "21cm",             // custom width (overrides format)
    "height": "29.7cm",          // custom height (overrides format)

    "landscape": false,          // default: false (portrait)
    "printBackground": true,     // include CSS backgrounds — default: true
    "preferCSSPageSize": false,  // use CSS @page size instead of format

    "scale": 1,                  // render scale 0.1–2 (default: 1)
    "pageRanges": "1-3, 5",      // subset of pages to include

    "margin": {
      "top": "20mm",    // default: 20mm
      "right": "15mm",  // default: 15mm
      "bottom": "20mm", // default: 20mm
      "left": "15mm"    // default: 15mm
    },

    // Running headers/footers (uses Chromium template HTML)
    "displayHeaderFooter": false,
    "headerTemplate": "<div style='font-size:9px;...'>...</div>",
    "footerTemplate": "<div style='font-size:9px;...'>...</div>",

    "tagged": false,             // PDF/UA accessibility tagging
    "outline": false,            // embed document outline (table of contents)

    "waitFor": 0,                // seconds to wait for JS before capture (0–10)
    "waitForSelector": "#ready", // CSS selector to wait for before capture (10s timeout)

    // PDF metadata — embedded in the PDF document properties
    "metadata": {
      "title": "Invoice #42",
      "author": "Acme Corp",
      "subject": "Monthly invoice",
      "keywords": "invoice, billing, acme"
    },

    // Text watermark — overlaid on every page
    "watermark": {
      "text": "DRAFT",          // required
      "color": "gray",          // CSS color (default: gray)
      "opacity": 0.15,          // 0–1 (default: 0.15)
      "fontSize": 72,           // px (default: 72)
      "rotation": -45            // degrees (default: -45)
    }
  },

  // ── extras ────────────────────────────────────────────────────────────────
  "filename": "invoice-42.pdf",                          // custom download filename
  "webhook_url": "https://your-site.com/hooks/rendr",   // one-off webhook for this job
  "idempotency_key": "invoice-INV-0042"                  // prevent duplicate renders
}`;

const jobResponse = `{
  "job_id": "cm7abc123def456...",
  "status": "succeeded",         // queued | processing | succeeded | failed
  "input_type": "html",          // html | url | template
  "pdf_url": "${BASE}/files/Xt7mK2nP...",   // null until succeeded
  "status_url": "${BASE}/jobs/cm7abc123...",
  "error": null,                 // error message if status === "failed"
  "created_at": "2026-02-22T10:00:00.000Z",
  "updated_at": "2026-02-22T10:00:01.842Z"
}`;

const templateBody = `{
  "name": "Invoice",                        // required
  "html": "<!DOCTYPE html><html>...</html>" // required — full HTML string
}`;

const templateResponse = `{
  "id": "clxyz...",
  "name": "Invoice",
  "created_at": "2026-02-22T10:00:00.000Z",
  "updated_at": "2026-02-22T10:00:00.000Z"
  // "html" is NOT returned here — use GET /templates/:id to retrieve HTML
}`;

const webhookBody = `{
  "url": "https://your-site.com/hooks/rendr",   // required — HTTPS endpoint
  "events": ["job.completed", "job.failed"],    // default: both events
  "enabled": true                               // default: true
}`;

const webhookCreateResponse = `{
  "id": "wh_abc...",
  "url": "https://your-site.com/hooks/rendr",
  "events": ["job.completed", "job.failed"],
  "enabled": true,
  "secret": "whsec_Xt7mK2nP...",   // shown ONLY at creation — store it now
  "created_at": "2026-02-22T10:00:00.000Z"
}`;

const webhookPayload = `// POST to your registered URL
// Headers:
//   Content-Type: application/json
//   X-Rendr-Signature: sha256=<hmac-hex>

{
  "event": "job.completed",
  "job_id": "cm7abc123...",
  "status": "succeeded",
  "pdf_url": "${BASE}/files/Xt7mK2nP...",
  "created_at": "2026-02-22T10:00:00.000Z"
}`;

const webhookFailPayload = `{
  "event": "job.failed",
  "job_id": "cm7abc456...",
  "status": "failed",
  "pdf_url": null,
  "error": "Playwright timeout after 30s",
  "created_at": "2026-02-22T10:00:00.000Z"
}`;

const webhookVerifyNode = `const crypto = require("crypto");

function verifySignature(secret, rawBody, signature) {
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

// Express — use raw body middleware
app.post("/hooks/rendr", express.raw({ type: "*/*" }), (req, res) => {
  const sig = req.headers["x-rendr-signature"];
  if (!verifySignature(process.env.WEBHOOK_SECRET, req.body, sig)) {
    return res.status(401).end();
  }
  const event = JSON.parse(req.body);
  console.log(event.event, event.job_id, event.pdf_url);
  res.status(200).end();
});`;

const webhookVerifyPython = `import hmac, hashlib, json
from flask import Flask, request, abort

app = Flask(__name__)
WEBHOOK_SECRET = "whsec_..."

@app.route("/hooks/rendr", methods=["POST"])
def webhook():
    sig = request.headers.get("X-Rendr-Signature", "")
    expected = "sha256=" + hmac.new(
        WEBHOOK_SECRET.encode(),
        request.data,
        hashlib.sha256
    ).hexdigest()
    if not hmac.compare_digest(sig, expected):
        abort(401)
    event = request.get_json(force=True)
    print(event["event"], event["job_id"])
    return "", 200`;

const usageResponse = `{
  "today": 12,
  "last_7_days": 84,
  "last_30_days": 312
}`;

const errorResponse = `{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Too many requests. Retry after 60 seconds."
  }
}`;

// ── Endpoint table data ────────────────────────────────────────────────────────

const endpoints = [
  { method: "GET",    path: "/health",          auth: false, description: "Health check. Returns { ok: true, db: true }. Use for uptime monitoring." },
  { method: "POST",   path: "/convert",         auth: true,  description: "Sync render. Waits up to 8 s. Returns 200 with pdf_url or 202 if still processing." },
  { method: "POST",   path: "/convert-async",   auth: true,  description: "Async render. Always returns 202 with job_id immediately. Poll or use webhooks." },
  { method: "GET",    path: "/jobs/:id",         auth: true,  description: "Get job status. Returns full job object including pdf_url when succeeded." },
  { method: "GET",    path: "/files/:token",     auth: false, description: "Download rendered PDF. The token is the credential — no API key needed." },
  { method: "GET",    path: "/templates",        auth: true,  description: "List your templates. HTML excluded from list — fetch by ID to get HTML." },
  { method: "POST",   path: "/templates",        auth: true,  description: "Create a template. Body: { name, html }. Returns template object (no HTML)." },
  { method: "GET",    path: "/templates/:id",    auth: true,  description: "Get a single template including its full HTML." },
  { method: "PUT",    path: "/templates/:id",    auth: true,  description: "Update template name and/or HTML. Partial updates supported." },
  { method: "DELETE", path: "/templates/:id",    auth: true,  description: "Delete a template. Returns 204 No Content." },
  { method: "GET",    path: "/webhooks",         auth: true,  description: "List registered webhooks. Secret is never returned after creation." },
  { method: "POST",   path: "/webhooks",         auth: true,  description: "Register a webhook. Secret returned only at creation — save it immediately." },
  { method: "GET",    path: "/webhooks/:id",     auth: true,  description: "Get a single webhook (no secret)." },
  { method: "PUT",    path: "/webhooks/:id",     auth: true,  description: "Update webhook URL, events, or enabled status." },
  { method: "DELETE", path: "/webhooks/:id",     auth: true,  description: "Delete a webhook. Returns 204 No Content." },
  { method: "GET",    path: "/usage",            auth: true,  description: "Render counts: { today, last_7_days, last_30_days }." },
];

const errors = [
  { code: "unauthorized",       status: 401, description: "Missing, malformed, or unknown API key." },
  { code: "api_key_revoked",    status: 401, description: "The API key exists but has been revoked." },
  { code: "forbidden",          status: 403, description: "Authenticated but not permitted to access this resource." },
  { code: "not_found",          status: 404, description: "Resource not found or not owned by your key." },
  { code: "validation_error",   status: 422, description: "Request body failed schema validation. Check the message field." },
  { code: "render_failed",      status: 422, description: "Playwright failed to render the PDF. Check your HTML for issues." },
  { code: "rate_limit_exceeded",status: 429, description: "Too many requests. Check the Retry-After header." },
  { code: "internal_error",     status: 500, description: "Unexpected server error. Try again; contact support if it persists." },
];

const methodColors: Record<string, string> = {
  GET:    "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  POST:   "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PUT:    "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  DELETE: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function ApiReferencePage() {
  return (
    <div className="max-w-4xl space-y-14">
      {/* Header */}
      <div>
        <Badge variant="outline" className="mb-4 rounded-full text-xs">API Reference</Badge>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">API Reference</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Base URL:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{BASE}</code>
          &nbsp;·&nbsp; All requests and responses are JSON.
        </p>
      </div>

      {/* Authentication */}
      <section id="authentication">
        <Prose>
          <h2>Authentication</h2>
          <p>
            Pass your API key as a Bearer token in every request (except{" "}
            <code>GET /health</code> and <code>GET /files/:token</code>):
          </p>
        </Prose>
        <CodeBlock code={`Authorization: Bearer rk_live_YOUR_API_KEY`} language="http" />
        <Prose>
          <p>
            API keys are created in{" "}
            <a href="/app/api-keys">Dashboard → API Keys</a>. The plaintext key is shown once
            at creation. Only a SHA-256 hash is stored — the original cannot be recovered. Revoke
            keys at any time from the dashboard.
          </p>
        </Prose>
      </section>

      {/* Endpoints table */}
      <section id="endpoints">
        <Prose><h2>Endpoints</h2></Prose>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Method</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Path</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">Auth</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {endpoints.map((ep) => (
                <tr key={`${ep.method}-${ep.path}`} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${methodColors[ep.method]}`}>
                      {ep.method}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-foreground">{ep.path}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground hidden sm:table-cell">
                    {ep.auth ? "Required" : "None"}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{ep.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Convert body */}
      <section id="convert">
        <Prose>
          <h2>POST /convert &amp; POST /convert-async</h2>
          <p>
            Both endpoints accept the same request body. <code>/convert</code> polls internally for
            up to 8 seconds and returns 200 on success or 202 if still processing.{" "}
            <code>/convert-async</code> always returns 202 immediately.
          </p>
        </Prose>
        <CodeBlock code={convertBody} language="json" filename="Request body" />
      </section>

      {/* Job response */}
      <section id="job-response">
        <Prose>
          <h2>Job object</h2>
          <p>
            Returned by <code>POST /convert</code>, <code>POST /convert-async</code>, and{" "}
            <code>GET /jobs/:id</code>. The <code>pdf_url</code> is a signed, time-unlimited
            download link — no authentication needed to download the file.
          </p>
          <p>
            Job statuses: <code>queued</code> → <code>processing</code> → <code>succeeded</code>{" "}
            or <code>failed</code>. Terminal states do not change.
          </p>
        </Prose>
        <CodeBlock code={jobResponse} language="json" />
      </section>

      {/* Templates */}
      <section id="templates-api">
        <Prose>
          <h2>Templates API</h2>
          <p>
            Templates store reusable HTML layouts. See the{" "}
            <a href="/docs/templates">Templates guide</a> for full details including variable
            syntax, best practices, and batch rendering.
          </p>
        </Prose>
        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">POST /templates — request body</p>
            <CodeBlock code={templateBody} language="json" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Response (HTML excluded from list endpoints)</p>
            <CodeBlock code={templateResponse} language="json" />
          </div>
        </div>
      </section>

      {/* Webhooks */}
      <section id="webhooks">
        <Prose>
          <h2>Webhooks</h2>
          <p>
            Register webhook endpoints to receive <code>job.completed</code> and{" "}
            <code>job.failed</code> events. All payloads are signed with HMAC-SHA256 using a
            per-webhook <code>secret</code> that is returned <strong>only at creation</strong> — store
            it securely. The secret cannot be recovered after creation; delete and recreate the webhook
            if lost.
          </p>
          <p>
            Webhooks are retried up to 3 times with exponential backoff (1 s, 2 s, 4 s) on non-2xx
            responses or connection errors.
          </p>
        </Prose>
        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">POST /webhooks — request body</p>
            <CodeBlock code={webhookBody} language="json" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Response (save the secret now)</p>
            <CodeBlock code={webhookCreateResponse} language="json" />
          </div>
        </div>

        <Prose><h3 id="webhook-payloads">Webhook payloads</h3></Prose>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">job.completed</p>
            <CodeBlock code={webhookPayload} language="json" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">job.failed</p>
            <CodeBlock code={webhookFailPayload} language="json" />
          </div>
        </div>

        <Prose><h3 id="webhook-verification">Verifying signatures</h3>
          <p>
            Always verify the <code>X-Rendr-Signature</code> header before processing a webhook.
            Compute <code>sha256=HMAC(secret, rawBody)</code> and compare with
            <code>crypto.timingSafeEqual</code> to prevent timing attacks.
          </p>
        </Prose>
        <CodeTabs
          tabs={[
            { label: "Node.js", code: webhookVerifyNode, language: "javascript" },
            { label: "Python", code: webhookVerifyPython, language: "python" },
          ]}
        />
      </section>

      {/* waitForSelector */}
      <section id="wait-for-selector">
        <Prose>
          <h2>waitForSelector</h2>
          <p>
            Pass <code>options.waitForSelector</code> with a CSS selector string. Rendr waits up to
            10 seconds for that selector to appear in the DOM before capturing the PDF. More reliable
            than a fixed <code>waitFor</code> delay for pages with async JavaScript rendering.
          </p>
          <p>
            Example: <code>{'"waitForSelector": "#chart-loaded"'}</code> — waits until an element
            with id <code>chart-loaded</code> is present.
          </p>
        </Prose>
      </section>

      {/* filename */}
      <section id="filename">
        <Prose>
          <h2>Custom filename</h2>
          <p>
            Set <code>filename</code> at the top level (not inside <code>options</code>) to control
            the download filename in the <code>Content-Disposition</code> header. Only alphanumeric
            characters, dots, hyphens, and underscores are allowed. A <code>.pdf</code> extension
            is appended automatically if missing.
          </p>
          <p>
            Example: <code>{'"filename": "invoice-42.pdf"'}</code>
          </p>
        </Prose>
      </section>

      {/* Custom headers */}
      <section id="custom-headers">
        <Prose>
          <h2>Custom HTTP headers</h2>
          <p>
            When using <code>type: "url"</code>, pass <code>input.headers</code> to include custom
            HTTP headers in the request to the target URL. Useful for passing authentication tokens,
            cookies, or other credentials to render pages behind auth.
          </p>
          <p>
            Max 20 headers. Dangerous headers (<code>Host</code>, <code>Content-Length</code>,{" "}
            <code>Transfer-Encoding</code>, etc.) are blocked. Headers are only allowed when{" "}
            <code>type</code> is <code>"url"</code>.
          </p>
        </Prose>
      </section>

      {/* PDF metadata */}
      <section id="pdf-metadata">
        <Prose>
          <h2>PDF metadata</h2>
          <p>
            Set <code>options.metadata</code> to embed document properties in the PDF. These appear
            in <em>File → Properties</em> in PDF viewers. All fields are optional.
          </p>
          <ul>
            <li><code>title</code> — document title (max 500 chars)</li>
            <li><code>author</code> — author name (max 500 chars)</li>
            <li><code>subject</code> — document subject (max 500 chars)</li>
            <li><code>keywords</code> — comma-separated keywords (max 1000 chars)</li>
          </ul>
        </Prose>
      </section>

      {/* Watermark */}
      <section id="watermark">
        <Prose>
          <h2>Watermark</h2>
          <p>
            Add a text watermark overlaid on every page. Pass <code>options.watermark</code> with
            at minimum a <code>text</code> field.
          </p>
          <ul>
            <li><code>text</code> — watermark text (required, max 200 chars)</li>
            <li><code>color</code> — CSS color (default: <code>"gray"</code>)</li>
            <li><code>opacity</code> — 0–1 (default: <code>0.15</code>)</li>
            <li><code>fontSize</code> — pixels, 8–200 (default: <code>72</code>)</li>
            <li><code>rotation</code> — degrees, -360–360 (default: <code>-45</code>)</li>
          </ul>
        </Prose>
      </section>

      {/* Per-job webhook */}
      <section id="per-job-webhook">
        <Prose>
          <h2>Per-job webhook</h2>
          <p>
            Pass <code>webhook_url</code> at the top level to receive a webhook notification for
            this specific job — both on success (<code>job.completed</code>) and failure
            (<code>job.failed</code>). The payload is identical to registered webhooks and is signed
            with the application secret. This is useful for one-off notifications without setting up
            a permanent webhook endpoint.
          </p>
          <p>
            The URL is SSRF-guarded — private/internal addresses are blocked.
          </p>
        </Prose>
      </section>

      {/* Usage */}
      <section id="usage">
        <Prose>
          <h2>GET /usage</h2>
          <p>Returns render counts for the authenticated API key.</p>
        </Prose>
        <CodeBlock code={usageResponse} language="json" />
      </section>

      {/* Rate limiting */}
      <section id="rate-limits">
        <Prose>
          <h2>Rate limiting</h2>
          <p>
            60 requests per API key per minute by default (configurable via the{" "}
            <code>API_RATE_LIMIT_PER_MINUTE</code> environment variable). When exceeded, the API
            returns HTTP 429 with a <code>Retry-After: 60</code> header. The rate limiter is
            in-memory and per-process — if you run multiple instances, use Redis or a shared store.
          </p>
        </Prose>
      </section>

      {/* Idempotency */}
      <section id="idempotency">
        <Prose>
          <h2>Idempotency</h2>
          <p>
            Pass an <code>idempotency_key</code> string in the request body (or an{" "}
            <code>Idempotency-Key</code> HTTP header) on POST <code>/convert</code> and{" "}
            <code>/convert-async</code>. If a job with the same key already exists for your API key,
            the existing job object is returned instead of creating a new render. Use this for safe
            retries — e.g. set the key to <code>invoice-{"{id}"}</code> to ensure each invoice is
            rendered at most once.
          </p>
        </Prose>
      </section>

      {/* Errors */}
      <section id="errors">
        <Prose>
          <h2>Error codes</h2>
          <p>
            All errors return a JSON body with <code>error.code</code> and{" "}
            <code>error.message</code>. Check the HTTP status first, then the code for
            programmatic handling.
          </p>
        </Prose>
        <div className="overflow-hidden rounded-xl border border-border mb-4">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">HTTP</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {errors.map((e) => (
                <tr key={e.code} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{e.code}</td>
                  <td className="px-4 py-2.5 text-xs font-semibold">{e.status}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock code={errorResponse} language="json" />
      </section>
    </div>
  );
}
