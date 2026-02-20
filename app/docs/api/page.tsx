import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/code-block";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "API Reference",
};

const endpoints = [
  {
    method: "POST",
    path: "/v1/render",
    description: "Create a new render job from a template or inline HTML.",
    auth: true,
  },
  {
    method: "GET",
    path: "/v1/jobs/:id",
    description: "Retrieve the current status and metadata for a job.",
    auth: true,
  },
  {
    method: "GET",
    path: "/v1/jobs/:id/download",
    description: "Get a signed download URL for a completed job's PDF.",
    auth: true,
  },
  {
    method: "GET",
    path: "/v1/jobs",
    description: "List all render jobs in the current workspace.",
    auth: true,
  },
  {
    method: "POST",
    path: "/v1/templates",
    description: "Upload or update an HTML template in the library.",
    auth: true,
  },
  {
    method: "GET",
    path: "/v1/templates",
    description: "List all templates in the current workspace.",
    auth: true,
  },
  {
    method: "DELETE",
    path: "/v1/templates/:id",
    description: "Delete a template. Existing jobs that used it are unaffected.",
    auth: true,
  },
];

const errorSchema = `{
  "error": {
    "code": "template_not_found",
    "message": "No template with ID 'tmpl_xyz' exists in this workspace.",
    "status": 404,
    "request_id": "req_9a3b8c"
  }
}`;

const authExample = `Authorization: Bearer rk_live_a1b2c3d4e5f6g7h8i9j0`;

const methodColors: Record<string, string> = {
  GET: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  POST: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  DELETE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function ApiPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <Badge variant="outline" className="mb-4 rounded-full text-xs">API Reference</Badge>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">API Reference</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Base URL:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            https://api.rendrpdf.com
          </code>
          . All requests must be over HTTPS.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Last updated: Feb 15, 2026 · v1
        </p>
      </div>

      {/* Authentication */}
      <section id="authentication">
        <h2 className="mb-3 text-xl font-semibold">Authentication</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          All endpoints require a Bearer token. Pass your API key in the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Authorization</code>{" "}
          header:
        </p>
        <CodeBlock code={authExample} language="bash" filename="HTTP header" />
        <p className="mt-3 text-sm text-muted-foreground">
          API keys are prefixed with{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">rk_live_</code> for
          production and{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">rk_test_</code> for
          test environments.
        </p>
      </section>

      {/* Endpoints */}
      <section id="endpoints">
        <h2 className="mb-4 text-xl font-semibold">Endpoints</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          {endpoints.map((ep, i) => (
            <div
              key={ep.path}
              className={`flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4 ${i < endpoints.length - 1 ? "border-b border-border" : ""}`}
            >
              <span className={`w-14 shrink-0 rounded px-1.5 py-0.5 text-center font-mono text-[10px] font-semibold ${methodColors[ep.method]}`}>
                {ep.method}
              </span>
              <code className="font-mono text-xs text-foreground">{ep.path}</code>
              <span className="text-xs text-muted-foreground sm:ml-auto">{ep.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Rate limits */}
      <section id="rate-limits">
        <h2 className="mb-3 text-xl font-semibold">Rate limits</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Requests are rate-limited per API key. Exceed the limit and you&apos;ll receive a{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">429 Too Many Requests</code>.
        </p>
        <div className="overflow-hidden rounded-xl border border-border">
          {[
            ["Starter", "60 req/min", "500 renders/month"],
            ["Growth", "300 req/min", "5,000 renders/month"],
            ["Business", "1,000 req/min", "50,000 renders/month"],
          ].map(([plan, rate, renders]) => (
            <div key={plan} className="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0">
              <span className="w-24 text-sm font-medium">{plan}</span>
              <span className="text-sm text-muted-foreground">{rate}</span>
              <span className="ml-auto text-sm text-muted-foreground">{renders}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Error schema */}
      <section id="errors">
        <h2 className="mb-3 text-xl font-semibold">Error handling</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          All errors return a consistent JSON body. Check{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">error.code</code>{" "}
          for programmatic handling.
        </p>
        <CodeBlock code={errorSchema} language="json" filename="Error response schema" />

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          {[
            ["invalid_api_key", "401", "API key is missing, malformed, or revoked."],
            ["template_not_found", "404", "No template with that ID exists."],
            ["rate_limit_exceeded", "429", "You've exceeded your plan's request limit."],
            ["render_failed", "422", "The render job failed. Check variables."],
            ["internal_error", "500", "Something went wrong on our side. Retry after a moment."],
          ].map(([code, status, msg]) => (
            <div key={code as string} className="flex flex-col gap-1 px-4 py-3 border-b border-border last:border-0 sm:flex-row sm:items-center sm:gap-4">
              <code className="font-mono text-xs font-medium text-foreground">{code}</code>
              <Badge variant="outline" className="w-fit text-[10px]">{status}</Badge>
              <span className="text-xs text-muted-foreground sm:ml-auto">{msg}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SDKs diagram */}
      <section id="sdks">
        <h2 className="mb-3 text-xl font-semibold">SDKs</h2>
        {/* intended final asset: SDK logos row (Node, Python, PHP, Ruby) */}
        {/* suggested export format: SVG */}
        {/* exact size: 580×120, aspect: ~5/1 */}
        <ImagePlaceholder
          label="SDK language logos row: Node.js, Python, PHP, Ruby (580×120)"
          aspect="5/1"
          rounded="xl"
          className="w-full"
        />
        <p className="mt-3 text-sm text-muted-foreground">
          Official SDKs for Node.js, Python, PHP, and Ruby. Community SDKs for Go and
          Rust are in progress.
        </p>
      </section>
    </div>
  );
}
