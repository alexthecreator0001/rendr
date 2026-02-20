import type { Metadata } from "next";
import { CodeTabs } from "@/components/docs/code-tabs";
import { CodeBlock } from "@/components/docs/code-block";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Quick Start",
};

const jobResponse = `{
  "id": "job_7f3k2m",
  "status": "queued",
  "template_id": "tmpl_invoice",
  "created_at": "2026-02-20T09:01:00Z",
  "estimated_duration_ms": 900
}`;

const doneResponse = `{
  "id": "job_7f3k2m",
  "status": "done",
  "pages": 2,
  "duration_ms": 843,
  "download_url": "https://storage.rendrpdf.com/jobs/job_7f3k2m/output.pdf?sig=abc123&expires=1740081660",
  "created_at": "2026-02-20T09:01:00Z",
  "completed_at": "2026-02-20T09:01:01Z"
}`;

const webhookPayload = `{
  "event": "job.completed",
  "job": {
    "id": "job_7f3k2m",
    "status": "done",
    "pages": 2,
    "download_url": "https://storage.rendrpdf.com/jobs/job_7f3k2m/output.pdf?sig=abc123"
  },
  "timestamp": "2026-02-20T09:01:01Z"
}`;

export default function QuickStartPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <Badge variant="outline" className="mb-4 rounded-full text-xs">Quick start</Badge>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">
          Make your first render
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          You&apos;ll need an API key from the{" "}
          <a href="/app/api-keys" className="text-primary hover:underline">dashboard</a>.
          The free tier gives you 500 renders/month to start.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Last updated: Feb 10, 2026 · 5 min read
        </p>
      </div>

      {/* Step 1 */}
      <section>
        <h2 className="mb-1 text-lg font-semibold" id="step-1">
          1. Get your API key
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Go to{" "}
          <a href="/app/api-keys" className="text-primary hover:underline">
            Dashboard → API Keys
          </a>{" "}
          and create a new key. Copy it — you won&apos;t see it again.
        </p>
        <CodeBlock
          code="export RENDR_API_KEY=rk_live_your_key_here"
          language="bash"
          filename="terminal"
        />
      </section>

      {/* Step 2 */}
      <section>
        <h2 className="mb-1 text-lg font-semibold" id="step-2">
          2. Create a render job
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          POST to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/v1/render</code>.
          Pass a <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">template_id</code> or an inline HTML string.
        </p>
        <CodeTabs />
      </section>

      {/* Step 3 */}
      <section>
        <h2 className="mb-1 text-lg font-semibold" id="step-3">
          3. Get the result
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          The API returns immediately with a job ID. Poll the job endpoint or wait for a webhook.
        </p>

        <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Initial response (queued)
        </p>
        <CodeBlock code={jobResponse} language="json" filename="Response — 202 Accepted" />

        <p className="mb-2 mt-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          When the job completes
        </p>
        <CodeBlock code={doneResponse} language="json" filename="GET /v1/jobs/:id — 200 OK" />
      </section>

      {/* Step 4 */}
      <section>
        <h2 className="mb-1 text-lg font-semibold" id="webhooks">
          4. (Optional) Set up a webhook
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Instead of polling, register a webhook endpoint in the dashboard and we&apos;ll push a
          signed payload when the job finishes.
        </p>
        <CodeBlock
          code={webhookPayload}
          language="json"
          filename="Webhook payload — job.completed"
        />
        <p className="mt-3 text-sm text-muted-foreground">
          Verify the signature using the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">X-Rendr-Signature</code>{" "}
          header. See the{" "}
          <a href="/docs/api#webhooks" className="text-primary hover:underline">
            webhook verification guide
          </a>.
        </p>
      </section>

      {/* Next steps */}
      <section className="rounded-xl border border-border bg-muted/40 p-6">
        <h2 className="mb-3 text-base font-semibold">What&apos;s next?</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <a href="/docs/api" className="text-primary hover:underline">→ Full API reference</a>
            {" "}— all endpoints, schemas, error codes
          </li>
          <li>
            <a href="/docs/templates" className="text-primary hover:underline">→ Using templates</a>
            {" "}— store and reuse HTML layouts
          </li>
          <li>
            <a href="/app/api-keys" className="text-primary hover:underline">→ Create a production key</a>
            {" "}— separate keys for staging and prod
          </li>
        </ul>
      </section>
    </div>
  );
}
