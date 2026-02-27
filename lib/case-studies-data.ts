export interface CaseStudy {
  slug: string;
  color: "blue" | "emerald" | "violet" | "amber" | "rose" | "orange";
  industry: string;
  title: string;
  subtitle: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  stack: string[];
  quote?: {
    text: string;
    role: string;
  };
  howItWorks: {
    step: string;
    detail: string;
  }[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "price-quotations-from-web-app",
    color: "blue",
    industry: "B2B Services",
    title: "Generating price quotations from a web app built in Lovable",
    subtitle: "How a consulting firm automated PDF quotes from their no-code tool",
    summary:
      "A mid-size consulting firm built their client-facing quotation tool in Lovable. The app looked great in the browser, but Lovable has no built-in PDF export. They needed pixel-perfect quotes sent to clients as PDFs — not screenshots or browser prints.",
    challenge:
      "The team had a fully functional quotation builder in Lovable with dynamic pricing tables, company branding, and terms & conditions. But every time a sales rep needed to send a quote, they were manually screenshotting or using the browser print dialog — which broke layouts, cut off content, and looked unprofessional. They tried html2canvas and jsPDF but neither could handle their CSS grid layouts or web fonts.",
    solution:
      "They integrated Rendr's URL-to-PDF endpoint. Each quote has a unique URL in their Lovable app (e.g. /quotes/Q-2024-0847). When a rep clicks \"Export PDF\", the frontend calls Rendr's API with that URL. Rendr loads the page in headless Chromium, waits for fonts and images, and returns a production-quality PDF in under 3 seconds. They added custom margins, A4 format, and their logo as a header template.",
    results: [
      "PDF generation time dropped from 2-3 minutes (manual) to under 3 seconds",
      "Quotes now match the web app pixel-for-pixel — same fonts, same layout",
      "Sales team sends 40+ quotes per week without touching the export process",
      "Zero developer maintenance — no Puppeteer servers to manage",
    ],
    stack: ["Lovable (frontend)", "Rendr API (PDF)", "Zapier (automation)", "Gmail (delivery)"],
    quote: {
      text: "We spent weeks trying to get jsPDF to handle our layouts. With Rendr it took one API call and the PDFs looked exactly like our web app.",
      role: "Lead Developer",
    },
    howItWorks: [
      { step: "Sales rep finalizes a quote in the Lovable app", detail: "The quotation page is a standard web page with dynamic data, CSS grid pricing tables, and embedded company branding." },
      { step: "Rep clicks \"Download PDF\"", detail: "The button triggers a POST to Rendr's /convert endpoint with the quote's public URL and A4 format options." },
      { step: "Rendr renders the page", detail: "Headless Chromium loads the URL, waits for fonts and images to settle, and generates a PDF with custom margins." },
      { step: "PDF is returned and downloaded", detail: "The sales rep gets a pixel-perfect PDF in their browser — ready to email or attach to a proposal." },
    ],
  },
  {
    slug: "ecommerce-order-confirmations",
    color: "emerald",
    industry: "E-commerce",
    title: "Automated order confirmations for a European fashion retailer",
    subtitle: "How we helped an e-commerce customer replace their broken PDF pipeline",
    summary:
      "A European online fashion store was generating order confirmation PDFs using a legacy wkhtmltopdf setup on their server. Upgrades broke it regularly, and it couldn't handle modern CSS — rounded corners, flexbox layouts, and Google Fonts all rendered incorrectly.",
    challenge:
      "Their existing PDF pipeline used wkhtmltopdf, which hadn't been meaningfully updated in years. Every server update risked breaking PDF generation. The output looked like a 2012 website — no shadows, broken flex layouts, missing fonts. Customer complaints about \"ugly receipts\" were becoming a recurring support ticket. Their dev team had two options: self-host Puppeteer (and maintain the infrastructure) or find an API that just works.",
    solution:
      "They switched to Rendr's template-based rendering. Their designer created an HTML/CSS order confirmation template with variables for order number, items, prices, and shipping details. The backend passes order data as template variables via the API, and Rendr returns a styled PDF that matches their brand guidelines exactly. Webhook callbacks notify their system when each PDF is ready for email attachment.",
    results: [
      "Eliminated all wkhtmltopdf rendering bugs — modern CSS renders perfectly",
      "PDF generation is now a managed service, no infrastructure to maintain",
      "Customer support tickets about receipt formatting dropped to zero",
      "Template updates are instant — change the HTML, next PDF uses it automatically",
    ],
    stack: ["Shopify (storefront)", "Node.js (backend)", "Rendr API (PDF)", "SendGrid (email)"],
    quote: {
      text: "Our order confirmations finally look as good as our website. We should have switched months ago.",
      role: "CTO",
    },
    howItWorks: [
      { step: "Customer places an order", detail: "Shopify triggers a webhook to their Node.js backend with order details." },
      { step: "Backend calls Rendr with template + variables", detail: "The API request includes the template ID and variables like {{order_number}}, {{items}}, {{total}}." },
      { step: "Rendr renders the branded PDF", detail: "The HTML template is populated with order data and rendered with headless Chromium — Google Fonts, shadows, and all." },
      { step: "PDF is attached to the confirmation email", detail: "A webhook notifies the backend when the PDF is ready, which attaches it to the SendGrid email." },
    ],
  },
  {
    slug: "saas-analytics-reports",
    color: "violet",
    industry: "SaaS / Analytics",
    title: "Weekly analytics reports for a marketing SaaS platform",
    subtitle: "How a SaaS company automated client-facing PDF reports from their dashboard",
    summary:
      "A marketing analytics platform needed to send weekly PDF reports to their agency clients. Each report contained charts, KPI cards, and campaign breakdowns — all rendered from their existing React dashboard. They didn't want to build a separate report generation system.",
    challenge:
      "The platform already had beautiful client dashboards built in React with Recharts. But clients kept asking for \"a PDF I can forward to my boss.\" The team tried server-side rendering with Puppeteer, but maintaining Chromium on their infrastructure added complexity — memory issues, zombie processes, and cold start latency. They needed the same visual output without the ops overhead.",
    solution:
      "They created dedicated report URLs for each client (e.g. /reports/client-id/weekly). These pages render the same React components as the dashboard but with a print-friendly layout. A cron job calls Rendr's async API every Monday morning for each active client. Rendr renders each URL, generates the PDF, and delivers it via webhook. The backend picks up the PDF URL and emails it to the client.",
    results: [
      "40+ weekly reports generated automatically every Monday at 6am",
      "Same charts and KPIs as the live dashboard — clients trust the numbers",
      "Removed Puppeteer from their stack — saved ~8 hours/month in DevOps",
      "Async API means report generation doesn't block their main application",
    ],
    stack: ["React + Recharts (dashboard)", "Rendr async API (PDF)", "Cron scheduler", "Postmark (email)"],
    quote: {
      text: "Our clients love getting a polished PDF every Monday morning. It's the same data as the dashboard but they can print it, forward it, attach it to slide decks.",
      role: "Product Lead",
    },
    howItWorks: [
      { step: "Cron job triggers on Monday at 6am", detail: "The scheduler iterates over active clients and their report configuration." },
      { step: "Async API call for each client", detail: "POST to /convert-async with the client's report URL. Rendr returns a job ID immediately." },
      { step: "Rendr renders charts and data", detail: "Headless Chromium loads the React page, waits for charts to animate and data to populate, then captures the PDF." },
      { step: "Webhook delivers the PDF URL", detail: "Once ready, Rendr calls the configured webhook. The backend emails the PDF link to the client." },
    ],
  },
  {
    slug: "real-estate-property-brochures",
    color: "amber",
    industry: "Real Estate",
    title: "On-demand property brochures for a real estate agency",
    subtitle: "How a property firm generates branded listing PDFs from their CMS",
    summary:
      "A real estate agency with 200+ active listings needed professional property brochures for each listing — with photos, floor plans, pricing, and agent contact info. Creating these manually in InDesign took their marketing team hours per listing.",
    challenge:
      "Each property brochure needed high-resolution photos, a floor plan layout, pricing tables, and agent details — all branded consistently. The marketing team was spending 1-2 hours per brochure in InDesign. With 15-20 new listings per week, they couldn't keep up. They needed an automated system that non-technical agents could use.",
    solution:
      "They built an HTML template in Rendr with variables for property data — photos, description, price, bedrooms, floor plan image, and agent info. Their CMS (built on WordPress) has a \"Generate Brochure\" button that calls their backend, which sends the template + variables to Rendr. The PDF is generated in landscape A4 with print-ready quality. Agents get a download link within seconds.",
    results: [
      "Brochure creation dropped from 1-2 hours to under 10 seconds",
      "Agents generate their own brochures — no marketing team bottleneck",
      "Consistent branding across all 200+ listings automatically",
      "Print-quality PDFs with high-res images and custom layouts",
    ],
    stack: ["WordPress (CMS)", "PHP backend", "Rendr API (PDF)", "AWS S3 (storage)"],
    quote: {
      text: "Our agents used to wait days for marketing to make a brochure. Now they click a button and have it in 10 seconds. It changed our workflow completely.",
      role: "Operations Manager",
    },
    howItWorks: [
      { step: "Agent clicks \"Generate Brochure\" on a listing", detail: "The CMS sends all property data — photos, description, price, features — to the backend." },
      { step: "Backend maps data to Rendr template variables", detail: "Property fields are mapped to template variables like {{property_name}}, {{price}}, {{photo_1}}, {{floor_plan}}." },
      { step: "Rendr renders the brochure template", detail: "The HTML template with CSS print styles is rendered in landscape A4 with printBackground enabled for full-bleed images." },
      { step: "Agent downloads the branded PDF", detail: "The download link is returned instantly — the agent can email it to clients or print it for open houses." },
    ],
  },
  {
    slug: "legal-contract-generation",
    color: "rose",
    industry: "Legal / Compliance",
    title: "Automated NDA and contract generation for a legal platform",
    subtitle: "How a legal tech startup replaced their document assembly tool",
    summary:
      "A legal tech startup offered NDA and contract generation as part of their platform. Their previous solution used a Word-to-PDF conversion pipeline that was fragile, slow, and produced inconsistent formatting across operating systems.",
    challenge:
      "Their original pipeline converted DOCX templates to PDF via LibreOffice running in a Docker container. Formatting differences between LibreOffice versions caused fonts to shift, tables to misalign, and page breaks to appear in wrong places. Every OS update was a risk. Clients — mostly law firms — had zero tolerance for formatting errors in legal documents.",
    solution:
      "They rebuilt their templates in HTML/CSS with Rendr's template system. Legal variables (party names, dates, clauses, signatures) are passed as template variables. The HTML templates use CSS page-break rules for precise pagination. Rendr renders them identically every time — no OS dependency, no LibreOffice version drift. Tagged PDFs with metadata (title, author) are generated for compliance archiving.",
    results: [
      "100% consistent formatting — no more OS-dependent rendering bugs",
      "Contract generation time reduced from 8-12 seconds to under 2 seconds",
      "Tagged PDFs with metadata meet compliance archiving requirements",
      "Template updates deploy instantly — no Docker rebuilds needed",
    ],
    stack: ["Next.js (platform)", "Rendr API (PDF)", "PostgreSQL (contracts DB)", "DocuSign (signatures)"],
    quote: {
      text: "In legal, a misaligned table or a shifted page break isn't just ugly — it's a liability. Rendr gives us pixel-perfect contracts every single time.",
      role: "Head of Engineering",
    },
    howItWorks: [
      { step: "User fills in contract details on the platform", detail: "Party names, effective date, jurisdiction, specific clauses — all entered through a guided form." },
      { step: "Platform selects the right template and injects variables", detail: "Based on contract type (NDA, MSA, SOW), the correct HTML template is chosen and variables are populated." },
      { step: "Rendr renders with metadata and precise pagination", detail: "CSS page-break rules ensure sections never split awkwardly. PDF metadata (title, author) is added for archiving." },
      { step: "Contract is ready for review and e-signature", detail: "The generated PDF is previewed in the platform and can be sent directly to DocuSign for signing." },
    ],
  },
  {
    slug: "startup-investor-updates",
    color: "orange",
    industry: "Startups / VC",
    title: "Monthly investor update PDFs from a Notion-like dashboard",
    subtitle: "How a startup automates polished investor reports from their internal tool",
    summary:
      "A Series A startup sends monthly investor updates to 30+ investors. Their CEO was spending half a day each month formatting a Google Doc into something presentable. They wanted to automate it from their internal metrics dashboard.",
    challenge:
      "The monthly investor update included MRR charts, burn rate, hiring updates, and key milestones. The CEO manually copied data from their dashboard into a Google Doc, formatted it, exported to PDF, and emailed it to each investor. The process took 4-5 hours and the result still looked inconsistent. They wanted a system where the CEO fills in commentary and the rest is pulled automatically.",
    solution:
      "They built a simple internal page (/investor-update/2024-01) that pulls live metrics from their database and renders them alongside a text field for CEO commentary. When the update is finalized, they call Rendr's API with the page URL. The PDF includes charts, a KPI summary table, and the CEO's narrative — all styled with their brand. The PDF is then emailed to the investor list via their email tool.",
    results: [
      "Monthly update process cut from 4-5 hours to 15 minutes",
      "Professional, branded PDFs that investors actually read and share",
      "Metrics are pulled live — no manual copy-paste errors",
      "Archived updates create a consistent track record for due diligence",
    ],
    stack: ["Next.js (internal tool)", "Rendr API (PDF)", "Resend (email)", "PostgreSQL (metrics)"],
    quote: {
      text: "I used to dread investor update day. Now I write my commentary, hit a button, and 30 investors get a polished PDF. It takes 15 minutes instead of half a day.",
      role: "CEO & Co-founder",
    },
    howItWorks: [
      { step: "CEO opens the investor update page", detail: "The page auto-populates with the latest MRR, burn, runway, headcount, and milestone data from the database." },
      { step: "CEO adds narrative commentary", detail: "A text editor allows the CEO to add context, wins, challenges, and asks — the human element investors want." },
      { step: "\"Generate PDF\" sends the URL to Rendr", detail: "The page URL is sent to Rendr's sync API. The PDF is returned in seconds with charts, tables, and branding intact." },
      { step: "PDF is emailed to the investor list", detail: "The backend sends the PDF as an attachment to all investors on the distribution list via Resend." },
    ],
  },
];
