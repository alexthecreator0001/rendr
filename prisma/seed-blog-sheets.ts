import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  {
    slug: "generate-invoices-from-google-sheets",
    title: "How to Generate 100+ Invoices from Google Sheets in 60 Seconds",
    excerpt:
      "Stop copy-pasting client data into invoice templates. Connect your spreadsheet to an HTML template and batch-render hundreds of branded invoices — automatically.",
    tag: "Guide",
    publishedAt: new Date("2026-03-08"),
    content: `## The invoice problem every growing business faces

You have 50 clients. Maybe 200. Every month, someone on your team opens a spreadsheet, copies a client name, pastes it into a Word doc or Google Doc template, adjusts the amount, changes the date, exports as PDF, renames the file, and moves on to the next row. Multiply that by 50 clients and you've just burned 2-3 hours on something that a computer could do in under a minute.

This is the reality for freelancers, agencies, SaaS companies, and accounting teams everywhere. The data already exists in a spreadsheet — client names, email addresses, amounts, line items, dates, payment terms. The template already exists too — your branded invoice layout. The only missing piece is the bridge between them.

That's exactly what Rendr's Google Sheets integration does.

## What you need before you start

Here's the full list:

- A Google account with at least one spreadsheet
- A Rendr account (free plan works — you get 100 renders per month)
- An HTML invoice template (we'll show you how to create one)

That's it. No API keys to manage, no code to write, no server to set up.

## Step 1: Prepare your spreadsheet

Your spreadsheet should have one row per invoice and one column per variable. Here's a typical setup:

\`\`\`
| name        | email            | amount  | date       | invoice_no | due_date   |
|-------------|------------------|---------|------------|------------|------------|
| Acme Corp   | billing@acme.co  | $2,400  | 2026-03-01 | INV-001    | 2026-03-31 |
| Globex Inc  | ap@globex.io     | $1,850  | 2026-03-01 | INV-002    | 2026-03-31 |
| Initech LLC | pay@initech.com  | $3,100  | 2026-03-01 | INV-003    | 2026-03-31 |
| Wayne Corp  | bruce@wayne.ent  | $5,200  | 2026-03-01 | INV-004    | 2026-03-31 |
| Stark Ind   | tony@stark.com   | $4,750  | 2026-03-01 | INV-005    | 2026-03-31 |
\`\`\`

**Important rules:**

- The first row must be headers — these become your template variables
- Use simple, lowercase column names without spaces (use underscores instead)
- Each row = one PDF. If you have 247 rows, you'll get 247 PDFs
- Keep data clean — no merged cells, no empty rows in the middle, no formulas that return errors

**Pro tip:** If you have line items (multiple products per invoice), flatten them into a single row. For example, use columns like \`item_1\`, \`item_1_price\`, \`item_2\`, \`item_2_price\`. Or, if you need a dynamic table, use a single column with HTML markup for the items section.

## Step 2: Create your invoice template

In Rendr, go to Templates and create a new template. This is standard HTML + CSS — anything you can build on the web, you can turn into a PDF. Here's a clean, professional invoice template:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1a1a1a;
      padding: 48px;
      max-width: 794px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 48px;
    }
    .company-name {
      font-size: 24px;
      font-weight: 700;
      color: #111;
    }
    .invoice-badge {
      background: #f0fdf4;
      color: #16a34a;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 12px;
      border-radius: 100px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 40px;
    }
    .meta-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #888;
      margin-bottom: 4px;
    }
    .meta-value {
      font-size: 15px;
      color: #111;
    }
    .amount-section {
      background: #fafafa;
      border-radius: 12px;
      padding: 32px;
      text-align: center;
      margin-bottom: 40px;
    }
    .amount {
      font-size: 42px;
      font-weight: 700;
      color: #111;
    }
    .amount-label {
      font-size: 13px;
      color: #888;
      margin-top: 4px;
    }
    .footer {
      border-top: 1px solid #eee;
      padding-top: 24px;
      font-size: 13px;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">Your Company</div>
    <div class="invoice-badge">Invoice</div>
  </div>

  <div class="meta-grid">
    <div>
      <div class="meta-label">Bill To</div>
      <div class="meta-value">{{name}}</div>
      <div class="meta-value" style="color: #888; font-size: 13px;">{{email}}</div>
    </div>
    <div style="text-align: right;">
      <div class="meta-label">Invoice Number</div>
      <div class="meta-value">{{invoice_no}}</div>
      <div class="meta-label" style="margin-top: 12px;">Date</div>
      <div class="meta-value">{{date}}</div>
      <div class="meta-label" style="margin-top: 12px;">Due Date</div>
      <div class="meta-value">{{due_date}}</div>
    </div>
  </div>

  <div class="amount-section">
    <div class="amount">{{amount}}</div>
    <div class="amount-label">Amount Due</div>
  </div>

  <div class="footer">
    Thank you for your business. Payment is due by {{due_date}}.
  </div>
</body>
</html>
\`\`\`

Notice the **double curly braces** — \`{{name}}\`, \`{{amount}}\`, \`{{date}}\`, etc. These are template variables that Rendr replaces with data from your spreadsheet. The variable names must match your spreadsheet column headers exactly.

## Step 3: Connect your Google Sheet

1. Go to **Sheets** in the Rendr dashboard
2. Click **Connect Google Account** — this opens Google's OAuth flow
3. Authorize read-only access (Rendr never modifies your spreadsheets)
4. Once connected, you'll see your Google account listed

**Security note:** Rendr only requests read-only access to your spreadsheets. Your OAuth tokens are encrypted with AES-256-GCM at rest. You can revoke access at any time from your Google account settings or from the Rendr dashboard.

## Step 4: Create a Sheet Sync

1. Click **New Sync**
2. Paste your Google Sheets URL (e.g., \`https://docs.google.com/spreadsheets/d/abc123/edit\`)
3. Select which tab contains your data
4. Preview the data — you'll see your headers and the first few rows
5. Select which Rendr template to use
6. **Map columns to variables** — the visual mapper shows your spreadsheet columns on the left and template variables on the right. Drag to connect them, or let Rendr auto-match columns with matching names

## Step 5: Hit render

Click **Run Batch** and watch the progress bar fill up. Every row in your spreadsheet becomes a separate PDF, rendered with Chromium for pixel-perfect output.

For 100 invoices, this typically takes about 60-90 seconds. The progress page auto-refreshes every 3 seconds, so you can see each PDF complete in real-time. Download individually, or come back later — your PDFs are stored and accessible from the run history.

## What happens when your data changes

Next month, you update the spreadsheet with new amounts and dates. You don't need to reconfigure anything — just go to your existing Sheet Sync and click **Run Again**. Rendr pulls the latest data from your spreadsheet and generates fresh PDFs.

This is where the real time savings compound. First month: 10 minutes to set up. Every month after: 60 seconds.

## Real numbers

Here's the math for a typical agency with 150 monthly invoices:

**Manual process:**
- 2 minutes per invoice (copy, paste, adjust, export, rename)
- 150 invoices x 2 minutes = 5 hours per month
- 60 hours per year

**With Rendr + Google Sheets:**
- 10 minutes one-time setup
- 90 seconds per month to re-run
- 28 minutes per year

That's a **99.2% time reduction**. Not to mention zero typos, consistent branding, and a professional result every time.

## Beyond invoices

The same workflow works for any document where the data comes from a spreadsheet:

- **Receipts** — pull transaction data, generate branded receipts
- **Proposals** — client name, project scope, pricing from a deals spreadsheet
- **Purchase orders** — vendor info, line items, approval signatures
- **Credit notes** — adjustments tied back to original invoice numbers
- **Statements** — monthly account summaries per client

If you can put the data in a row and the design in HTML, Rendr can turn it into a PDF.

## Getting started

1. **Sign up** for a free Rendr account — 100 renders per month, no credit card
2. **Create** an invoice template (or use our starter templates as a base)
3. **Connect** your Google Sheet
4. **Map** columns to variables
5. **Render** — and never copy-paste an invoice again

The entire setup takes under 10 minutes. Your first batch of invoices will be generated before you finish your coffee.`,
  },

  {
    slug: "bulk-certificate-generator-google-sheets",
    title:
      "The Complete Guide to Bulk Certificate Generation with Google Sheets",
    excerpt:
      "Generate hundreds of personalized certificates, diplomas, and awards from a single spreadsheet. Perfect for courses, events, HR teams, and educational institutions.",
    tag: "Guide",
    publishedAt: new Date("2026-03-08"),
    content: `## Why certificates still matter in a digital world

Every year, millions of certificates are generated worldwide — course completions, conference attendance, professional development hours, employee awards, competition winners, volunteer recognition. Despite everything going digital, people still want a beautifully designed PDF they can download, print, or share on LinkedIn.

The problem is that generating these certificates is painfully manual. You have a list of 300 attendees in a spreadsheet and a certificate design in Canva or InDesign. Someone has to open the design, change the name, change the date, change the course title, export as PDF, rename the file, and repeat 299 more times. Or you pay for expensive certificate platforms that charge per certificate and lock you into their templates.

There's a better way. If your recipient data lives in Google Sheets and you can express your certificate design in HTML/CSS, Rendr connects the two and generates all 300 certificates in a single batch.

## What makes a great certificate

Before we dive into the technical setup, let's talk about design. Great certificates share a few traits:

**1. Clear hierarchy** — The recipient's name is the most prominent element. Course/event name is secondary. Date, instructor, and organization come after.

**2. Appropriate formality** — A university diploma needs ornate borders and serif fonts. A coding bootcamp certificate can be modern and minimal. Match the tone to the context.

**3. Print-ready dimensions** — Standard certificate sizes are A4 landscape (297mm x 210mm) or US Letter landscape (11" x 8.5"). Always design in landscape orientation.

**4. Verification elements** — A certificate ID, QR code, or verification URL adds credibility. These can be generated per-row from your spreadsheet.

## Setting up your spreadsheet

Here's a production-ready certificate spreadsheet layout:

\`\`\`
| recipient_name | course_name              | completion_date | instructor    | certificate_id | hours |
|----------------|--------------------------|-----------------|---------------|----------------|-------|
| Sarah Chen     | Advanced React Patterns  | March 5, 2026   | Dan Abramov   | CERT-2026-001  | 40    |
| Marcus Johnson | Advanced React Patterns  | March 5, 2026   | Dan Abramov   | CERT-2026-002  | 40    |
| Priya Patel    | Advanced React Patterns  | March 5, 2026   | Dan Abramov   | CERT-2026-003  | 40    |
| James Wilson   | Node.js Masterclass      | March 8, 2026   | Ryan Dahl     | CERT-2026-004  | 60    |
| Emma Rodriguez | Node.js Masterclass      | March 8, 2026   | Ryan Dahl     | CERT-2026-005  | 60    |
\`\`\`

**Column planning tips:**

- **recipient_name** — full name as it should appear on the certificate. Double-check spelling before rendering.
- **course_name** — the full title. Keep it consistent across all rows for the same course.
- **completion_date** — format it exactly how you want it displayed. "March 5, 2026" looks better on a certificate than "2026-03-05".
- **certificate_id** — a unique identifier for verification. Use a formula like \`="CERT-" & YEAR(TODAY()) & "-" & TEXT(ROW()-1, "000")\` to auto-generate these.
- **hours** — credit hours, CPD points, or CEUs. Optional but valuable for professional development certificates.
- **instructor** — the name of the instructor or signatory.

## Building the certificate template

Here's a complete, production-ready certificate template in HTML:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      width: 1122px;
      height: 794px;
      font-family: 'Inter', sans-serif;
      background: #fff;
      position: relative;
      overflow: hidden;
    }

    .border-frame {
      position: absolute;
      inset: 16px;
      border: 2px solid #d4af37;
      border-radius: 4px;
    }

    .border-frame-inner {
      position: absolute;
      inset: 22px;
      border: 1px solid #d4af3744;
    }

    .content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 60px 80px;
      text-align: center;
    }

    .org-name {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #666;
      margin-bottom: 24px;
    }

    .title {
      font-family: 'Playfair Display', serif;
      font-size: 42px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 8px;
    }

    .subtitle {
      font-size: 14px;
      color: #888;
      margin-bottom: 40px;
    }

    .recipient {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      font-weight: 400;
      color: #1a1a1a;
      border-bottom: 2px solid #d4af37;
      padding-bottom: 8px;
      margin-bottom: 32px;
    }

    .description {
      font-size: 15px;
      color: #444;
      line-height: 1.8;
      max-width: 600px;
      margin-bottom: 40px;
    }

    .meta-row {
      display: flex;
      gap: 64px;
      align-items: flex-end;
    }

    .meta-item {
      text-align: center;
    }

    .meta-value {
      font-size: 14px;
      font-weight: 500;
      color: #1a1a1a;
      margin-bottom: 4px;
    }

    .meta-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #999;
    }

    .cert-id {
      position: absolute;
      bottom: 32px;
      right: 40px;
      font-size: 10px;
      color: #ccc;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>
  <div class="border-frame"></div>
  <div class="border-frame-inner"></div>

  <div class="content">
    <div class="org-name">Your Organization</div>
    <div class="title">Certificate of Completion</div>
    <div class="subtitle">This is proudly presented to</div>
    <div class="recipient">{{recipient_name}}</div>
    <div class="description">
      For successfully completing the <strong>{{course_name}}</strong>
      program, demonstrating {{hours}} hours of dedicated study
      and mastery of the course material.
    </div>
    <div class="meta-row">
      <div class="meta-item">
        <div class="meta-value">{{completion_date}}</div>
        <div class="meta-label">Date</div>
      </div>
      <div class="meta-item">
        <div class="meta-value">{{instructor}}</div>
        <div class="meta-label">Instructor</div>
      </div>
    </div>
  </div>

  <div class="cert-id">{{certificate_id}}</div>
</body>
</html>
\`\`\`

**Key design decisions:**

- **Fixed dimensions** (1122x794px) — this is A4 landscape at 96 DPI. Rendr renders at this exact size for print-quality output.
- **Google Fonts** — Playfair Display for elegant headings, Inter for body text. These are loaded via the standard Google Fonts import.
- **Gold accent** (#d4af37) — the border frame and name underline use a classic gold tone that prints well on both white and cream paper.
- **Template variables** — {{recipient_name}}, {{course_name}}, {{hours}}, {{completion_date}}, {{instructor}}, {{certificate_id}} are all pulled from your spreadsheet.

## Connecting the dots in Rendr

Once you have your spreadsheet and template ready:

1. Go to **Sheets** in the Rendr dashboard
2. Connect your Google account (one-click OAuth)
3. Create a **New Sync** — paste your spreadsheet URL
4. Select the tab with your certificate data
5. Choose your certificate template
6. **Map columns to variables** — Rendr's visual mapper shows your spreadsheet columns on the left and template {{variables}} on the right. If your column names match the variable names (which they should, if you followed the spreadsheet setup above), Rendr auto-maps them for you
7. Click **Run Batch**

For 300 certificates, rendering typically takes 3-5 minutes. The progress page auto-refreshes, showing you each certificate as it completes. When done, download each PDF individually.

## Scaling to thousands

Rendr's Growth plan supports up to 100 rows per batch. The Business plan supports 500. If you have more than 500 certificates, split your spreadsheet into batches — create multiple syncs pointing to different tabs or ranges.

For very large runs (1000+ certificates), here are some tips:

- **Pre-validate your data** — a single row with a missing name or a broken formula will produce a broken certificate. Clean your data before rendering.
- **Test with 5 rows first** — create a test tab with 5 representative rows and render those first. Check the output, adjust your template if needed, then run the full batch.
- **Use consistent date formatting** — "March 5, 2026" looks professional. "3/5/26" does not. Format dates in your spreadsheet, not in the template.

## Use case: Conference attendance certificates

Here's a real workflow for a 500-person tech conference:

**Before the event:**
1. Set up your spreadsheet with columns: \`attendee_name\`, \`ticket_type\`, \`event_name\`, \`event_date\`, \`event_location\`, \`cert_id\`
2. Create your certificate template with the conference branding
3. Create a Sheet Sync in Rendr (don't run it yet)

**After the event:**
1. Export your attendee list from Eventbrite/Luma/Tito into the spreadsheet
2. Open your existing Sheet Sync in Rendr
3. Click **Run** — 500 certificates generated in under 10 minutes
4. Email certificates to attendees (or host them behind a verification URL)

Total time: 15 minutes of setup (once) + 10 minutes per event. Compare that to the manual approach of editing 500 documents one by one.

## Use case: Employee training records

HR teams use this workflow for:

- **Compliance training** — "All 200 employees must complete Safety Training by Q1. Generate completion certificates for records."
- **Onboarding** — Welcome packet with personalized certificate confirming start date, department, and manager name
- **Annual reviews** — performance recognition certificates for top performers
- **Professional development** — CPD/CEU certificates for internal workshops

The spreadsheet becomes your single source of truth. When an auditor asks for training records, you have a complete, timestamped run history in Rendr showing exactly when each certificate was generated.

## Use case: Online course platforms

If you run an online course (Teachable, Thinkific, Podia, custom LMS):

1. Export your completion data to Google Sheets (most platforms support CSV export or Zapier integration)
2. Add any additional columns your certificate needs (e.g., course hours, grade)
3. Connect to Rendr and render certificates for all completions

Some course creators run this weekly — a Friday batch of all certificates from that week's completions. With the re-run feature, it's literally one click.

## Template variations

You don't need to use the gold-bordered design above. Here are some ideas:

- **Modern minimal** — white background, one accent color, sans-serif typography, minimal borders
- **Dark mode** — dark background with white text and a bright accent. Looks stunning when shared digitally
- **University style** — ornate borders, serif fonts, seal/crest imagery, formal language
- **Fun/casual** — colorful gradients, playful fonts, emoji, illustrations. Great for kids' courses or casual workshops
- **Corporate** — company brand colors, logo header, clean grid layout, signature line

The beauty of HTML templates is that you have complete design freedom. Anything you can build on the web, you can render as a PDF.

## Getting started

1. Sign up for Rendr (free — 100 renders/month)
2. Create your certificate template in the template editor
3. Prepare your spreadsheet with recipient data
4. Connect Google Sheets and create a sync
5. Render your first batch

The next time someone asks you to "generate certificates for all 300 attendees," you'll have it done before they finish their sentence.`,
  },

  {
    slug: "automate-pdf-reports-google-sheets",
    title:
      "Automate PDF Report Generation: From Google Sheets Data to Client-Ready Documents",
    excerpt:
      "Build an automated document pipeline that turns spreadsheet data into branded PDF reports, proposals, and statements — no code required.",
    tag: "Deep dive",
    publishedAt: new Date("2026-03-08"),
    content: `## The hidden cost of manual document creation

Every business generates documents — reports, proposals, statements, summaries, letters. And almost every business generates them the same way: someone opens a template, manually replaces the client name, updates the numbers, adjusts the date, exports to PDF, and sends it off. This works fine when you have 5 clients. It breaks down at 50. It's completely unsustainable at 500.

The hidden cost isn't just time. It's errors. A wrong number in a report. A misspelled client name. Last month's date on this month's statement. These mistakes erode trust and create rework. And they're inevitable when humans are manually copying data between systems.

The solution is obvious: the data already exists in a structured format (your spreadsheet). The design already exists (your template). All you need is a system that merges the two automatically.

## The document automation stack

Here's the modern approach to document generation:

**Data source** → Google Sheets (or any spreadsheet)
**Template engine** → Rendr (HTML/CSS templates with {{variables}})
**Output** → Pixel-perfect PDFs rendered with Chromium
**Delivery** → Download, email, or API integration

This stack has several advantages over traditional approaches:

- **No vendor lock-in** — your templates are standard HTML. You can view them in any browser, version them in Git, and modify them with any text editor.
- **Full design freedom** — CSS gives you complete control over layout, typography, colors, and spacing. No drag-and-drop limitations.
- **Spreadsheet as source of truth** — your data stays in Google Sheets where your team already works. No need to learn a new tool or import data into a separate system.
- **Batch processing** — generate hundreds of documents in a single operation.

## Building a client report template

Let's build a real-world example: a monthly client performance report. This is the kind of document that agencies, consultants, and SaaS companies send to clients regularly.

### The spreadsheet

\`\`\`
| client_name | month       | revenue    | growth  | users   | churn   | nps | highlights                          |
|-------------|-------------|------------|---------|---------|---------|-----|-------------------------------------|
| Acme Corp   | March 2026  | $124,500   | +12.3%  | 1,847   | 2.1%    | 72  | Launched mobile app, 3 new features |
| Globex Inc  | March 2026  | $89,200    | +8.7%   | 923     | 1.8%    | 68  | Enterprise tier adoption up 40%     |
| Initech LLC | March 2026  | $201,300   | +15.1%  | 3,102   | 1.2%    | 81  | Record month, expanded to EU market |
| Wayne Corp  | March 2026  | $67,800    | -2.4%   | 556     | 4.3%    | 54  | Seasonal dip, Q2 campaign planned   |
| Stark Ind   | March 2026  | $312,000   | +22.8%  | 5,240   | 0.9%    | 88  | API v2 launch drove 3x signups      |
\`\`\`

Notice how each row contains everything needed for one complete report. The \`highlights\` column is a free-text field that gets inserted directly into the report — this is where you add the human touch.

### The template

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', sans-serif;
      color: #1a1a1a;
      padding: 48px;
      max-width: 794px;
      line-height: 1.5;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 2px solid #f1f1f1;
    }

    .logo-area h1 {
      font-size: 20px;
      font-weight: 700;
    }

    .logo-area p {
      font-size: 12px;
      color: #888;
      margin-top: 2px;
    }

    .report-meta {
      text-align: right;
    }

    .report-meta .period {
      font-size: 14px;
      font-weight: 600;
      color: #111;
    }

    .report-meta .client {
      font-size: 12px;
      color: #888;
      margin-top: 2px;
    }

    .section-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #888;
      margin-bottom: 16px;
      margin-top: 36px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 8px;
    }

    .kpi-card {
      background: #fafafa;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }

    .kpi-value {
      font-size: 28px;
      font-weight: 700;
      color: #111;
    }

    .kpi-label {
      font-size: 11px;
      color: #888;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .kpi-change {
      font-size: 12px;
      font-weight: 600;
      margin-top: 6px;
    }

    .kpi-change.positive { color: #16a34a; }
    .kpi-change.negative { color: #dc2626; }

    .highlights-box {
      background: #f0f9ff;
      border-left: 3px solid #3b82f6;
      border-radius: 0 8px 8px 0;
      padding: 20px 24px;
      margin-top: 16px;
    }

    .highlights-title {
      font-size: 13px;
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 8px;
    }

    .highlights-text {
      font-size: 14px;
      color: #334155;
      line-height: 1.6;
    }

    .footer {
      margin-top: 48px;
      padding-top: 20px;
      border-top: 1px solid #f1f1f1;
      font-size: 11px;
      color: #aaa;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-area">
      <h1>Your Agency</h1>
      <p>Monthly Performance Report</p>
    </div>
    <div class="report-meta">
      <div class="period">{{month}}</div>
      <div class="client">Prepared for {{client_name}}</div>
    </div>
  </div>

  <div class="section-title">Key Metrics</div>
  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-value">{{revenue}}</div>
      <div class="kpi-label">Revenue</div>
      <div class="kpi-change positive">{{growth}}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value">{{users}}</div>
      <div class="kpi-label">Active Users</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value">{{churn}}</div>
      <div class="kpi-label">Churn Rate</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-value">{{nps}}</div>
      <div class="kpi-label">NPS Score</div>
    </div>
  </div>

  <div class="section-title">Highlights</div>
  <div class="highlights-box">
    <div class="highlights-title">What happened this month</div>
    <div class="highlights-text">{{highlights}}</div>
  </div>

  <div class="footer">
    This report was generated automatically. For questions, contact your account manager.
  </div>
</body>
</html>
\`\`\`

This template produces a clean, professional one-page report with KPI cards, growth indicators, and a highlights section. Every element is pulled from your spreadsheet.

## The Rendr workflow

### Initial setup (10 minutes, one time)

1. **Create your template** in Rendr's template editor. Paste the HTML above, or build your own from scratch. Test it with sample data using the preview feature.

2. **Prepare your spreadsheet** in Google Sheets. Set up columns for every variable your template uses. Add a few test rows.

3. **Connect Google Sheets** to Rendr. One-click OAuth — read-only access, encrypted token storage.

4. **Create a Sheet Sync** — paste the spreadsheet URL, select the tab, map columns to template variables.

5. **Test render** — run a batch with your test rows. Check the output. Adjust the template if needed.

### Monthly operation (60 seconds)

1. Update your spreadsheet with this month's data
2. Open your Sheet Sync in Rendr
3. Click **Run**
4. Download your reports

That's it. The template, the mapping, the connection — all of it persists. You're just clicking "Run" with fresh data.

## Advanced patterns

### Conditional styling in templates

You can't write if/else logic in Rendr templates (they're pure HTML with variable substitution), but you can be clever with your spreadsheet data:

\`\`\`
| growth_class |
|--------------|
| positive     |
| positive     |
| negative     |
\`\`\`

Then in your template:

\`\`\`html
<div class="kpi-change {{growth_class}}">{{growth}}</div>
\`\`\`

Your spreadsheet does the logic ("is growth positive or negative?") and outputs the CSS class name. The template just applies it.

### Multi-page reports

For longer reports, use CSS page-break rules:

\`\`\`css
.page-break { page-break-after: always; }
\`\`\`

\`\`\`html
<div class="page-1">
  <!-- Executive summary -->
</div>
<div class="page-break"></div>
<div class="page-2">
  <!-- Detailed metrics -->
</div>
\`\`\`

Each section of your report can pull from different columns. A 3-page report might use 20+ template variables — all sourced from a single row in your spreadsheet.

### HTML inside spreadsheet cells

For truly dynamic content (like a list of accomplishments or a table of line items), you can put raw HTML in your spreadsheet cells:

\`\`\`
| line_items_html                                                            |
|----------------------------------------------------------------------------|
| <tr><td>Design</td><td>$2,000</td></tr><tr><td>Dev</td><td>$5,000</td></tr> |
\`\`\`

Then in your template:

\`\`\`html
<table>
  <thead><tr><th>Service</th><th>Amount</th></tr></thead>
  <tbody>{{line_items_html}}</tbody>
</table>
\`\`\`

This pattern is powerful but requires careful spreadsheet management. Make sure your HTML is valid and consistent across rows.

## Document types you can automate

### Financial documents
- Monthly invoices and credit notes
- Account statements
- Payment receipts
- Budget reports
- Expense summaries

### Client-facing documents
- Performance reports (as shown above)
- Proposals and quotes
- Service agreements
- Project status updates
- Case study PDFs

### HR documents
- Offer letters
- Employment contracts
- Payslips
- Training certificates
- Performance review summaries
- Onboarding checklists

### Sales documents
- Product spec sheets
- Price lists
- Order confirmations
- Warranty certificates
- Sales reports

### Operational documents
- Shipping labels and packing slips
- Inspection reports
- Audit checklists
- Compliance certificates
- Event badges and tickets

Each of these follows the same pattern: structured data in a spreadsheet, design in an HTML template, output as PDF. The only thing that changes is the template design and the spreadsheet columns.

## Comparing approaches

### Manual (Word/Google Docs)
- **Time per document:** 2-5 minutes
- **Error rate:** High (copy-paste mistakes)
- **Design quality:** Limited by template capabilities
- **Scalability:** 10-20 documents before it becomes painful
- **Cost:** Free but expensive in time

### Mail merge (legacy tools)
- **Time per document:** Seconds (once configured)
- **Error rate:** Low
- **Design quality:** Poor — limited formatting options
- **Scalability:** Good
- **Cost:** Free but ugly output

### Dedicated platforms (PandaDoc, Proposify)
- **Time per document:** Minutes (drag-and-drop editors)
- **Error rate:** Low
- **Design quality:** Good but template-constrained
- **Scalability:** Good
- **Cost:** $19-65/month per user

### Rendr + Google Sheets
- **Time per document:** Sub-second (batch rendered)
- **Error rate:** None (data comes directly from source)
- **Design quality:** Unlimited (full HTML/CSS control)
- **Scalability:** Up to 500 per batch
- **Cost:** Free tier (100/month), Growth ($49/month), Business ($199/month)

The key differentiator is design freedom. With HTML/CSS, you can build exactly the document you want — pixel for pixel. No template constraints, no drag-and-drop limitations, no "close enough" compromises.

## Building your first automated pipeline

Here's a step-by-step action plan:

**Week 1: Template**
1. Identify your most repetitive document (the one that wastes the most time)
2. Design it in HTML/CSS — start from one of Rendr's starter templates if you're not a developer
3. Test it in Rendr with hardcoded sample data
4. Refine until it matches your brand perfectly

**Week 2: Data**
1. Set up your Google Sheet with all the variables your template needs
2. Fill in 5-10 test rows with real data
3. Make sure column names match template variable names exactly
4. Add data validation rules to prevent errors (dropdown lists for fixed values, date formats, number formats)

**Week 3: Connect and test**
1. Connect your Google account in Rendr
2. Create a Sheet Sync
3. Run a test batch with your 5-10 rows
4. Review every PDF carefully — check spacing, data accuracy, edge cases (long names, special characters, zero values)
5. Adjust template and data as needed

**Week 4: Full production**
1. Populate your spreadsheet with all real data
2. Run your first full batch
3. Document the process for your team (which spreadsheet, which sync, how to run)
4. Set a recurring calendar reminder to run the batch (monthly, weekly, whatever your cadence is)

After this initial setup, you're saving hours every month — permanently. The template evolves with your brand, the spreadsheet grows with your business, and the pipeline just works.

## The bottom line

Document automation isn't about replacing humans. It's about freeing them from the mechanical work of copying data between systems. Your spreadsheet is the brain. Your template is the design. Rendr is the bridge that connects them.

The result: hundreds of pixel-perfect, branded, error-free documents generated in the time it takes to make a coffee. Every month. Automatically.

Start with one document type. Prove the value. Then expand to every repetitive document in your business. The ROI compounds fast — especially when you factor in the errors you'll never make again.`,
  },
];

async function main() {
  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: post.slug },
    });
    if (existing) {
      console.log(`Skipping "${post.slug}" — already exists`);
      continue;
    }
    await prisma.blogPost.create({
      data: {
        ...post,
        published: true,
      },
    });
    console.log(`Created: ${post.slug}`);
  }
  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
