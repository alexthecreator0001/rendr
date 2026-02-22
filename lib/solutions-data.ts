export interface SolutionFeature {
  icon: string;
  title: string;
  description: string;
}

export interface Solution {
  slug: string;
  icon: string; // lucide icon name
  color: string; // "blue" | "emerald" | "violet" | "amber" | "slate" | "rose" | "orange" | "sky"
  label: string;
  title: string;
  tagline: string;
  description: string;
  forWho: string[];
  challenge: {
    headline: string;
    points: string[];
  };
  features: SolutionFeature[];
  codeExample: string;
  relatedSlugs: string[];
}

export const SOLUTIONS: Solution[] = [
  {
    slug: "invoicing",
    icon: "Receipt",
    color: "blue",
    label: "Finance & Billing",
    title: "Invoice Generation at Scale",
    tagline: "Pixel-perfect invoices. Every client. Every month. Zero effort.",
    description:
      "Automate PDF invoice generation inside your billing platform. Rendr handles rendering at any volume — your team focuses on the business logic, not the PDF stack.",
    forWho: ["SaaS billing platforms", "Freelancer tools", "Accounting software", "ERP systems"],
    challenge: {
      headline: "Invoice PDFs shouldn't be this hard",
      points: [
        "Browser-based rendering breaks on complex layouts, multi-page line items, and tax tables at high volume.",
        "Maintaining wkhtmltopdf or Puppeteer is a full-time job — security patches, version pinning, memory leaks.",
        "Invoices must be pixel-perfect for regulatory and audit compliance — close enough isn't good enough.",
      ],
    },
    features: [
      {
        icon: "Layers",
        title: "Template-driven variable substitution",
        description:
          "Store your invoice layout once. Render with client name, line items, totals, and tax rates pulled from your database at render time. No template logic in your app code.",
      },
      {
        icon: "Zap",
        title: "Async bulk generation",
        description:
          "Fire all monthly invoices in parallel. Each render is an independent async job — Rendr queues and processes them without rate-limit headaches. Receive a webhook when each batch finishes.",
      },
      {
        icon: "Globe",
        title: "A4, Letter, and custom paper sizes",
        description:
          "Different markets expect different paper sizes. Switch between A4 (EU), Letter (US), and Legal with a single field. Custom margins let you hit country-specific formatting requirements.",
      },
    ],
    codeExample: `// 1. Create your invoice template once (via dashboard or API)
const template = await fetch("https://rendrpdf.com/api/v1/templates", {
  method: "POST",
  headers: { Authorization: "Bearer rk_live_YOUR_KEY", "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Monthly Invoice",
    html: invoiceHtml, // your HTML with {{variables}}
  }),
}).then(r => r.json());

// 2. Render for each customer at billing time
const job = await fetch("https://rendrpdf.com/api/v1/convert", {
  method: "POST",
  headers: { Authorization: "Bearer rk_live_YOUR_KEY", "Content-Type": "application/json" },
  body: JSON.stringify({
    input: {
      type: "template",
      template_id: template.id,
      variables: {
        invoice_number: "INV-2026-0142",
        client_name: "Acme Corp",
        due_date: "March 15, 2026",
        subtotal: "$2,400.00",
        tax: "$240.00",
        total: "$2,640.00",
      },
    },
    options: { format: "A4" },
    idempotency_key: \`invoice-INV-2026-0142\`,
  }),
}).then(r => r.json());

// job.pdf_url → ready to attach to email or store in S3`,
    relatedSlugs: ["ecommerce-receipts", "legal-contracts", "hr-documents"],
  },

  {
    slug: "ecommerce-receipts",
    icon: "ShoppingBag",
    color: "emerald",
    label: "E-commerce",
    title: "Order Receipts & Packing Slips",
    tagline: "One template. Thousands of orders. Zero manual work.",
    description:
      "Generate branded PDF receipts, order confirmations, and packing slips triggered by your checkout events — without maintaining a rendering stack inside your store.",
    forWho: ["Online stores", "Marketplaces", "Shopify apps", "Custom checkouts"],
    challenge: {
      headline: "Every order needs a document",
      points: [
        "Email receipts aren't enough — customers, accountants, and finance teams all need PDF copies.",
        "Maintaining separate rendering logic for order PDFs, packing slips, and return labels is fragmented and brittle.",
        "Black Friday and flash sale spikes can send rendering load 100× above baseline — synchronous rendering doesn't survive it.",
      ],
    },
    features: [
      {
        icon: "Webhook",
        title: "Webhook-triggered generation",
        description:
          "Call Rendr from your order.completed webhook handler. Each render is queued immediately and fires a callback to your endpoint when the PDF is ready — no polling, no waiting.",
      },
      {
        icon: "Layers",
        title: "Template per brand or store",
        description:
          "Multi-vendor marketplaces can maintain one template per merchant brand. Variables swap in logos, brand colors (via inline CSS), and merchant addresses at render time.",
      },
      {
        icon: "Clock",
        title: "Queue absorbs traffic spikes",
        description:
          "Async rendering decouples PDF generation from your checkout request. No matter how many simultaneous orders land, they queue and render without dropping or timing out.",
      },
    ],
    codeExample: `// In your order webhook handler (e.g. Shopify, Stripe, custom)
app.post("/webhooks/order-completed", async (req, res) => {
  const order = req.body;
  res.sendStatus(200); // acknowledge immediately

  // Fire async PDF render — don't block the response
  await fetch("https://rendrpdf.com/api/v1/convert-async", {
    method: "POST",
    headers: { Authorization: "Bearer rk_live_YOUR_KEY", "Content-Type": "application/json" },
    body: JSON.stringify({
      input: {
        type: "template",
        template_id: RECEIPT_TEMPLATE_ID,
        variables: {
          order_number: order.id,
          customer_name: order.customer.name,
          order_date: new Date(order.created_at).toLocaleDateString(),
          items: order.line_items.map(i => \`\${i.quantity}× \${i.name}\`).join(", "),
          total: order.total_price,
          payment_method: order.payment_gateway,
        },
      },
      webhook_url: "https://yourapp.com/webhooks/pdf-ready",
      idempotency_key: \`receipt-\${order.id}\`,
    }),
  });
});`,
    relatedSlugs: ["invoicing", "reporting", "hr-documents"],
  },

  {
    slug: "hr-documents",
    icon: "UserCheck",
    color: "violet",
    label: "Human Resources",
    title: "Offer Letters & HR Documents",
    tagline: "Personalized documents at any hiring volume.",
    description:
      "Generate employment contracts, offer letters, payslips, and onboarding packets dynamically from your HR platform — consistent formatting, zero manual editing.",
    forWho: ["HRIS platforms", "ATS software", "Onboarding tools", "Staffing agencies"],
    challenge: {
      headline: "HR documents are repetitive but high-stakes",
      points: [
        "Word mail-merge produces inconsistent results and breaks on complex layouts — and it doesn't scale past a few dozen documents.",
        "Legal teams require exact formatting — the wrong indentation or missing clause can invalidate a contract.",
        "Mass hiring events (seasonal ramp, IPO) require hundreds of personalized offer letters within 48 hours.",
      ],
    },
    features: [
      {
        icon: "Layers",
        title: "One template per document type",
        description:
          "Maintain a separate template for offer letters, NDAs, payslips, and contracts. Variables pull from your HRIS data — name, title, salary, start date, reporting manager.",
      },
      {
        icon: "Zap",
        title: "Batch generation for mass hiring",
        description:
          "Fire all offer letters in a single async sweep using Promise.all. Each is an independent job — failures don't block others. Idempotency keys prevent duplicates on retries.",
      },
      {
        icon: "Lock",
        title: "Signed, expiring download URLs",
        description:
          "Every generated document is served via a signed URL with your download token. Share securely with candidates without exposing cloud storage credentials.",
      },
    ],
    codeExample: `// Bulk offer letter generation — mass hiring event
const candidates = await db.candidates.findMany({
  where: { status: "offer_approved", offerSentAt: null },
});

const results = await Promise.all(
  candidates.map(candidate =>
    fetch("https://rendrpdf.com/api/v1/convert", {
      method: "POST",
      headers: { Authorization: "Bearer rk_live_YOUR_KEY", "Content-Type": "application/json" },
      body: JSON.stringify({
        input: {
          type: "template",
          template_id: OFFER_LETTER_TEMPLATE_ID,
          variables: {
            candidate_name: candidate.fullName,
            position_title: candidate.role,
            salary: candidate.offerSalary,
            start_date: candidate.startDate,
            reporting_to: candidate.manager,
            offer_deadline: candidate.offerExpiry,
          },
        },
        idempotency_key: \`offer-\${candidate.id}-v1\`,
      }),
    }).then(r => r.json())
  )
);

// results[i].pdf_url → attach to candidate portal or email`,
    relatedSlugs: ["legal-contracts", "invoicing", "certificates"],
  },

  {
    slug: "reporting",
    icon: "BarChart2",
    color: "amber",
    label: "Analytics & BI",
    title: "Automated Reports & PDF Exports",
    tagline: "Schedule reports. Deliver PDFs. No clicks required.",
    description:
      "Turn dashboard data into scheduled PDF reports. Render charts, tables, and KPI summaries as clean documents delivered to clients or stakeholders automatically.",
    forWho: ["Analytics platforms", "SaaS dashboards", "BI tools", "Client reporting agencies"],
    challenge: {
      headline: '"Export to PDF" is never as simple as it sounds',
      points: [
        "Charts and dynamic content need JavaScript to render — screenshot timing issues produce blank charts or half-loaded tables.",
        "Dashboard screenshots look pixelated in PDFs; Rendr renders the actual HTML at full resolution.",
        "Scheduled report delivery means generating thousands of unique PDFs weekly — synchronous rendering can't handle it.",
      ],
    },
    features: [
      {
        icon: "Clock",
        title: "waitFor — let JS finish before capture",
        description:
          "Set waitFor (0–10 seconds) to give your charting library time to animate and render before Playwright captures the page. No more blank chart exports.",
      },
      {
        icon: "Globe",
        title: "Render any public URL directly",
        description:
          "Point Rendr at your live dashboard URL. No need to export HTML — just pass the URL and let it render exactly what your customers see in the browser.",
      },
      {
        icon: "Webhook",
        title: "Async delivery for scheduled runs",
        description:
          "Enqueue all weekly reports at schedule time. Each renders independently in the job queue. A webhook fires when each is ready — trigger email delivery or cloud storage upload.",
      },
    ],
    codeExample: `// Weekly report scheduler — runs every Monday 8am
async function generateWeeklyReports() {
  const accounts = await db.accounts.findMany({ where: { plan: "pro" } });

  for (const account of accounts) {
    // Render their live dashboard URL directly
    await fetch("https://rendrpdf.com/api/v1/convert-async", {
      method: "POST",
      headers: { Authorization: "Bearer rk_live_YOUR_KEY", "Content-Type": "application/json" },
      body: JSON.stringify({
        input: {
          type: "url",
          url: \`https://app.yourplatform.com/reports/weekly?account=\${account.id}&token=\${account.reportToken}\`,
        },
        options: {
          format: "A4",
          landscape: true,
          waitFor: 3, // wait 3s for charts to animate
          printBackground: true,
          margin: { top: "15mm", right: "15mm", bottom: "15mm", left: "15mm" },
        },
        webhook_url: "https://yourapp.com/webhooks/report-ready",
        idempotency_key: \`weekly-report-\${account.id}-\${getWeekKey()}\`,
      }),
    });
  }
}`,
    relatedSlugs: ["invoicing", "ecommerce-receipts", "healthcare"],
  },

  {
    slug: "legal-contracts",
    icon: "Scale",
    color: "slate",
    label: "LegalTech",
    title: "Contracts & Legal Documents",
    tagline: "Dynamic legal docs. Consistent formatting. Auditable output.",
    description:
      "Generate NDAs, statements of work, service agreements, and retainer contracts where only the party information changes — at scale, with guaranteed formatting.",
    forWho: ["LegalTech platforms", "Contract management tools", "Law firm portals", "Freelancer platforms"],
    challenge: {
      headline: "Legal documents live and die by their formatting",
      points: [
        "One-off formatting mistakes in Word docs — wrong indentation, missing clause, shifted signature block — are costly and embarrassing.",
        "Version control for legal templates is a nightmare in document editors; you end up with contract-v3-FINAL-REAL-2.docx.",
        "Clients expect a branded, professional PDF — not an exported DOCX opened on their phone.",
      ],
    },
    features: [
      {
        icon: "Layers",
        title: "Template per document type",
        description:
          "Store your NDA, SOW, SLA, and retainer as separate templates. Variables inject party names, dates, payment terms, and jurisdiction-specific clauses at render time.",
      },
      {
        icon: "Check",
        title: "Idempotency — same key, same document",
        description:
          "Pass an idempotency_key tied to the contract ID. Re-generating the same contract always returns the identical document — safe to retry without creating duplicates in audit trails.",
      },
      {
        icon: "Lock",
        title: "Signed download URLs",
        description:
          "Documents are served via token-authenticated URLs. Share contracts securely with counterparties without exposing cloud storage. Tokens can be invalidated after signing.",
      },
    ],
    codeExample: `// Generate an NDA for a new partnership
const nda = await fetch("https://rendrpdf.com/api/v1/convert", {
  method: "POST",
  headers: { Authorization: "Bearer rk_live_YOUR_KEY", "Content-Type": "application/json" },
  body: JSON.stringify({
    input: {
      type: "template",
      template_id: NDA_TEMPLATE_ID,
      variables: {
        party_a_name: "Acme Corp",
        party_a_address: "123 Corporate Way, San Francisco, CA",
        party_b_name: "GlobalTech Ltd",
        party_b_address: "456 Enterprise Blvd, New York, NY",
        effective_date: "February 22, 2026",
        jurisdiction: "State of California",
        term_years: "2",
        prepared_by: "Legal Team",
      },
    },
    options: { format: "Letter", margin: { top: "25mm", right: "25mm", bottom: "25mm", left: "25mm" } },
    idempotency_key: \`nda-acme-globaltech-20260222\`,
  }),
}).then(r => r.json());

// nda.pdf_url → embed in your e-signature flow (DocuSign, HelloSign, etc.)`,
    relatedSlugs: ["hr-documents", "invoicing", "real-estate"],
  },

  {
    slug: "certificates",
    icon: "Award",
    color: "rose",
    label: "EdTech",
    title: "Certificates & Diplomas",
    tagline: "Every learner gets a certificate that actually looks good.",
    description:
      "Issue completion certificates, diplomas, and achievement awards automatically at course completion — each one personalized, print-ready, and delivered instantly.",
    forWho: ["EdTech platforms", "LMS software", "Corporate training tools", "Bootcamps"],
    challenge: {
      headline: "Manual certificate generation doesn't scale",
      points: [
        "Editing and exporting certificates one-by-one in Illustrator or Canva for hundreds of learners is untenable.",
        "Certificates need to look premium — Canva exports and Word docs don't build trust.",
        "Learners expect an immediate download link after completing a course — not waiting until the next business day.",
      ],
    },
    features: [
      {
        icon: "Type",
        title: "Google Fonts — elegant typography",
        description:
          "Use Playfair Display for diploma-style serif elegance, Inter for modern certificates, or any Google Fonts family. Fonts load inside the Playwright renderer for consistent output.",
      },
      {
        icon: "Zap",
        title: "Batch generation — 1,000 certificates in minutes",
        description:
          "Fire all course completers in parallel with Promise.all. Each certificate is an independent async job. Cohort completions and graduation events are handled in one sweep.",
      },
      {
        icon: "Webhook",
        title: "Instant delivery via webhook",
        description:
          "Trigger a webhook callback the moment each certificate renders. Immediately update the learner's profile with the download URL — no polling, no delay.",
      },
    ],
    codeExample: `// Triggered when a learner completes a course
async function issueCertificate(learner, course) {
  const job = await fetch("https://rendrpdf.com/api/v1/convert", {
    method: "POST",
    headers: { Authorization: "Bearer rk_live_YOUR_KEY", "Content-Type": "application/json" },
    body: JSON.stringify({
      input: {
        type: "template",
        template_id: CERTIFICATE_TEMPLATE_ID,
        variables: {
          recipient_name: learner.fullName,
          course_name: course.title,
          completion_date: new Date().toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric",
          }),
          organization_name: "Your Academy",
          issuer_name: course.instructor,
          issuer_title: "Program Director",
          certificate_id: \`CERT-\${learner.id}-\${course.id}\`,
        },
      },
      options: { format: "Letter", landscape: true, printBackground: true },
      idempotency_key: \`cert-\${learner.id}-\${course.id}\`,
    }),
  }).then(r => r.json());

  // Store pdf_url on learner record and send email
  await db.completions.update({ where: { learnerId_courseId: { learnerId: learner.id, courseId: course.id } }, data: { certificateUrl: job.pdf_url } });
}`,
    relatedSlugs: ["hr-documents", "legal-contracts", "reporting"],
  },

  {
    slug: "real-estate",
    icon: "Building2",
    color: "orange",
    label: "PropTech",
    title: "Real Estate & Property Documents",
    tagline: "Lease agreements, listing one-pagers, and inspection reports — print-ready.",
    description:
      "Generate lease agreements, property inspection reports, listing PDFs, and tenant packets from your property management platform data — precise formatting, every time.",
    forWho: ["Property management platforms", "PropTech startups", "Real estate agents", "Tenant apps"],
    challenge: {
      headline: "Property documents come in every shape and size",
      points: [
        "Lease agreements span multiple pages with complex variable content — tenant names, unit details, deposit amounts, addenda.",
        "Property listing PDFs need precise layout — photos, specifications, agent bio, maps — all in one print-ready document.",
        "Different jurisdictions require different paper sizes (Letter vs Legal), margins, and formatting for legal compliance.",
      ],
    },
    features: [
      {
        icon: "Globe",
        title: "Multi-format: Letter, Legal, A4, A3",
        description:
          "Switch paper size per document type — standard Letter for listings, Legal for lease agreements, A3 for floor plan PDFs. No code changes, just a single options field.",
      },
      {
        icon: "Layers",
        title: "Template per document type",
        description:
          "Maintain separate templates for leases, inspection reports, listing one-pagers, and welcome packets. Variables inject tenant, property, and agent data at render time.",
      },
      {
        icon: "Check",
        title: "Print background for photos and maps",
        description:
          "Property documents use color heavily — floor plan shading, photo sections, branding. printBackground: true ensures all background colors and images render correctly in the PDF.",
      },
    ],
    codeExample: `// Generate a lease agreement when a tenancy is confirmed
async function generateLeaseAgreement(tenancy) {
  const job = await fetch("https://rendrpdf.com/api/v1/convert", {
    method: "POST",
    headers: { Authorization: "Bearer rk_live_YOUR_KEY", "Content-Type": "application/json" },
    body: JSON.stringify({
      input: {
        type: "template",
        template_id: LEASE_TEMPLATE_ID,
        variables: {
          tenant_name: tenancy.tenant.fullName,
          tenant_address: tenancy.tenant.currentAddress,
          property_address: tenancy.property.address,
          unit_number: tenancy.unit,
          monthly_rent: tenancy.rent,
          security_deposit: tenancy.deposit,
          lease_start: tenancy.startDate,
          lease_end: tenancy.endDate,
          landlord_name: tenancy.property.owner,
          landlord_email: tenancy.property.ownerEmail,
        },
      },
      options: {
        format: "Legal", // legal-size for lease agreements
        printBackground: true,
        margin: { top: "25mm", right: "20mm", bottom: "25mm", left: "20mm" },
      },
      idempotency_key: \`lease-\${tenancy.id}\`,
    }),
  }).then(r => r.json());

  return job.pdf_url; // share with tenant via portal
}`,
    relatedSlugs: ["legal-contracts", "invoicing", "hr-documents"],
  },

  {
    slug: "healthcare",
    icon: "Activity",
    color: "sky",
    label: "Health Tech",
    title: "Healthcare & Patient Documents",
    tagline: "Clinical documents delivered with precision.",
    description:
      "Generate discharge summaries, visit notes, lab result reports, referral letters, and insurance documents inside your health platform — with accessibility compliance built in.",
    forWho: ["Digital health platforms", "Patient portals", "Telemedicine apps", "EHR integrations"],
    challenge: {
      headline: "Patient documents require precision and privacy",
      points: [
        "PDF generation in healthcare stacks is usually bolted on as an afterthought — wkhtmltopdf from 2014, inconsistent rendering across environments.",
        "Patients with visual impairments need tagged (PDF/UA) documents — most PDF tools don't support accessibility tagging.",
        "HIPAA considerations: patient data must not persist in third-party infrastructure beyond the minimum necessary.",
      ],
    },
    features: [
      {
        icon: "FileText",
        title: "Tagged PDF — screen reader accessible",
        description:
          "Pass tagged: true to generate PDF/UA compliant documents with proper heading structure and ARIA-like tags. Required for accessibility compliance and increasingly expected in healthcare.",
      },
      {
        icon: "Lock",
        title: "Data handled per-job",
        description:
          "Rendr processes each render request independently. PDFs are stored only with your signed download token — no browsable directory, no persistent PII beyond your download.",
      },
      {
        icon: "Check",
        title: "Print background for medical forms",
        description:
          "Clinical documents use color-coded sections, letterheads, and form backgrounds. printBackground: true ensures shading, borders, and brand colors render faithfully.",
      },
    ],
    codeExample: `// Generate a post-visit summary after a telemedicine appointment
async function generateVisitSummary(visit) {
  const job = await fetch("https://rendrpdf.com/api/v1/convert", {
    method: "POST",
    headers: { Authorization: "Bearer rk_live_YOUR_KEY", "Content-Type": "application/json" },
    body: JSON.stringify({
      input: {
        type: "template",
        template_id: VISIT_SUMMARY_TEMPLATE_ID,
        variables: {
          patient_name: visit.patient.fullName,
          date_of_birth: visit.patient.dob,
          visit_date: visit.date,
          provider_name: visit.provider.name,
          provider_specialty: visit.provider.specialty,
          chief_complaint: visit.chiefComplaint,
          assessment: visit.assessment,
          plan: visit.treatmentPlan,
          prescriptions: visit.prescriptions.join(", "),
          follow_up: visit.followUp,
        },
      },
      options: {
        format: "Letter",
        printBackground: true,
        tagged: true, // PDF/UA accessibility tags
        margin: { top: "20mm", right: "20mm", bottom: "20mm", left: "20mm" },
      },
      idempotency_key: \`visit-summary-\${visit.id}\`,
    }),
  }).then(r => r.json());

  // Store securely; share via patient portal (not email)
  return job.pdf_url;
}`,
    relatedSlugs: ["reporting", "legal-contracts", "hr-documents"],
  },
];

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}
