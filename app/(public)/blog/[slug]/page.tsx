import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CopyPromptButton } from "./copy-prompt-button";

// ── Supported slugs ───────────────────────────────────────────────────────────

export function generateStaticParams() {
  return [{ slug: "how-to-create-templates" }];
}

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "how-to-create-templates") {
    return {
      title: "How to Create PDF Templates with AI | Rendr Blog",
      description: "A step-by-step guide to building Rendr HTML templates using ChatGPT — including a ready-made prompt.",
    };
  }
  return { title: "Blog | Rendr" };
}

// ── Copy button (client) ──────────────────────────────────────────────────────

const CHATGPT_PROMPT = `You are an expert HTML/CSS developer specializing in print-ready PDF documents. Create a professional HTML template for the following document type: [DOCUMENT TYPE — e.g. "invoice", "receipt", "certificate of completion"].

Requirements:
- Use only inline CSS (no external stylesheets, no Google Fonts, no CDN links)
- Use a web-safe font stack: font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif
- Use {{double_curly_brace}} placeholders for all dynamic values (e.g. {{client_name}}, {{invoice_date}}, {{total}})
- Make it A4 sized: max-width 794px, with padding 48px
- Use a clean, professional design with subtle borders and a clear visual hierarchy
- Include a complete list of all {{variable}} names used at the bottom as an HTML comment: <!-- Variables: var1, var2, var3 -->
- Do NOT use JavaScript, images from external URLs, or any external resources
- The HTML must be fully self-contained in a single file
- Test mentally that every {{variable}} has a clear, predictable meaning

Output only the raw HTML — no markdown code fences, no explanation. Start with <!DOCTYPE html>.`;

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (slug !== "how-to-create-templates") {
    notFound();
  }

  return (
    <Section size="lg">
      <Container className="max-w-3xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="outline" className="rounded-full text-xs">Guide</Badge>
            <span className="text-xs text-muted-foreground">Feb 22, 2026</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-[-0.03em] leading-tight mb-4">
            How to create PDF templates with AI
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Rendr templates are just HTML files with <code className="font-mono text-sm bg-muted px-1.5 rounded">{"{{variable}}"}</code> placeholders. You can write them by hand — or let an AI do the heavy lifting in seconds.
          </p>
        </div>

        {/* Body */}
        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-[15px] leading-relaxed">

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">What are Rendr templates?</h2>
            <p>
              A Rendr template is a plain HTML file that uses <code className="font-mono text-sm bg-muted px-1.5 rounded">{"{{double_curly_braces}}"}</code> to mark spots that should be filled in at render time. When you call the API, you pass a <code className="font-mono text-sm bg-muted px-1.5 rounded">variables</code> object — Rendr substitutes each key and runs Chromium to produce a pixel-perfect PDF.
            </p>
            <div className="rounded-xl border border-border bg-muted/50 p-4 font-mono text-xs overflow-x-auto">
              <pre>{`<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; padding: 48px;">
    <h1>Invoice {{invoice_number}}</h1>
    <p>Bill to: <strong>{{client_name}}</strong></p>
    <p>Due: {{due_date}}</p>
    <p style="font-size: 24px; font-weight: bold;">Total: {{total}}</p>
  </body>
</html>`}</pre>
            </div>
            <p>
              When you render with <code className="font-mono text-sm bg-muted px-1.5 rounded">{"{ invoice_number: 'INV-001', client_name: 'Acme', due_date: 'Mar 1', total: '$2,400' }"}</code>, those placeholders are swapped out before the page is rendered.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Creating templates manually</h2>
            <p>
              For simple documents, writing the HTML directly is totally fine. A few tips:
            </p>
            <ul className="space-y-2 list-none pl-0">
              {[
                "Use only inline CSS — no external stylesheets or Google Fonts.",
                "Stick to web-safe fonts: Arial, Helvetica, Georgia, Times New Roman.",
                "Set a fixed max-width (794px for A4) and use padding instead of margin for print safety.",
                "Use a single <style> block in the <head> for repeated rules.",
                "Test your template in Rendr Studio before deploying.",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{i + 1}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Creating templates with AI</h2>
            <p>
              This is where it gets fun. Modern language models (ChatGPT, Claude, Gemini) are excellent at generating clean, professional HTML — especially when you give them precise constraints. A well-crafted prompt will give you a print-ready template in under 30 seconds.
            </p>

            <h3 className="text-lg font-semibold">Step-by-step</h3>
            <ol className="space-y-3 list-none pl-0">
              {[
                { title: "Open ChatGPT (or your AI of choice)", body: "Any model works. GPT-4o and Claude Sonnet tend to produce the cleanest output for structured HTML." },
                { title: "Paste the prompt below", body: "Replace [DOCUMENT TYPE] with the document you need — invoice, receipt, certificate, proposal, offer letter, etc." },
                { title: "Copy the output HTML", body: "The AI will output a complete HTML file. Copy everything starting from <!DOCTYPE html>." },
                { title: "Paste into Rendr Studio", body: "Go to Templates → New template. Give it a name, paste the HTML, and hit Create." },
                { title: "Preview with sample data", body: "Rendr automatically fills in realistic sample values so you can see exactly how it will look." },
                { title: "Use it in the API", body: "Call /api/v1/convert with type: 'template', templateId, and your variables object." },
              ].map((step, i) => (
                <li key={i} className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
                  <span className="shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{i + 1}</span>
                  <div>
                    <p className="font-semibold text-sm">{step.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">The ready-made ChatGPT prompt</h2>
            <p>
              Copy this prompt and paste it into ChatGPT. Replace <strong>[DOCUMENT TYPE]</strong> with what you need.
            </p>

            <div className="rounded-xl border border-border bg-zinc-950 dark:bg-zinc-900 text-green-400 p-5 font-mono text-xs leading-relaxed overflow-x-auto relative">
              <pre className="whitespace-pre-wrap">{CHATGPT_PROMPT}</pre>
              <CopyPromptButton prompt={CHATGPT_PROMPT} />
            </div>

            <p className="text-sm text-muted-foreground">
              This prompt instructs the model to: use only inline CSS, avoid external resources, use curly-brace variables, produce A4 dimensions, and list all variable names in a comment at the bottom — making it easy to know exactly what to pass when calling the API.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Common variable patterns</h2>
            <p>Here are the variable names we recommend for common document types:</p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Invoice",
                  vars: ["invoice_number", "invoice_date", "due_date", "client_name", "client_address", "item_description", "subtotal", "tax_amount", "total"],
                },
                {
                  title: "Receipt",
                  vars: ["receipt_number", "date", "business_name", "customer_name", "item", "amount", "payment_method"],
                },
                {
                  title: "Certificate",
                  vars: ["recipient_name", "course_name", "completion_date", "organization_name", "issuer_name", "issuer_title"],
                },
                {
                  title: "Offer Letter",
                  vars: ["candidate_name", "position_title", "start_date", "salary", "employment_type", "hiring_manager_name"],
                },
              ].map((group) => (
                <div key={group.title} className="rounded-xl border border-border bg-card p-4 space-y-2">
                  <p className="font-semibold text-sm">{group.title}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.vars.map((v) => (
                      <code key={v} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                        {`{{${v}}}`}
                      </code>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Testing in Rendr Studio</h2>
            <p>
              After creating your template, go to <strong>Templates</strong> and hover over the card — you'll see a preview rendered with realistic sample data. Click <strong>Open in Studio</strong> to render it as a live PDF with your own variable values.
            </p>
            <p>
              Studio lets you tweak the HTML and immediately see the result — no API calls needed during development.
            </p>
          </section>

          {/* CTA */}
          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 p-6 text-white text-center space-y-3">
            <p className="font-bold text-lg">Ready to build your first template?</p>
            <p className="text-white/80 text-sm">It takes less than 2 minutes with the prompt above.</p>
            <Link
              href="/app/templates"
              className="inline-block rounded-lg bg-white/15 hover:bg-white/25 px-5 py-2 text-sm font-medium text-white transition-colors"
            >
              Go to Templates →
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}

