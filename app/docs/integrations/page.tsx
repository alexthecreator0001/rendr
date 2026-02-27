import type { Metadata } from "next";
import { Prose } from "@/components/docs/prose";
import { CodeBlock } from "@/components/docs/code-block";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Integrations — Rendr Docs" };

const BASE = "https://rendrpdf.com/api/v1";

// ── Code examples ──────────────────────────────────────────────────────────────

const zapierTriggerPayload = `// Rendr sends this JSON to your Zapier "Catch Hook" URL
// when a PDF job completes (via webhook):
{
  "event": "job.completed",
  "job_id": "cm7abc123...",
  "status": "succeeded",
  "pdf_url": "${BASE}/files/Xt7mK2nP...",
  "created_at": "2026-02-22T10:00:00.000Z"
}`;

const zapierActionBody = `// Zapier sends this to Rendr via "Webhooks by Zapier" action:
// POST ${BASE}/convert-async
// Headers:
//   Authorization: Bearer rk_live_YOUR_KEY
//   Content-Type: application/json

{
  "input": {
    "type": "url",
    "content": "https://your-app.com/invoices/123"
  },
  "options": {
    "format": "A4",
    "margin": { "top": "15mm", "bottom": "15mm" }
  },
  "webhook_url": "https://hooks.zapier.com/hooks/catch/12345/abcdef/"
}`;

const makeTriggerModule = `// Make "Webhooks" module receives this JSON from Rendr:
{
  "event": "job.completed",
  "job_id": "cm7abc123...",
  "status": "succeeded",
  "pdf_url": "${BASE}/files/Xt7mK2nP...",
  "created_at": "2026-02-22T10:00:00.000Z"
}`;

const makeActionModule = `// Make "HTTP" module sends this to Rendr:
// POST ${BASE}/convert-async
// Headers:
//   Authorization: Bearer rk_live_YOUR_KEY
//   Content-Type: application/json

{
  "input": {
    "type": "html",
    "content": "<h1>Report for {{customer}}</h1><p>Generated on {{date}}</p>"
  },
  "variables": {
    "customer": "Acme Corp",
    "date": "2026-02-22"
  },
  "webhook_url": "https://hook.eu2.make.com/abc123..."
}`;

const genericWebhookSetup = `// 1. Register a webhook in Rendr (one-time):
// POST ${BASE}/webhooks
// Headers: Authorization: Bearer rk_live_YOUR_KEY

{
  "url": "https://your-platform.com/hooks/rendr",
  "events": ["job.completed", "job.failed"]
}

// Response — save the secret for signature verification:
// { "id": "wh_abc...", "secret": "whsec_Xt7mK2nP..." }`;

const genericRenderRequest = `// 2. Trigger a render from any platform:
// POST ${BASE}/convert-async
// Headers:
//   Authorization: Bearer rk_live_YOUR_KEY
//   Content-Type: application/json

{
  "input": {
    "type": "url",
    "content": "https://your-app.com/reports/quarterly"
  },
  "options": {
    "format": "A4",
    "printBackground": true
  },
  "filename": "quarterly-report.pdf",
  "webhook_url": "https://your-platform.com/hooks/rendr"
}`;

