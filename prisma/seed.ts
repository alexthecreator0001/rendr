import { PrismaClient } from "@prisma/client"
import crypto from "node:crypto"
import bcrypt from "bcryptjs"
import { seedStarterTemplates } from "../lib/starter-templates"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create demo user
  const passwordHash = await bcrypt.hash("demo1234", 12)
  const user = await prisma.user.upsert({
    where: { email: "demo@rendr.dev" },
    update: { emailVerified: new Date() },
    create: {
      email: "demo@rendr.dev",
      passwordHash,
      emailVerified: new Date(),
    },
  })

  console.log(`Demo user: ${user.email}`)

  // Create a demo API key
  const rawKey = `rk_live_${crypto.randomBytes(32).toString("base64url")}`
  const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex")
  const keyPrefix = rawKey.slice(0, 16)

  const existing = await prisma.apiKey.findFirst({
    where: { userId: user.id, name: "Demo Key" },
  })

  if (!existing) {
    await prisma.apiKey.create({
      data: {
        userId: user.id,
        name: "Demo Key",
        keyPrefix,
        keyHash,
      },
    })
    console.log(`Demo API key created (prefix: ${keyPrefix}...)`)
    console.log(`Full key (save this!): ${rawKey}`)
  } else {
    console.log("Demo key already exists, skipping.")
  }

  // Seed / refresh starter templates for demo user (force=true to update HTML)
  await seedStarterTemplates(user.id, prisma, { force: true })
  console.log("Starter templates seeded / refreshed.")

  // Ensure test account exists with pro plan
  const testHash = await bcrypt.hash("test1234", 12)
  const testUser = await prisma.user.upsert({
    where: { email: "test@test.sk" },
    update: { plan: "growth", emailVerified: new Date() },
    create: {
      email: "test@test.sk",
      passwordHash: testHash,
      plan: "growth",
      emailVerified: new Date(),
    },
  })
  console.log(`Test user: ${testUser.email} (plan: ${testUser.plan})`)

  // Seed starter templates for test user
  await seedStarterTemplates(testUser.id, prisma, { force: true })

  // ── Seed blog posts ───────────────────────────────────────────────────────
  const blogPosts = [
    {
      slug: "why-html-to-pdf",
      title: "Why HTML-to-PDF is the Right Approach for Document Generation",
      excerpt: "Forget LaTeX, Word templates, and proprietary markup. Here's why every modern team is switching to HTML + CSS for PDF generation.",
      tag: "Engineering",
      publishedAt: new Date("2026-02-10"),
      content: `## The old way is broken

For decades, generating PDFs meant choosing between bad options: Word templates with mail merge, LaTeX for the brave, or proprietary tools like JasperReports that required their own markup language. Each approach came with the same problems — steep learning curves, limited styling, and impossible debugging.

## HTML + CSS already solved layout

The web platform spent 25 years perfecting document layout. Flexbox, CSS Grid, web fonts, media queries — these tools handle everything from simple invoices to complex multi-page reports. If you can build a web page, you can build a PDF.

Here's a complete invoice in HTML:

\`\`\`html
<div style="max-width: 794px; padding: 48px; font-family: sans-serif;">
  <h1>Invoice #{{invoice_number}}</h1>
  <p>Date: {{date}}</p>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">{{item}}</td>
      <td style="text-align: right;">{{amount}}</td>
    </tr>
  </table>
</div>
\`\`\`

No special syntax. No proprietary tools. Just HTML that any developer already knows.

## The rendering problem

The missing piece was always rendering. How do you turn that HTML into a PDF that looks identical across every device and PDF viewer? The answer is headless Chromium.

Chromium's print pipeline produces pixel-perfect PDFs with full CSS support — the same rendering engine that powers 70% of web browsers. That's what Rendr uses under the hood.

## What this means for your team

- **Designers** can use their existing CSS skills
- **Developers** don't need to learn a new templating language
- **QA** can preview templates in any browser before generating
- **Iteration** is as fast as refreshing a browser tab

## The Rendr approach

With Rendr, you send HTML (or a URL) to a single API endpoint and get a PDF back. We handle the headless browser, the rendering queue, font embedding, and all the edge cases. You focus on making your documents look great.

\`\`\`bash
curl -X POST https://rendrpdf.com/api/v1/convert \\
  -H "Authorization: Bearer rk_live_..." \\
  -d '{"input": {"type": "html", "html": "<h1>Hello</h1>"}}'
\`\`\`

Three lines. That's the entire integration.`,
    },
    {
      slug: "how-to-create-templates",
      title: "How to Create PDF Templates with ChatGPT (and Render Them with Rendr)",
      excerpt: "Use AI to design professional HTML templates in minutes, then plug them into Rendr's template API for dynamic PDF generation.",
      tag: "Tutorial",
      publishedAt: new Date("2026-02-14"),
      content: `## Why AI + templates?

Building a good-looking PDF template used to take hours of fiddling with CSS. With ChatGPT (or any LLM), you can generate a professional, print-ready HTML template in under a minute — then store it in Rendr's template system for repeated use.

## Step 1: Generate the HTML with ChatGPT

Open ChatGPT and use this prompt (copy it below):

The key points in the prompt:
- **Inline CSS only** — no external stylesheets that might not load during rendering
- **Web-safe fonts** — guarantees consistent rendering
- **Double curly brace placeholders** — Rendr's template engine replaces these with real data
- **A4 dimensions** — standard PDF page size
- **Self-contained** — no external images or JavaScript

## Step 2: Test in your browser

Save the output as \`template.html\` and open it in Chrome. You'll see the template with raw \`{{variable}}\` placeholders. Check the layout, spacing, and typography. Tweak anything you don't like — it's just HTML.

## Step 3: Store it in Rendr

Upload the template via the API:

\`\`\`bash
curl -X POST https://rendrpdf.com/api/v1/templates \\
  -H "Authorization: Bearer rk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "invoice-v1",
    "html": "<!DOCTYPE html><html>...</html>"
  }'
\`\`\`

## Step 4: Render with data

Now render the template with real data:

\`\`\`bash
curl -X POST https://rendrpdf.com/api/v1/convert \\
  -H "Authorization: Bearer rk_live_..." \\
  -d '{
    "input": {
      "type": "template",
      "templateName": "invoice-v1",
      "data": {
        "client_name": "Acme Corp",
        "invoice_date": "2026-02-14",
        "total": "$1,250.00"
      }
    }
  }'
\`\`\`

Every \`{{variable}}\` in your template gets replaced with the corresponding value from the \`data\` object.

## Tips for better templates

- **Use \`@page\` CSS rules** to control margins: \`@page { margin: 20mm; }\`
- **Avoid JavaScript** — it adds latency and complexity. Pure HTML + CSS is fastest.
- **Test with edge cases** — long names, multi-line addresses, large tables
- **Version your templates** — \`invoice-v1\`, \`invoice-v2\`, etc. Rendr retains old versions.

## What you end up with

A workflow where designers (or AI) create the HTML template once, and your application renders thousands of unique PDFs by swapping in different data. No headless browser to manage, no rendering infrastructure to maintain.`,
    },
    {
      slug: "webhooks-done-right",
      title: "Webhooks Done Right: How Rendr Delivers Job Notifications",
      excerpt: "HMAC signatures, exponential backoff, and per-job URLs. Here's how we built webhook delivery that doesn't lose events.",
      tag: "Engineering",
      publishedAt: new Date("2026-02-18"),
      content: `## Why webhooks matter for PDF generation

PDF rendering is inherently asynchronous. Even a simple page takes 300ms–2s to render — and complex reports can take longer. Polling wastes resources and adds latency. Webhooks give you instant notification the moment a PDF is ready.

## The problem with most webhook implementations

Most APIs fire a single POST and call it done. If your server is down for 30 seconds, you lose the event forever. That's not acceptable for invoice generation or compliance documents.

## How Rendr handles it

### 1. HMAC-SHA256 signing

Every webhook payload is signed with your secret key using HMAC-SHA256. The signature is sent in the \`X-Rendr-Signature\` header:

\`\`\`
X-Rendr-Signature: sha256=a1b2c3d4...
\`\`\`

Verify it in three lines:

\`\`\`javascript
const crypto = require("crypto");
const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
const valid = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from("sha256=" + expected));
\`\`\`

### 2. Exponential backoff retries

If your endpoint returns anything other than a 2xx status, we retry:

- **Attempt 1**: Immediate
- **Attempt 2**: 2 seconds later
- **Attempt 3**: 8 seconds later
- **Attempt 4**: 32 seconds later
- **Attempt 5**: 128 seconds later

Total retry window: ~3 minutes. Enough to survive a deploy or a brief outage.

### 3. Per-job webhook URLs

Don't want to set up a permanent webhook endpoint? Pass \`webhook_url\` on any individual render request:

\`\`\`json
{
  "input": { "type": "html", "html": "<h1>Report</h1>" },
  "webhook_url": "https://your-app.com/hooks/pdf-ready"
}
\`\`\`

This is great for microservice architectures where different services handle different document types.

### 4. Both success and failure events

You get notified on both outcomes:

- **job.completed** — PDF is ready, includes \`download_url\`
- **job.failed** — rendering failed, includes \`error\` message

No more silent failures.

## Payload structure

\`\`\`json
{
  "event": "job.completed",
  "job_id": "cm7abc123...",
  "status": "succeeded",
  "pdf_url": "https://rendrpdf.com/api/v1/files/...",
  "pages": 3,
  "size_bytes": 45210,
  "created_at": "2026-02-18T10:30:00Z"
}
\`\`\`

## Best practices

- **Always verify the signature** — never trust unsigned payloads
- **Return 200 quickly** — do your processing async after acknowledging receipt
- **Make your handler idempotent** — you might receive the same event twice during retries
- **Log the \`job_id\`** — correlate webhook events with your internal records`,
    },
    {
      slug: "pdf-merge-api",
      title: "Introducing the PDF Merge API",
      excerpt: "Combine 2–50 PDFs into a single document with one API call. Set metadata, control page order, and name the output file.",
      tag: "Product",
      publishedAt: new Date("2026-02-22"),
      content: `## What's new

Rendr now supports PDF merging via a dedicated \`POST /api/v1/merge\` endpoint. Combine up to 50 existing PDFs into a single document — with full control over page order, metadata, and the output filename.

## Why merge?

Common use cases:

- **Combined reports** — merge a cover page, table of contents, and multiple chapter PDFs into one document
- **Invoice bundles** — combine all monthly invoices into a single PDF for accounting
- **Document packages** — merge contracts, terms, and appendices for a single download
- **Print preparation** — combine multiple renders into one print-ready file

## How it works

Every PDF you render with Rendr gets a \`download_token\`. Pass an array of these tokens to the merge endpoint:

\`\`\`bash
curl -X POST https://rendrpdf.com/api/v1/merge \\
  -H "Authorization: Bearer rk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "sources": [
      "dBjK7m2x...",
      "pQ9nR4wY...",
      "kL3mN8vZ..."
    ],
    "metadata": {
      "title": "Q1 2026 Report Bundle",
      "author": "Finance Team"
    },
    "filename": "q1-2026-report.pdf"
  }'
\`\`\`

## Response

\`\`\`json
{
  "job_id": "cm7xyz...",
  "status": "succeeded",
  "pdf_url": "https://rendrpdf.com/api/v1/files/...",
  "pages": 47,
  "size_bytes": 2340120
}
\`\`\`

## Key details

- **Page order** matches the order of tokens in the \`sources\` array
- **Metadata** (title, author, subject, keywords) is optional — set it for professional document properties
- **Filename** controls the \`Content-Disposition\` header when downloading
- **Size limits** are enforced per plan — starter (25 MB), growth (100 MB), business (500 MB)
- **Ownership verification** — you can only merge PDFs you rendered with your own API key

## What's next

We're exploring page-level control — selecting specific page ranges from each source PDF, reordering individual pages, and inserting blank separator pages. Let us know what you'd build with it.`,
    },
    {
      slug: "security-model",
      title: "How Rendr Protects Your Data and Your Users",
      excerpt: "SSRF protection, DNS pinning, input validation, HMAC signing — a look at the security measures baked into every Rendr API call.",
      tag: "Engineering",
      publishedAt: new Date("2026-02-24"),
      content: `## Security isn't a feature — it's a constraint

When you send HTML to a PDF rendering service, you're trusting that service with your data. Here's how Rendr earns that trust.

## API key security

API keys follow the \`rk_live_\` prefix convention for easy identification. But we never store the raw key — only its SHA-256 hash. If our database were compromised, attackers would get hashes, not usable keys.

Key management:
- **Create** and **revoke** keys from the dashboard
- **Key prefixes** are stored for identification (\`rk_live_abc123...\`)
- **Last used** timestamps help you identify stale keys
- **Per-key rate limits** prevent abuse

## SSRF protection

When you ask Rendr to render a URL, we need to fetch that URL with headless Chromium. This creates a Server-Side Request Forgery (SSRF) risk — a malicious user could try to render \`http://169.254.169.254/latest/meta-data/\` to access cloud metadata.

Our protection:
- **DNS resolution check** before any request — we resolve the hostname and reject private/internal IPs
- **DNS pinning** — we re-check after DNS resolution to prevent TOCTOU rebinding attacks
- **Blocked ranges** — 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16, and IPv6 equivalents
- **Protocol enforcement** — only http: and https: schemes allowed

## Input validation

Every API request is validated with Zod schemas before processing:

- **HTML content** — max size enforced per plan
- **URL format** — must be a valid URL with an allowed protocol
- **Custom headers** — dangerous headers (Host, Content-Length, Transfer-Encoding) are blocked
- **Webhook URLs** — SSRF-guarded with the same DNS pinning as URL renders
- **Watermark text** — HTML-escaped before injection to prevent XSS in the rendered page

## Webhook signing

Every webhook payload is signed with HMAC-SHA256 using your webhook secret. This prevents:
- **Spoofing** — attackers can't forge webhook payloads
- **Tampering** — any modification invalidates the signature
- **Replay attacks** — timestamps in the payload let you reject old events

## Rate limiting

Per-API-key rate limiting using a sliding window algorithm:
- **Default**: 60 requests per minute
- **Configurable** per deployment
- **429 responses** include a \`Retry-After\` header

## Download token security

PDF download URLs use cryptographically random tokens (32 bytes, base64url-encoded). The token IS the credential — no additional auth required. This makes it safe to share download links directly with end users.

## What we don't do

- We don't store your HTML after rendering is complete
- We don't log the content of your PDFs
- We don't share API usage data with third parties
- We don't use your rendered documents for training or analytics

Your data goes in, a PDF comes out. That's it.`,
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        tag: post.tag,
        published: true,
        publishedAt: post.publishedAt,
      },
      create: {
        ...post,
        published: true,
      },
    })
  }
  console.log(`Blog posts seeded: ${blogPosts.length} posts`)

  console.log("Seed complete.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
