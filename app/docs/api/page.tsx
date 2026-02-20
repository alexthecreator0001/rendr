import { Prose } from "@/components/docs/prose";
import { CodeBlock } from "@/components/docs/code-block";
import { Badge } from "@/components/ui/badge";

const BASE = "https://rendrpdf.com/api/v1";

const convertBody = `{
  "input": {
    "type": "html" | "url" | "template",
    "content": "<h1>Hello {{name}}</h1>",    // for type: html
    "url": "https://example.com/page",        // for type: url
    "template_id": "clxyz123...",             // for type: template
    "variables": { "name": "World" }          // {{var}} substitution
  },
  "options": {
    "format": "A4",
    "margin": {
      "top": "20mm", "bottom": "20mm",
      "left": "15mm", "right": "15mm"
    }
  },
  "idempotency_key": "invoice-1234"
}`;

const jobResponse = `{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "succeeded",
  "input_type": "html",
  "pdf_url": "${BASE}/files/Xt7mK2...",
  "status_url": "${BASE}/jobs/550e8400-...",
  "error": null,
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:02.341Z"
}`;

const errorResponse = `{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Too many requests. Retry after 60 seconds."
  }
}`;

const webhookPayload = `// POST to your endpoint
// X-Rendr-Signature: sha256=<hmac-hex>

{
  "event": "job.completed",
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "succeeded",
  "pdf_url": "${BASE}/files/Xt7mK2..."
}`;

const webhookVerify = `const crypto = require("crypto");

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

// Express example:
app.post("/webhooks/rendr", express.raw({ type: "*/*" }), (req, res) => {
  const sig = req.headers["x-rendr-signature"];
  if (!verifySignature(process.env.WEBHOOK_SECRET, req.body, sig)) {
    return res.status(401).end();
  }
  const event = JSON.parse(req.body);
  res.status(200).end();
});`;

const endpoints = [
  { method: "GET", path: "/health", auth: false, description: "Health check. Returns { ok: true, db: true }." },
  { method: "POST", path: "/convert", auth: true, description: "Sync render. Waits up to 8s. Returns 200 or 202." },
  { method: "POST", path: "/convert-async", auth: true, description: "Async render. Always returns 202 immediately." },
  { method: "GET", path: "/jobs/:id", auth: true, description: "Poll job status and get pdf_url when succeeded." },
  { method: "GET", path: "/files/:token", auth: false, description: "Download rendered PDF. Token is the credential." },
  { method: "GET", path: "/templates", auth: true, description: "List your HTML templates." },
  { method: "POST", path: "/templates", auth: true, description: "Create a template with name and html." },
  { method: "GET", path: "/templates/:id", auth: true, description: "Get a template including its HTML." },
  { method: "PUT", path: "/templates/:id", auth: true, description: "Update template name and/or HTML." },
  { method: "DELETE", path: "/templates/:id", auth: true, description: "Delete a template. Returns 204." },
  { method: "GET", path: "/webhooks", auth: true, description: "List webhooks (secret not returned)." },
  { method: "POST", path: "/webhooks", auth: true, description: "Create webhook. Secret returned only at creation." },
  { method: "GET", path: "/webhooks/:id", auth: true, description: "Get webhook (no secret)." },
  { method: "PUT", path: "/webhooks/:id", auth: true, description: "Update URL, events, or enabled." },
  { method: "DELETE", path: "/webhooks/:id", auth: true, description: "Delete webhook. Returns 204." },
  { method: "GET", path: "/usage", auth: true, description: "Returns { today, last_7_days, last_30_days } counts." },
];

const methodColors: Record<string, string> = {
  GET: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  POST: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  PUT: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  DELETE: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const errors = [
  { code: "unauthorized", status: 401, description: "Missing or invalid API key." },
  { code: "api_key_revoked", status: 401, description: "The API key has been revoked." },
  { code: "rate_limit_exceeded", status: 429, description: "Too many requests. Retry after 60 seconds." },
  { code: "validation_error", status: 422, description: "Request body failed validation." },
  { code: "not_found", status: 404, description: "Resource not found or not owned by you." },
  { code: "render_failed", status: 422, description: "Playwright failed to render the PDF." },
  { code: "internal_error", status: 500, description: "Something went wrong on our end." },
];

export default function ApiReferencePage() {
  return (
    <div className="max-w-4xl space-y-12">
      <div>
        <Badge variant="outline" className="mb-4 rounded-full text-xs">API Reference</Badge>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">API Reference</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Base URL: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{BASE}</code>
        </p>
      </div>

      <section id="authentication">
        <Prose>
          <h2>Authentication</h2>
          <p>Pass your API key in the <code>Authorization</code> header:</p>
        </Prose>
        <CodeBlock code={`Authorization: Bearer rk_live_YOUR_API_KEY`} language="http" />
        <Prose>
          <p>
            API keys are created in the <a href="/app/api-keys">dashboard</a>.
            The plaintext key is only shown at creation time. SHA-256 hash is stored; the original cannot be recovered.
          </p>
        </Prose>
      </section>

      <section id="endpoints">
        <Prose><h2>Endpoints</h2></Prose>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Method</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Path</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">Auth</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {endpoints.map((ep) => (
                <tr key={`${ep.method}-${ep.path}`} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${methodColors[ep.method]}`}>
                      {ep.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{ep.path}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{ep.auth ? "Required" : "None"}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{ep.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="convert-body">
        <Prose><h2>Request body (POST /convert, POST /convert-async)</h2></Prose>
        <CodeBlock code={convertBody} language="json" />
      </section>

      <section id="job-response">
        <Prose><h2>Job response shape</h2></Prose>
        <CodeBlock code={jobResponse} language="json" />
      </section>

      <section id="errors">
        <Prose><h2>Error codes</h2></Prose>
        <div className="overflow-hidden rounded-xl border border-border mb-6">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Code</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">HTTP</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {errors.map((e) => (
                <tr key={e.code} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{e.code}</td>
                  <td className="px-4 py-3 text-xs">{e.status}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock code={errorResponse} language="json" />
      </section>

      <section id="rate-limits">
        <Prose>
          <h2>Rate limiting</h2>
          <p>
            60 requests per API key per minute by default (configurable via{" "}
            <code>API_RATE_LIMIT_PER_MINUTE</code>). Returns 429 with{" "}
            <code>Retry-After: 60</code> on limit hit. The rate limiter is in-memory
            per-process — use Redis for multi-instance deployments.
          </p>
          <h2>Idempotency</h2>
          <p>
            Pass an <code>Idempotency-Key</code> header (or <code>idempotency_key</code>{" "}
            in the body) on POST /convert requests. Duplicate requests return the
            existing job instead of creating a new one.
          </p>
          <h2>Webhooks</h2>
          <p>
            Configure webhooks to receive <code>job.completed</code> and{" "}
            <code>job.failed</code> events. All payloads are HMAC-SHA256 signed.
          </p>
        </Prose>
        <CodeBlock code={webhookPayload} language="json" />
        <Prose><h3>Verifying signatures</h3></Prose>
        <CodeBlock code={webhookVerify} language="javascript" />
      </section>
    </div>
  );
}