// ── Page ────────────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  return (
    <div className="max-w-4xl space-y-14">
      {/* Header */}
      <div>
        <Badge variant="outline" className="mb-4 rounded-full text-xs">Integrations</Badge>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Connect Rendr to 5,000+ Apps</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
          Rendr&apos;s webhook API works out of the box with <strong>Zapier</strong>, <strong>Make</strong> (Integromat),
          and any platform that supports HTTP webhooks. No custom integration needed &mdash; just point your
          automation tool at the Rendr API.
        </p>
      </div>

      {/* How it works */}
      <section id="how-it-works">
        <Prose>
          <h2>How it works</h2>
          <p>
            The integration pattern is the same for every platform:
          </p>
          <ol>
            <li><strong>Trigger a render</strong> &mdash; your automation sends a POST request to <code>/convert-async</code> with your API key</li>
            <li><strong>Rendr processes it</strong> &mdash; the PDF is generated in the background (usually 2&ndash;10 seconds)</li>
            <li><strong>Get notified</strong> &mdash; Rendr sends a webhook to your automation with the <code>pdf_url</code></li>
            <li><strong>Do something with the PDF</strong> &mdash; email it, save to Google Drive, attach to a CRM record, etc.</li>
          </ol>
          <p>
            You can use <strong>registered webhooks</strong> (permanent, set up once) or <strong>per-job <code>webhook_url</code></strong> (passed in each request).
            Per-job webhooks are ideal for automation platforms because each request gets its own callback URL.
          </p>
        </Prose>
      </section>

      {/* ── Zapier ────────────────────────────────────────────────────────────── */}
      <section id="zapier">
        <Prose>
          <h2>Zapier</h2>
          <p>
            Zapier connects Rendr to 6,000+ apps using two building blocks:
            <strong> Webhooks by Zapier</strong> (to trigger renders) and <strong>Catch Hook</strong> (to receive results).
          </p>
          <h3>Option A: Trigger Rendr from Zapier</h3>
          <p>
            Use this when an event in another app (new Shopify order, new Google Sheets row, etc.) should generate a PDF.
          </p>
          <ol>
            <li>Create a new Zap. Set your <strong>trigger</strong> to whatever event starts the flow (e.g. &ldquo;New Row in Google Sheets&rdquo;)</li>
            <li>Add an <strong>action</strong> step &rarr; choose <strong>&ldquo;Webhooks by Zapier&rdquo;</strong> &rarr; <strong>&ldquo;Custom Request&rdquo;</strong></li>
            <li>Configure the request:
              <ul>
                <li><strong>Method:</strong> POST</li>
                <li><strong>URL:</strong> <code>{BASE}/convert-async</code></li>
                <li><strong>Headers:</strong> <code>Authorization: Bearer rk_live_YOUR_KEY</code> and <code>Content-Type: application/json</code></li>
                <li><strong>Body:</strong> your render request JSON (see example below)</li>
              </ul>
            </li>
            <li>In the body, set <code>webhook_url</code> to a <strong>Catch Hook</strong> URL from a second Zap (see Option B) to chain the result</li>
            <li>Test the step &mdash; you should get a 202 response with a <code>job_id</code></li>
          </ol>
        </Prose>
        <CodeBlock code={zapierActionBody} language="json" filename="Zapier action → Rendr" />

        <Prose>
          <h3>Option B: Receive Rendr results in Zapier</h3>
          <p>
            Use a <strong>&ldquo;Catch Hook&rdquo;</strong> trigger to receive the PDF URL when the render completes.
          </p>
          <ol>
            <li>Create a new Zap with trigger <strong>&ldquo;Webhooks by Zapier&rdquo;</strong> &rarr; <strong>&ldquo;Catch Hook&rdquo;</strong></li>
            <li>Copy the Catch Hook URL (e.g. <code>https://hooks.zapier.com/hooks/catch/12345/abcdef/</code>)</li>
            <li>Use this URL as the <code>webhook_url</code> in your render request (Option A above), <em>or</em> register it as a permanent webhook in Rendr</li>
            <li>When Rendr finishes, it POSTs the job result to your Catch Hook &mdash; including <code>pdf_url</code></li>
            <li>Add downstream actions: email the PDF, upload to Google Drive, attach to a HubSpot deal, etc.</li>
          </ol>
        </Prose>
        <CodeBlock code={zapierTriggerPayload} language="json" filename="Rendr → Zapier Catch Hook" />
      </section>

      {/* ── Make ──────────────────────────────────────────────────────────────── */}
      <section id="make">
        <Prose>
          <h2>Make (Integromat)</h2>
          <p>
            Make uses <strong>HTTP modules</strong> and <strong>Webhooks modules</strong> for the same pattern.
          </p>
          <h3>Option A: Trigger Rendr from Make</h3>
          <ol>
            <li>Create a new scenario. Add your trigger module (e.g. &ldquo;Watch New Rows&rdquo; in Google Sheets)</li>
            <li>Add an <strong>HTTP &rarr; Make a request</strong> module</li>
            <li>Configure:
              <ul>
                <li><strong>URL:</strong> <code>{BASE}/convert-async</code></li>
                <li><strong>Method:</strong> POST</li>
                <li><strong>Headers:</strong> <code>Authorization: Bearer rk_live_YOUR_KEY</code> and <code>Content-Type: application/json</code></li>
                <li><strong>Body type:</strong> Raw &rarr; JSON</li>
                <li><strong>Request content:</strong> your render JSON (use Make variables to fill in dynamic data)</li>
              </ul>
            </li>
            <li>Set <code>webhook_url</code> to your Make Webhooks URL (see Option B) to receive the result</li>
          </ol>
        </Prose>
        <CodeBlock code={makeActionModule} language="json" filename="Make HTTP module → Rendr" />

        <Prose>
          <h3>Option B: Receive Rendr results in Make</h3>
          <ol>
            <li>Add a <strong>Webhooks &rarr; Custom webhook</strong> module as the trigger of a new scenario (or chain it)</li>
            <li>Copy the webhook URL that Make generates</li>
            <li>Use this URL as <code>webhook_url</code> in your render requests</li>
            <li>Make receives the <code>pdf_url</code> when the job completes &mdash; route it to email, cloud storage, CRM, etc.</li>
          </ol>
        </Prose>
        <CodeBlock code={makeTriggerModule} language="json" filename="Rendr → Make webhook" />
      </section>

      {/* ── Generic webhooks ──────────────────────────────────────────────────── */}
      <section id="generic">
        <Prose>
          <h2>Generic webhooks</h2>
          <p>
            Any platform that can send HTTP requests and receive webhooks (n8n, Pipedream, Power Automate, custom backends)
            works with Rendr. The pattern is always:
          </p>
          <ol>
            <li><strong>Register a webhook</strong> (optional &mdash; you can use per-job <code>webhook_url</code> instead)</li>
            <li><strong>POST to <code>/convert-async</code></strong> with your API key and PDF options</li>
            <li><strong>Receive the result</strong> at your webhook endpoint</li>
            <li><strong>Verify the signature</strong> using the <code>X-Rendr-Signature</code> header (see <a href="/docs/api#webhook-verification">webhook verification docs</a>)</li>
          </ol>
        </Prose>
        <div className="space-y-3">
          <CodeBlock code={genericWebhookSetup} language="json" filename="Step 1: Register webhook" />
          <CodeBlock code={genericRenderRequest} language="json" filename="Step 2: Trigger render" />
        </div>
      </section>

      {/* ── Tips ──────────────────────────────────────────────────────────────── */}
      <section id="tips">
        <Prose>
          <h2>Tips</h2>
          <ul>
            <li><strong>Use <code>/convert-async</code></strong> for automations &mdash; it returns immediately with a 202, so your Zap/scenario never times out</li>
            <li><strong>Use <code>webhook_url</code></strong> per request instead of registered webhooks if your automation platform provides unique callback URLs per execution</li>
            <li><strong>Idempotency</strong> &mdash; pass an <code>idempotency_key</code> (e.g. <code>invoice-123</code>) to prevent duplicate renders on retries</li>
            <li><strong>Templates</strong> &mdash; create reusable HTML templates via the API or dashboard, then render them with <code>type: &ldquo;template&rdquo;</code> and pass <code>variables</code> for dynamic data</li>
            <li><strong>Signature verification</strong> &mdash; always verify <code>X-Rendr-Signature</code> on incoming webhooks. See the <a href="/docs/api#webhook-verification">verification guide</a></li>
          </ul>
        </Prose>
      </section>
    </div>
  );
}
