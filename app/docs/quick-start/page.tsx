import { CodeTabs } from "@/components/docs/code-tabs";
import { Prose } from "@/components/docs/prose";
import { CodeBlock } from "@/components/docs/code-block";
import { Badge } from "@/components/ui/badge";

const BASE = "https://rendrpdf.com";

const curlSync = `curl -X POST ${BASE}/api/v1/convert \\
  -H "Authorization: Bearer rk_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": {
      "type": "html",
      "content": "<h1>Hello {{name}}</h1>",
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
      content: "<h1>Hello {{name}}</h1>",
      variables: { name: "World" },
    },
  }),
});

const job = await res.json();

if (job.status === "succeeded") {
  const pdf = await fetch(job.pdf_url);
  const buffer = await pdf.arrayBuffer();
  require("fs").writeFileSync("output.pdf", Buffer.from(buffer));
}`;

const pythonSync = `import requests

response = requests.post(
    "${BASE}/api/v1/convert",
    headers={
        "Authorization": "Bearer rk_live_YOUR_KEY",
        "Content-Type": "application/json",
    },
    json={
        "input": {
            "type": "html",
            "content": "<h1>Hello {{name}}</h1>",
            "variables": {"name": "World"},
        }
    },
)

job = response.json()

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
            "content" => "<h1>Hello {{name}}</h1>",
            "variables" => ["name" => "World"],
        ],
    ]),
]);
$body = curl_exec($ch);
$job = json_decode($body, true);

if ($job["status"] === "succeeded") {
    file_put_contents("output.pdf", file_get_contents($job["pdf_url"]));
}`;

const curlAsync = `# 1. Enqueue the job
curl -X POST ${BASE}/api/v1/convert-async \\
  -H "Authorization: Bearer rk_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"input":{"type":"html","content":"<h1>Hello</h1>"}}'
# → { "job_id": "abc...", "status": "queued", "status_url": "..." }

# 2. Poll until done
curl -H "Authorization: Bearer rk_live_YOUR_KEY" \\
  ${BASE}/api/v1/jobs/JOB_ID`;

const responseExample = `{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "succeeded",
  "pdf_url": "${BASE}/api/v1/files/Xt7mK2...",
  "status_url": "${BASE}/api/v1/jobs/550e8400-e29b-41d4-a716-446655440000"
}`;

export default function QuickStartPage() {
  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <Badge variant="outline" className="mb-4 rounded-full text-xs">Quick start</Badge>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Make your first render</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Get your first PDF in under 5 minutes. You&apos;ll need an API key from the{" "}
          <a href="/app/api-keys" className="text-primary hover:underline">dashboard</a>.
        </p>
      </div>

      <section>
        <Prose>
          <h2>1. Get an API key</h2>
          <p>
            Go to <a href="/app/api-keys">Dashboard → API Keys</a> and click{" "}
            <strong>New key</strong>. Copy the key — it&apos;s only shown once.
          </p>
          <h2>2. Send your first render</h2>
          <p>
            Use <code>/api/v1/convert</code> for synchronous rendering (waits up to 8
            seconds). For large documents, use <code>/convert-async</code> and poll.
          </p>
        </Prose>
      </section>

      <CodeTabs
        tabs={[
          { label: "curl", code: curlSync, language: "bash" },
          { label: "Node.js", code: nodeSync, language: "javascript" },
          { label: "Python", code: pythonSync, language: "python" },
          { label: "PHP", code: phpSync, language: "php" },
        ]}
      />

      <section>
        <Prose>
          <h2>3. Response</h2>
          <p>
            On success (<code>status: "succeeded"</code>), <code>pdf_url</code> is a
            download link. On timeout, status is <code>"queued"</code> — poll{" "}
            <code>status_url</code> to check progress.
          </p>
        </Prose>
        <CodeBlock code={responseExample} language="json" />
      </section>

      <section>
        <Prose>
          <h2>4. Async workflow</h2>
          <p>
            For large documents or batch processing, use the async endpoint and poll
            separately. Or configure a webhook to receive notifications automatically.
          </p>
        </Prose>
        <CodeTabs
          tabs={[{ label: "curl", code: curlAsync, language: "bash" }]}
        />
      </section>

      <section>
        <Prose>
          <h2>Template variables</h2>
          <p>
            Use <code>{"{{variableName}}"}</code> in your HTML. Pass values in the{" "}
            <code>variables</code> object. Works with <code>type: "html"</code> and{" "}
            <code>type: "template"</code>.
          </p>

          <h2>Next steps</h2>
          <ul>
            <li><a href="/app/templates">Create reusable templates</a></li>
            <li><a href="/app/webhooks">Set up webhooks</a> for async notifications</li>
            <li><a href="/docs/api">Full API reference</a></li>
          </ul>
        </Prose>
      </section>
    </div>
  );
}
