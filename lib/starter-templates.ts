import type { PrismaClient } from "@prisma/client";

export type StarterTemplate = { name: string; html: string };

export const STARTER_TEMPLATES: StarterTemplate[] = [
  // ─── 1. Invoice ──────────────────────────────────────────────────────────────
  {
    name: "Invoice",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Invoice</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
    color: #111; background: #fff; padding: 60px; font-size: 13px; line-height: 1.6;
  }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 52px; }
  .company-name { font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
  .company-details { margin-top: 6px; color: #666; font-size: 12px; line-height: 1.8; }
  .invoice-meta { text-align: right; }
  .invoice-meta h1 { font-size: 34px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; }
  .invoice-meta .number { color: #888; font-size: 13px; margin-top: 2px; }
  .info-grid {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px;
    margin-bottom: 40px; padding-bottom: 40px; border-bottom: 1px solid #e5e7eb;
  }
  .info-block label {
    font-size: 10px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 1px; color: #9ca3af; display: block; margin-bottom: 6px;
  }
  .info-block p { color: #374151; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
  thead th {
    text-align: left; font-size: 10px; font-weight: 600; text-transform: uppercase;
    letter-spacing: 1px; color: #9ca3af; padding: 0 12px 12px 0; border-bottom: 1px solid #e5e7eb;
  }
  thead th:last-child { text-align: right; padding-right: 0; }
  tbody td { padding: 14px 12px 14px 0; border-bottom: 1px solid #f3f4f6; color: #374151; vertical-align: top; }
  tbody td:last-child { text-align: right; padding-right: 0; }
  .totals { display: flex; justify-content: flex-end; }
  .totals-box { width: 260px; }
  .totals-row { display: flex; justify-content: space-between; padding: 6px 0; color: #6b7280; font-size: 13px; }
  .totals-row.grand-total {
    margin-top: 10px; padding-top: 14px; border-top: 2px solid #111;
    font-size: 16px; font-weight: 700; color: #111;
  }
  .notes {
    margin-top: 52px; padding-top: 28px; border-top: 1px solid #e5e7eb;
    font-size: 12px; color: #6b7280; line-height: 1.7;
  }
  .notes strong { color: #374151; font-weight: 600; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company-name">{{company_name}}</div>
      <div class="company-details">{{company_address}}<br>{{company_email}}</div>
    </div>
    <div class="invoice-meta">
      <h1>Invoice</h1>
      <div class="number">{{invoice_number}}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-block">
      <label>Bill To</label>
      <p>{{client_name}}<br>{{client_address}}</p>
    </div>
    <div class="info-block">
      <label>Invoice Date</label>
      <p>{{invoice_date}}</p>
    </div>
    <div class="info-block">
      <label>Due Date</label>
      <p>{{due_date}}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:50%">Description</th>
        <th>Qty</th>
        <th>Rate</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{{item_description}}</td>
        <td>{{item_qty}}</td>
        <td>{{item_rate}}</td>
        <td>{{item_amount}}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-box">
      <div class="totals-row"><span>Subtotal</span><span>{{subtotal}}</span></div>
      <div class="totals-row"><span>Tax ({{tax_rate}}%)</span><span>{{tax_amount}}</span></div>
      <div class="totals-row grand-total"><span>Total Due</span><span>{{total}}</span></div>
    </div>
  </div>

  <div class="notes">
    <strong>Payment Instructions</strong><br>
    {{payment_instructions}}
  </div>
</body>
</html>`,
  },

  // ─── 2. Receipt ──────────────────────────────────────────────────────────────
  {
    name: "Receipt",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Receipt</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
    background: #f1f5f9; padding: 60px 24px;
    display: flex; justify-content: center;
  }
  .receipt {
    background: #fff; width: 380px; border-radius: 12px; overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06);
  }
  .top {
    background: #0f172a; color: #fff; text-align: center; padding: 32px 24px;
  }
  .top h1 { font-size: 20px; font-weight: 700; }
  .top p { font-size: 12px; color: #94a3b8; margin-top: 4px; }
  .amount-section {
    text-align: center; padding: 32px 24px;
    border-bottom: 2px dashed #e5e7eb;
  }
  .amount-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 8px; }
  .amount { font-size: 46px; font-weight: 800; letter-spacing: -2px; color: #0f172a; }
  .rows { padding: 20px 24px; }
  .row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px;
  }
  .row:last-child { border-bottom: none; }
  .row .lbl { color: #94a3b8; }
  .row .val { color: #0f172a; font-weight: 500; }
  .footer {
    text-align: center; padding: 18px 24px 28px;
    border-top: 2px dashed #e5e7eb;
    font-size: 12px; color: #94a3b8; line-height: 1.8;
  }
</style>
</head>
<body>
  <div class="receipt">
    <div class="top">
      <h1>{{business_name}}</h1>
      <p>{{business_address}}</p>
    </div>

    <div class="amount-section">
      <div class="amount-label">Amount Paid</div>
      <div class="amount">{{amount}}</div>
    </div>

    <div class="rows">
      <div class="row"><span class="lbl">Receipt #</span><span class="val">{{receipt_number}}</span></div>
      <div class="row"><span class="lbl">Date</span><span class="val">{{date}}</span></div>
      <div class="row"><span class="lbl">Customer</span><span class="val">{{customer_name}}</span></div>
      <div class="row"><span class="lbl">Description</span><span class="val">{{item_description}}</span></div>
      <div class="row"><span class="lbl">Payment Method</span><span class="val">{{payment_method}}</span></div>
      <div class="row"><span class="lbl">Served by</span><span class="val">{{cashier}}</span></div>
    </div>

    <div class="footer">
      Thank you for your payment.<br>
      Please keep this receipt for your records.
    </div>
  </div>
</body>
</html>`,
  },

  // ─── 3. Business Letter ───────────────────────────────────────────────────────
  {
    name: "Business Letter",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Business Letter</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    color: #1a1a1a; background: #fff;
    padding: 80px 100px; font-size: 14px; line-height: 1.8;
  }
  .sender { margin-bottom: 40px; }
  .sender .name { font-size: 16px; font-weight: bold; margin-bottom: 2px; }
  .sender .details { color: #555; line-height: 1.7; }
  .date { margin-bottom: 36px; color: #333; }
  .recipient { margin-bottom: 36px; }
  .recipient .name { font-weight: bold; }
  .recipient .details { color: #333; line-height: 1.7; }
  .subject { font-weight: bold; margin-bottom: 24px; }
  .salutation { margin-bottom: 20px; }
  .body { color: #222; margin-bottom: 40px; }
  .closing-word { margin-bottom: 52px; }
  .sig-name { font-weight: bold; font-size: 15px; }
  .sig-title { color: #666; font-size: 13px; margin-top: 4px; }
</style>
</head>
<body>
  <div class="sender">
    <div class="name">{{sender_name}}</div>
    <div class="details">
      {{sender_title}}<br>
      {{sender_address}}<br>
      {{sender_email}}
    </div>
  </div>

  <div class="date">{{date}}</div>

  <div class="recipient">
    <div class="name">{{recipient_name}}</div>
    <div class="details">
      {{recipient_title}}<br>
      {{recipient_address}}
    </div>
  </div>

  <div class="subject">Re: {{subject}}</div>
  <div class="salutation">Dear {{recipient_name}},</div>

  <div class="body">{{body}}</div>

  <div>
    <div class="closing-word">{{closing}},</div>
    <div class="sig-name">{{sender_name}}</div>
    <div class="sig-title">{{sender_title}}</div>
  </div>
</body>
</html>`,
  },

  // ─── 4. Certificate of Completion ────────────────────────────────────────────
  {
    name: "Certificate of Completion",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Certificate</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    background: #fffdf7;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    min-height: 100vh;
  }
  .cert {
    border: 3px solid #b8972a;
    padding: 5px;
    width: 740px;
  }
  .cert-inner {
    border: 1px solid #d4af37;
    padding: 64px 80px;
    text-align: center;
    position: relative;
    background: #fffdf7;
  }
  .corner {
    position: absolute; width: 28px; height: 28px;
    border-color: #d4af37; border-style: solid;
  }
  .tl { top: 14px; left: 14px; border-width: 2px 0 0 2px; }
  .tr { top: 14px; right: 14px; border-width: 2px 2px 0 0; }
  .bl { bottom: 14px; left: 14px; border-width: 0 0 2px 2px; }
  .br { bottom: 14px; right: 14px; border-width: 0 2px 2px 0; }
  .org {
    font-size: 12px; text-transform: uppercase; letter-spacing: 5px;
    color: #8a7340; margin-bottom: 28px;
  }
  .cert-title {
    font-size: 46px; font-weight: normal; color: #1a1a1a;
    letter-spacing: -1px; margin-bottom: 6px;
  }
  .cert-subtitle {
    font-size: 13px; text-transform: uppercase; letter-spacing: 4px;
    color: #8a7340; margin-bottom: 36px;
  }
  .divider {
    width: 72px; border: none; border-top: 2px solid #d4af37;
    margin: 0 auto 36px;
  }
  .presented-to {
    font-size: 12px; text-transform: uppercase; letter-spacing: 3px;
    color: #8a7340; margin-bottom: 14px;
  }
  .recipient {
    font-size: 40px; color: #1a1a1a; font-style: italic;
    margin-bottom: 28px; letter-spacing: -0.5px;
  }
  .for-completing { font-size: 13px; color: #666; margin-bottom: 10px; }
  .course-name { font-size: 22px; font-weight: bold; color: #1a1a1a; margin-bottom: 6px; }
  .completion-date { font-size: 13px; color: #888; margin-bottom: 52px; }
  .sigs {
    display: flex; justify-content: space-around;
    padding-top: 24px; border-top: 1px solid #e5d9a0;
  }
  .sig .name { font-size: 15px; font-weight: bold; color: #1a1a1a; margin-bottom: 4px; }
  .sig .title { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #8a7340; }
</style>
</head>
<body>
  <div class="cert">
    <div class="cert-inner">
      <div class="corner tl"></div>
      <div class="corner tr"></div>
      <div class="corner bl"></div>
      <div class="corner br"></div>

      <div class="org">{{organization_name}}</div>
      <div class="cert-title">Certificate</div>
      <div class="cert-subtitle">of Completion</div>
      <hr class="divider">
      <div class="presented-to">This certifies that</div>
      <div class="recipient">{{recipient_name}}</div>
      <div class="for-completing">has successfully completed</div>
      <div class="course-name">{{course_name}}</div>
      <div class="completion-date">Completed on {{completion_date}}</div>

      <div class="sigs">
        <div class="sig">
          <div class="name">{{issuer_name}}</div>
          <div class="title">{{issuer_title}}</div>
        </div>
        <div class="sig">
          <div class="name">{{organization_name}}</div>
          <div class="title">Issuing Organization</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`,
  },

  // ─── 5. Project Proposal ─────────────────────────────────────────────────────
  {
    name: "Project Proposal",
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Project Proposal</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
    color: #1a1a1a; background: #fff; font-size: 14px; line-height: 1.7;
  }
  .cover {
    background: #0f172a; color: #fff;
    padding: 80px 64px 64px; min-height: 300px;
    display: flex; flex-direction: column; justify-content: flex-end;
  }
  .cover .eyebrow {
    font-size: 11px; text-transform: uppercase; letter-spacing: 4px;
    color: #64748b; margin-bottom: 20px;
  }
  .cover h1 {
    font-size: 42px; font-weight: 800; letter-spacing: -1.5px;
    line-height: 1.1; margin-bottom: 20px;
  }
  .cover .meta { font-size: 13px; color: #94a3b8; }
  .cover .meta span { color: #e2e8f0; font-weight: 500; }
  .content { padding: 56px 64px; }
  .section { margin-bottom: 44px; }
  .section-title {
    font-size: 10px; text-transform: uppercase; letter-spacing: 2px;
    font-weight: 700; color: #0f172a;
    padding-bottom: 10px; border-bottom: 2px solid #0f172a; margin-bottom: 18px;
  }
  .section p { color: #374151; }
  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .detail-item label {
    font-size: 10px; text-transform: uppercase; letter-spacing: 1px;
    color: #9ca3af; display: block; margin-bottom: 4px;
  }
  .detail-item p { color: #111; font-weight: 500; }
  .highlight {
    background: #f8fafc; border-left: 3px solid #3b82f6;
    padding: 16px 20px; border-radius: 0 8px 8px 0; color: #374151;
  }
  .foot {
    background: #f8fafc; padding: 22px 64px;
    border-top: 1px solid #e5e7eb;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 12px; color: #9ca3af;
  }
  .foot .brand { font-weight: 600; color: #374151; }
</style>
</head>
<body>
  <div class="cover">
    <div class="eyebrow">Project Proposal</div>
    <h1>{{project_name}}</h1>
    <div class="meta">
      Prepared for <span>{{client_name}}</span> &nbsp;·&nbsp; {{date}}
    </div>
  </div>

  <div class="content">
    <div class="section">
      <div class="section-title">Project Details</div>
      <div class="detail-grid">
        <div class="detail-item"><label>Client</label><p>{{client_name}}</p></div>
        <div class="detail-item"><label>Prepared By</label><p>{{prepared_by}}</p></div>
        <div class="detail-item"><label>Timeline</label><p>{{timeline}}</p></div>
        <div class="detail-item"><label>Investment</label><p>{{investment}}</p></div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Overview</div>
      <p>{{overview}}</p>
    </div>

    <div class="section">
      <div class="section-title">Scope of Work</div>
      <div class="highlight">{{scope}}</div>
    </div>

    <div class="section">
      <div class="section-title">Deliverables</div>
      <p>{{deliverables}}</p>
    </div>
  </div>

  <div class="foot">
    <div class="brand">{{prepared_by}}</div>
    <div>{{date}}</div>
  </div>
</body>
</html>`,
  },
];

/**
 * Seeds starter templates for a newly created user.
 * Skips if the user already has templates (idempotent).
 */
export async function seedStarterTemplates(
  userId: string,
  prisma: PrismaClient
): Promise<void> {
  const existing = await prisma.template.count({ where: { userId } });
  if (existing > 0) return;

  await prisma.template.createMany({
    data: STARTER_TEMPLATES.map((t) => ({
      userId,
      name: t.name,
      html: t.html,
    })),
  });
}
