import type { Metadata } from "next";
import { CodeTabs } from "@/components/docs/code-tabs";
import { Prose } from "@/components/docs/prose";
import { CodeBlock } from "@/components/docs/code-block";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Quick Start — Rendr Docs" };

const BASE = "https://rendrpdf.com";

const curlSync = `curl -X POST ${BASE}/api/v1/convert \\
  -H "Authorization: Bearer rk_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": {
      "type": "html",
      "content": "<h1 style=\\"font-family:sans-serif\\">Hello {{name}}</h1>",
      "variables": { "name": "World" }
    }
  }'`;

const nodeSync = `const res = await fetch("${BASE}/api/v1/convert", {
  method: "POST",
  headers: {
    Authorization: "Bearer rk_live_YOUR_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    input: {
      type: "html",
      content: "<h1 style='font-family:sans-serif'>Hello {{name}}</h1>",
      variables: { name: "World" },
    },
  }),
});

const job = await res.json();
// job.status === "succeeded" → download from job.pdf_url
// job.status === "queued"   → poll job.status_url`;

const pythonSync = `import requests

resp = requests.post(
    "${BASE}/api/v1/convert",
    headers={
        "Authorization": "Bearer rk_live_YOUR_KEY",
        "Content-Type": "application/json",
    },
    json={
        "input": {
            "type": "html",
            "content": "<h1 style='font-family:sans-serif'>Hello {{name}}</h1>",
            "variables": {"name": "World"},
        }
    },
)

job = resp.json()
if job["status"] == "succeeded":
    pdf = requests.get(job["pdf_url"])
    with open("output.pdf", "wb") as f:
        f.write(pdf.content)`;

const phpSync = `<?php
$ch = curl_init("${BASE}/api/v1/convert");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer rk_live_YOUR_KEY",
        "Content-Type: application/json",
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "input" => [
            "type" => "html",
            "content" => "<h1 style='font-family:sans-serif'>Hello {{name}}</h1>",
            "variables" => ["name" => "World"],
        ],
    ]),
]);
$job = json_decode(curl_exec($ch), true);
if ($job["status"] === "succeeded") {
    file_put_contents("output.pdf", file_get_contents($job["pdf_url"]));
}`;

const responseSuccess = `{
  "job_id": "cm7abc123...",
  "status": "succeeded",
  "input_type": "html",
  "pdf_url": "${BASE}/api/v1/files/Xt7mK2nP...",
  "status_url": "${BASE}/api/v1/jobs/cm7abc123...",
  "error": null,
  "created_at": "2026-02-22T10:00:00.000Z",
  "updated_at": "2026-02-22T10:00:01.842Z"
}`;

const responseQueued = `{
  "job_id": "cm7abc123...",
  "status": "queued",
  "pdf_url": null,
  "status_url": "${BASE}/api/v1/jobs/cm7abc123..."
}`;

const curlAsync = `# Step 1 — enqueue
curl -X POST ${BASE}/api/v1/convert-async \\
  -H "Authorization: Bearer rk_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"input":{"type":"html","content":"<h1>Report</h1>"}}'
# → { "job_id": "cm7abc123", "status": "queued", "status_url": "..." }

# Step 2 — poll until succeeded
curl -H "Authorization: Bearer rk_live_YOUR_KEY" \\
  ${BASE}/api/v1/jobs/cm7abc123`;

const templateExample = `# 1. Create the template (once)
curl -X POST ${BASE}/api/v1/templates \\
  -H "Authorization: Bearer rk_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Invoice",
    "html": "<!DOCTYPE html><html><body><h1>Invoice #{{invoice_number}}</h1><p>Bill to: {{client_name}}</p></body></html>"
  }'
# → { "id": "tmpl_clxyz...", "name": "Invoice", ... }

# 2. Render with variables (each time)
curl -X POST ${BASE}/api/v1/convert \\
  -H "Authorization: Bearer rk_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": {
      "type": "template",
      "template_id": "tmpl_clxyz...",
      "variables": {
        "invoice_number": "INV-0042",
        "client_name": "Acme Corp"
      }
    }
  }'`;

const pdfOptions = `{
  "input": { "type": "html", "content": "<h1>Doc</h1>" },
  "options": {
    "format": "A4",          // A4 | Letter | Legal | Tabloid | A3 | A5 | A6
    "landscape": false,
    "printBackground": true,
    "margin": {
      "top": "20mm", "right": "15mm",
      "bottom": "20mm", "left": "15mm"
    },
    "displayHeaderFooter": true,
    "headerTemplate": "<div style='font-size:9px;padding:0 20px;width:100%;text-align:right'><span class='pageNumber'></span>/<span class='totalPages'></span></div>",
    "footerTemplate": "<div style='font-size:9px;padding:0 20px;width:100%;color:#999'><span class='title'></span></div>",
    "scale": 1,              // 0.1–2
    "waitFor": 0,            // seconds to wait for JS (0–10)
    "tagged": false,         // PDF/UA accessibility tags
    "outline": false         // embed document outline
  }
}`;

