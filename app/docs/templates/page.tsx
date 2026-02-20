import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { CodeBlock } from "@/components/docs/code-block";

export const metadata: Metadata = {
  title: "Templates",
};

const uploadExample = `curl -X POST https://api.rendrpdf.com/v1/templates \\
  -H "Authorization: Bearer rk_live_your_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "id": "tmpl_invoice",
    "name": "Acme Internal Invoice",
    "html": "<html>...</html>",
    "variables": ["client_name", "invoice_number", "due_date"]
  }'`;

export default function TemplatesDocsPage() {
  return (
    <div className="space-y-10">
      <div>
        <Badge variant="outline" className="mb-4 rounded-full text-xs">Templates</Badge>
        <h1 className="text-3xl font-extrabold tracking-[-0.03em]">
          Using templates
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Store reusable HTML layouts in Rendr&apos;s template library. Render any of
          them with a single API call and a variables object.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Last updated: Feb 8, 2026
        </p>
      </div>

      {/* Diagram */}
      {/* intended final asset: template lifecycle diagram (upload → store → render → PDF) */}
      {/* suggested export format: SVG */}
      {/* exact size: 600×200, aspect: 3/1 */}
      <ImagePlaceholder
        label="Template lifecycle diagram: Upload → Store → Render with variables → PDF output (600×200)"
        aspect="3/1"
        rounded="xl"
        className="w-full"
      />

      <section>
        <h2 className="mb-3 text-xl font-semibold" id="uploading">Uploading a template</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          POST to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">/v1/templates</code> with
          your HTML and a list of variable names.
        </p>
        <CodeBlock code={uploadExample} language="bash" filename="Upload template" />
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold" id="variables">Variables</h2>
        <p className="text-sm text-muted-foreground">
          Use{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{"{{variable_name}}"}</code>{" "}
          syntax in your HTML. Variables are replaced at render time using the values
          you pass in the job request.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold" id="fonts">Custom fonts</h2>
        <p className="text-sm text-muted-foreground">
          Upload a TTF or WOFF2 file and reference it in your template&apos;s{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{"<style>"}</code>{" "}
          block using the font family name you registered. We subset and embed it
          automatically.
        </p>
      </section>
    </div>
  );
}