export default function QuickStartPage() {
  return (
    <div className="max-w-3xl space-y-12">
      <div>
        <Badge variant="outline" className="mb-4 rounded-full text-xs">Quick start</Badge>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Make your first render</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Get a PDF in under 5 minutes. You need an API key — create one in{" "}
          <a href="/app/api-keys" className="text-primary hover:underline">Dashboard → API Keys</a>.
        </p>
      </div>

      {/* Step 1 */}
      <section>
        <Prose>
          <h2>1. Get an API key</h2>
          <p>
            Go to <a href="/app/api-keys">Dashboard → API Keys</a> and click <strong>New key</strong>.
            Give it a name, copy the key — it is shown <strong>only once</strong>. The key starts
            with <code>rk_live_</code>. Only a SHA-256 hash is stored; the original cannot be recovered.
          </p>
        </Prose>
      </section>

      {/* Step 2 */}
      <section>
        <Prose>
          <h2>2. Render HTML to PDF (sync)</h2>
          <p>
            <code>POST /api/v1/convert</code> renders your HTML and waits up to 8 seconds for
            the result. On success it returns <code>status: "succeeded"</code> and a{" "}
            <code>pdf_url</code> you can download directly.
          </p>
        </Prose>
        <CodeTabs
          tabs={[
            { label: "curl", code: curlSync, language: "bash" },
            { label: "Node.js", code: nodeSync, language: "javascript" },
            { label: "Python", code: pythonSync, language: "python" },
            { label: "PHP", code: phpSync, language: "php" },
          ]}
        />
      </section>

      {/* Step 3 */}
      <section>
        <Prose>
          <h2>3. Read the response</h2>
          <p>
            If rendering completes within 8 s, you get <code>status: "succeeded"</code> with a
            signed download URL. If the document takes longer, you get <code>status: "queued"</code>{" "}
            — poll <code>status_url</code> until it transitions.
          </p>
        </Prose>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Succeeded (200)</p>
            <CodeBlock code={responseSuccess} language="json" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Still queued (202)</p>
            <CodeBlock code={responseQueued} language="json" />
          </div>
        </div>
      </section>

      {/* Step 4 — async */}
      <section>
        <Prose>
          <h2>4. Async workflow (large documents)</h2>
          <p>
            Use <code>POST /api/v1/convert-async</code> to enqueue without waiting. It returns a{" "}
            <code>job_id</code> and <code>status_url</code> immediately (HTTP 202). Poll{" "}
            <code>GET /api/v1/jobs/:id</code> or configure a{" "}
            <a href="/app/webhooks">webhook</a> to be notified automatically.
          </p>
        </Prose>
        <CodeTabs tabs={[{ label: "curl", code: curlAsync, language: "bash" }]} />
      </section>

      {/* Templates */}
      <section>
        <Prose>
          <h2>5. Templates and variables</h2>
          <p>
            Store reusable HTML once, render many times. Use <code>{"{{variable_name}}"}</code>{" "}
            placeholders in your HTML — pass values in the <code>variables</code> object when
            rendering. Templates can be created via the API or in the{" "}
            <a href="/app/templates">dashboard</a>.
          </p>
        </Prose>
        <CodeTabs tabs={[{ label: "curl", code: templateExample, language: "bash" }]} />
      </section>

      {/* PDF options */}
      <section>
        <Prose>
          <h2>6. PDF options</h2>
          <p>
            Pass an <code>options</code> object to control paper size, margins, orientation,
            page ranges, headers/footers, accessibility tags, and more. All fields are optional —
            defaults are A4, 20 mm margins, portrait.
          </p>
        </Prose>
        <CodeBlock code={pdfOptions} language="json" />
        <Prose>
          <p>
            Use <code>waitFor</code> (seconds) if your page has JavaScript that needs to run before
            capture. Use <code>type: "url"</code> to render any public URL instead of raw HTML.
          </p>
        </Prose>
      </section>

      {/* Next steps */}
      <section>
        <Prose>
          <h2>Next steps</h2>
          <ul>
            <li><a href="/app/templates">Create reusable templates</a> in the dashboard</li>
            <li><a href="/app/webhooks">Set up a webhook</a> for async job notifications</li>
            <li><a href="/app/api-keys">Manage API keys</a> — rotate, revoke, view usage</li>
            <li><a href="/docs/api">Full API reference</a> — every endpoint and field</li>
            <li><a href="/docs/templates">Templates guide</a> — variables, best practices</li>
          </ul>
        </Prose>
      </section>
    </div>
  );
}
