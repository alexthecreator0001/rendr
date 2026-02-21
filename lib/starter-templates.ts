import type { PrismaClient } from "@prisma/client";

export type StarterTemplate = { name: string; html: string };

export const STARTER_TEMPLATES: StarterTemplate[] = [

  // ─── 1. Invoice ──────────────────────────────────────────────────────────────
  {
    name: "Invoice",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #111; font-size: 13px; line-height: 1.6; }
.stripe { background: #1e40af; height: 6px; width: 100%; }
.wrap { padding: 48px 56px; }
.header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
.brand { font-size: 24px; font-weight: 800; color: #1e40af; letter-spacing: -0.5px; }
.brand-sub { font-size: 12px; color: #64748b; margin-top: 2px; }
.invoice-box { text-align: right; }
.invoice-box h1 { font-size: 36px; font-weight: 800; color: #0f172a; letter-spacing: -1px; line-height: 1; }
.invoice-box .num { font-size: 14px; color: #64748b; margin-top: 4px; font-weight: 600; }
.info { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; padding: 28px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; margin-bottom: 40px; }
.info-block label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; display: block; margin-bottom: 6px; }
.info-block p { color: #0f172a; font-size: 13px; line-height: 1.5; }
table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
thead { background: #f8fafc; }
thead th { padding: 12px 16px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; }
thead th:last-child { text-align: right; }
tbody td { padding: 14px 16px; border-bottom: 1px solid #f1f5f9; color: #374151; }
tbody td:last-child { text-align: right; font-weight: 500; }
.totals { display: flex; justify-content: flex-end; margin-bottom: 48px; }
.totals-box { width: 280px; }
.t-row { display: flex; justify-content: space-between; padding: 7px 0; color: #64748b; font-size: 13px; }
.t-row.grand { margin-top: 12px; padding-top: 16px; border-top: 2px solid #1e40af; font-size: 18px; font-weight: 800; color: #0f172a; }
.t-row.grand span:last-child { color: #1e40af; }
.footer { padding-top: 28px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; }
.footer strong { color: #475569; }
</style></head>
<body>
<div class="stripe"></div>
<div class="wrap">
  <div class="header">
    <div>
      <div class="brand">{{company_name}}</div>
      <div class="brand-sub">{{company_address}}</div>
      <div class="brand-sub">{{company_email}}</div>
    </div>
    <div class="invoice-box">
      <h1>INVOICE</h1>
      <div class="num">{{invoice_number}}</div>
    </div>
  </div>
  <div class="info">
    <div class="info-block"><label>Bill To</label><p>{{client_name}}<br>{{client_address}}</p></div>
    <div class="info-block"><label>Invoice Date</label><p>{{invoice_date}}</p></div>
    <div class="info-block"><label>Due Date</label><p>{{due_date}}</p></div>
  </div>
  <table>
    <thead><tr><th style="width:50%">Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
    <tbody>
      <tr><td>{{item_description}}</td><td>{{item_qty}}</td><td>{{item_rate}}</td><td>{{item_amount}}</td></tr>
    </tbody>
  </table>
  <div class="totals">
    <div class="totals-box">
      <div class="t-row"><span>Subtotal</span><span>{{subtotal}}</span></div>
      <div class="t-row"><span>Tax ({{tax_rate}}%)</span><span>{{tax_amount}}</span></div>
      <div class="t-row grand"><span>Total Due</span><span>{{total}}</span></div>
    </div>
  </div>
  <div class="footer"><strong>Payment Instructions:</strong> {{payment_instructions}}</div>
</div>
</body></html>`,
  },

  // ─── 2. Receipt ──────────────────────────────────────────────────────────────
  {
    name: "Receipt",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; background: #f8fafc; padding: 48px 24px; }
.card { background: #fff; max-width: 380px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 8px 32px rgba(0,0,0,0.07); }
.head { background: linear-gradient(135deg, #1e40af 0%, #7c3aed 100%); color: #fff; text-align: center; padding: 36px 24px; }
.head h1 { font-size: 20px; font-weight: 800; letter-spacing: -0.3px; }
.head p { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 4px; }
.amount-section { text-align: center; padding: 32px 24px; }
.amount-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 8px; font-weight: 600; }
.amount { font-size: 52px; font-weight: 900; letter-spacing: -3px; color: #0f172a; line-height: 1; }
.divider { border: none; border-top: 2px dashed #e2e8f0; margin: 0 24px; }
.rows { padding: 16px 24px; }
.row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f8fafc; font-size: 13px; }
.row:last-child { border-bottom: none; }
.row .lbl { color: #94a3b8; font-weight: 500; }
.row .val { color: #0f172a; font-weight: 600; }
.foot { text-align: center; padding: 20px 24px 28px; border-top: 2px dashed #e2e8f0; font-size: 12px; color: #94a3b8; line-height: 1.8; }
</style></head>
<body>
<div class="card">
  <div class="head">
    <h1>{{business_name}}</h1>
    <p>{{business_address}}</p>
  </div>
  <div class="amount-section">
    <div class="amount-label">Amount Paid</div>
    <div class="amount">{{amount}}</div>
  </div>
  <hr class="divider">
  <div class="rows">
    <div class="row"><span class="lbl">Receipt #</span><span class="val">{{receipt_number}}</span></div>
    <div class="row"><span class="lbl">Date</span><span class="val">{{date}}</span></div>
    <div class="row"><span class="lbl">Customer</span><span class="val">{{customer_name}}</span></div>
    <div class="row"><span class="lbl">Description</span><span class="val">{{item_description}}</span></div>
    <div class="row"><span class="lbl">Payment Method</span><span class="val">{{payment_method}}</span></div>
    <div class="row"><span class="lbl">Served by</span><span class="val">{{cashier}}</span></div>
  </div>
  <div class="foot">Thank you for your payment.<br>Keep this receipt for your records.</div>
</div>
</body></html>`,
  },

  // ─── 3. Business Letter ───────────────────────────────────────────────────────
  {
    name: "Business Letter",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Georgia, 'Times New Roman', serif; background: #fff; color: #1a1a1a; font-size: 14px; line-height: 1.8; }
.accent { background: #1e40af; height: 5px; }
.wrap { padding: 56px 80px; max-width: 680px; }
.sender { margin-bottom: 40px; }
.sender .name { font-size: 17px; font-weight: bold; color: #0f172a; }
.sender .details { color: #64748b; line-height: 1.7; font-size: 13px; margin-top: 4px; }
.date { color: #475569; margin-bottom: 32px; }
.recipient { margin-bottom: 32px; }
.recipient .name { font-weight: bold; }
.recipient .details { color: #475569; line-height: 1.7; font-size: 13px; }
.subject { font-weight: bold; color: #1e40af; margin-bottom: 24px; font-size: 14px; }
.body { color: #374151; margin-bottom: 44px; }
.closing-word { margin-bottom: 52px; color: #374151; }
.sig-name { font-size: 16px; font-weight: bold; color: #0f172a; }
.sig-title { color: #64748b; font-size: 13px; margin-top: 4px; }
</style></head>
<body>
<div class="accent"></div>
<div class="wrap">
  <div class="sender">
    <div class="name">{{sender_name}}</div>
    <div class="details">{{sender_title}}<br>{{sender_address}}<br>{{sender_email}}</div>
  </div>
  <div class="date">{{date}}</div>
  <div class="recipient">
    <div class="name">{{recipient_name}}</div>
    <div class="details">{{recipient_title}}<br>{{recipient_address}}</div>
  </div>
  <div class="subject">Re: {{subject}}</div>
  <div class="body">
    <p>Dear {{recipient_name}},</p>
    <br>
    <p>{{body}}</p>
  </div>
  <div>
    <div class="closing-word">{{closing}},</div>
    <div class="sig-name">{{sender_name}}</div>
    <div class="sig-title">{{sender_title}}</div>
  </div>
</div>
</body></html>`,
  },

  // ─── 4. Certificate of Completion ────────────────────────────────────────────
  {
    name: "Certificate of Completion",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: Georgia, 'Times New Roman', serif; background: #fdfbf5; padding: 48px; display: flex; justify-content: center; }
.cert { width: 740px; border: 3px solid #b8972a; padding: 5px; }
.cert-inner { border: 1px solid #d4af37; padding: 60px 72px; background: #fdfbf5; text-align: center; position: relative; }
.corner { position: absolute; width: 28px; height: 28px; border-color: #d4af37; border-style: solid; }
.tl { top: 14px; left: 14px; border-width: 2px 0 0 2px; }
.tr { top: 14px; right: 14px; border-width: 2px 2px 0 0; }
.bl { bottom: 14px; left: 14px; border-width: 0 0 2px 2px; }
.br { bottom: 14px; right: 14px; border-width: 0 2px 2px 0; }
.seal { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #b8972a, #f0d060, #b8972a); margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.org { font-size: 11px; text-transform: uppercase; letter-spacing: 5px; color: #8a7340; margin-bottom: 16px; }
.cert-title { font-size: 48px; font-weight: normal; color: #1a1a1a; letter-spacing: -1px; line-height: 1; margin-bottom: 6px; }
.cert-subtitle { font-size: 13px; text-transform: uppercase; letter-spacing: 4px; color: #8a7340; margin-bottom: 28px; }
.divider { width: 72px; border: none; border-top: 2px solid #d4af37; margin: 0 auto 28px; }
.presented-to { font-size: 12px; text-transform: uppercase; letter-spacing: 3px; color: #8a7340; margin-bottom: 12px; font-weight: 600; }
.recipient { font-size: 42px; color: #1a1a1a; font-style: italic; margin-bottom: 28px; letter-spacing: -0.5px; line-height: 1.1; }
.for-text { font-size: 13px; color: #64748b; margin-bottom: 10px; }
.course { font-size: 22px; font-weight: bold; color: #1a1a1a; margin-bottom: 6px; }
.date { font-size: 13px; color: #8a7340; margin-bottom: 44px; }
.sigs { display: flex; justify-content: space-around; padding-top: 20px; border-top: 1px solid #e5d9a0; }
.sig .name { font-size: 15px; font-weight: bold; color: #1a1a1a; margin-bottom: 4px; }
.sig .title { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #8a7340; }
</style></head>
<body>
<div class="cert">
  <div class="cert-inner">
    <div class="corner tl"></div><div class="corner tr"></div>
    <div class="corner bl"></div><div class="corner br"></div>
    <div class="seal">★</div>
    <div class="org">{{organization_name}}</div>
    <div class="cert-title">Certificate</div>
    <div class="cert-subtitle">of Completion</div>
    <hr class="divider">
    <div class="presented-to">This certifies that</div>
    <div class="recipient">{{recipient_name}}</div>
    <div class="for-text">has successfully completed</div>
    <div class="course">{{course_name}}</div>
    <div class="date">Completed on {{completion_date}}</div>
    <div class="sigs">
      <div class="sig"><div class="name">{{issuer_name}}</div><div class="title">{{issuer_title}}</div></div>
      <div class="sig"><div class="name">{{organization_name}}</div><div class="title">Issuing Organization</div></div>
    </div>
  </div>
</div>
</body></html>`,
  },

  // ─── 5. Project Proposal ─────────────────────────────────────────────────────
  {
    name: "Project Proposal",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #1a1a1a; font-size: 14px; line-height: 1.7; }
.cover { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #fff; padding: 80px 64px 64px; min-height: 280px; display: flex; flex-direction: column; justify-content: flex-end; position: relative; overflow: hidden; }
.cover::before { content: ''; position: absolute; top: -80px; right: -80px; width: 320px; height: 320px; background: radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%); }
.cover .eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 4px; color: #6366f1; margin-bottom: 20px; font-weight: 600; position: relative; }
.cover h1 { font-size: 44px; font-weight: 900; letter-spacing: -2px; line-height: 1.05; margin-bottom: 20px; position: relative; }
.cover .meta { font-size: 13px; color: #94a3b8; position: relative; }
.cover .meta span { color: #e2e8f0; font-weight: 600; }
.content { padding: 56px 64px; }
.section { margin-bottom: 40px; }
.section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; color: #6366f1; padding-bottom: 10px; border-bottom: 2px solid #e0e7ff; margin-bottom: 16px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.detail label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: 600; }
.detail p { color: #0f172a; font-weight: 600; }
.highlight { background: #f0f9ff; border-left: 4px solid #6366f1; padding: 16px 20px; border-radius: 0 8px 8px 0; color: #374151; }
.foot { background: #f8fafc; padding: 20px 64px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #94a3b8; }
.foot .brand { font-weight: 700; color: #374151; }
</style></head>
<body>
<div class="cover">
  <div class="eyebrow">Project Proposal</div>
  <h1>{{project_name}}</h1>
  <div class="meta">Prepared for <span>{{client_name}}</span> &nbsp;·&nbsp; {{date}}</div>
</div>
<div class="content">
  <div class="section">
    <div class="section-title">Project Details</div>
    <div class="grid2">
      <div class="detail"><label>Client</label><p>{{client_name}}</p></div>
      <div class="detail"><label>Prepared By</label><p>{{prepared_by}}</p></div>
      <div class="detail"><label>Timeline</label><p>{{timeline}}</p></div>
      <div class="detail"><label>Investment</label><p>{{investment}}</p></div>
    </div>
  </div>
  <div class="section"><div class="section-title">Overview</div><p style="color:#374151">{{overview}}</p></div>
  <div class="section"><div class="section-title">Scope of Work</div><div class="highlight">{{scope}}</div></div>
  <div class="section"><div class="section-title">Deliverables</div><p style="color:#374151">{{deliverables}}</p></div>
</div>
<div class="foot"><div class="brand">{{prepared_by}}</div><div>{{date}}</div></div>
</body></html>`,
  },

  // ─── 6. Job Offer Letter ─────────────────────────────────────────────────────
  {
    name: "Job Offer Letter",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #1a1a1a; font-size: 14px; line-height: 1.7; }
.header { background: #0f172a; padding: 36px 56px; display: flex; justify-content: space-between; align-items: center; }
.header .co { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: -0.3px; }
.header .badge { background: #22c55e; color: #fff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 5px 14px; border-radius: 999px; }
.wrap { padding: 52px 56px; }
.date { color: #64748b; margin-bottom: 32px; font-size: 13px; }
.candidate { font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 4px; }
.candidate-addr { color: #64748b; font-size: 13px; margin-bottom: 32px; }
.salutation { margin-bottom: 20px; font-size: 15px; }
.body { color: #374151; margin-bottom: 32px; }
.offer-box { background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1px solid #86efac; border-radius: 12px; padding: 28px 32px; margin-bottom: 32px; }
.offer-box h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #15803d; margin-bottom: 16px; }
.offer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.offer-item label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #4ade80; display: block; margin-bottom: 3px; font-weight: 600; }
.offer-item p { color: #0f172a; font-weight: 700; font-size: 15px; }
.body2 { color: #374151; margin-bottom: 44px; }
.closing-word { margin-bottom: 52px; }
.sig-name { font-size: 16px; font-weight: 800; color: #0f172a; }
.sig-title { color: #64748b; font-size: 13px; margin-top: 4px; }
</style></head>
<body>
<div class="header">
  <div class="co">{{company_name}}</div>
  <div class="badge">Offer of Employment</div>
</div>
<div class="wrap">
  <div class="date">{{date}}</div>
  <div class="candidate">{{candidate_name}}</div>
  <div class="candidate-addr">{{candidate_address}}</div>
  <div class="salutation">Dear {{candidate_name}},</div>
  <div class="body">
    <p>We are delighted to offer you the position of <strong>{{position_title}}</strong> at {{company_name}}, reporting to {{reporting_to}}. Your start date will be {{start_date}}.</p>
  </div>
  <div class="offer-box">
    <h3>Offer Details</h3>
    <div class="offer-grid">
      <div class="offer-item"><label>Position</label><p>{{position_title}}</p></div>
      <div class="offer-item"><label>Start Date</label><p>{{start_date}}</p></div>
      <div class="offer-item"><label>Salary</label><p>{{salary}}</p></div>
      <div class="offer-item"><label>Employment Type</label><p>{{employment_type}}</p></div>
    </div>
  </div>
  <div class="body2">
    <p>{{offer_details}}</p>
    <br>
    <p>Please confirm your acceptance by signing and returning this letter by <strong>{{deadline}}</strong>. We look forward to welcoming you to the team.</p>
  </div>
  <div>
    <div class="closing-word">Sincerely,</div>
    <div class="sig-name">{{hiring_manager_name}}</div>
    <div class="sig-title">{{hiring_manager_title}}</div>
    <div class="sig-title" style="margin-top:2px">{{company_name}}</div>
  </div>
</div>
</body></html>`,
  },

  // ─── 7. Statement of Work ────────────────────────────────────────────────────
  {
    name: "Statement of Work",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #1a1a1a; font-size: 13px; line-height: 1.7; }
.top { padding: 48px 56px 36px; border-bottom: 3px solid #6366f1; }
.doc-label { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #6366f1; font-weight: 700; margin-bottom: 12px; }
.doc-title { font-size: 32px; font-weight: 900; color: #0f172a; letter-spacing: -1px; margin-bottom: 24px; }
.meta-row { display: flex; gap: 48px; }
.meta-item label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; display: block; margin-bottom: 3px; font-weight: 600; }
.meta-item p { color: #0f172a; font-weight: 600; }
.body { padding: 40px 56px; }
.section { margin-bottom: 36px; }
.sec-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #6366f1; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e0e7ff; }
.sec-body { color: #374151; }
.terms { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 8px; }
.term { background: #f8fafc; border-radius: 8px; padding: 14px 16px; }
.term label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: 600; }
.term p { color: #0f172a; font-weight: 700; }
.sign-block { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 48px; padding-top: 32px; border-top: 2px solid #e2e8f0; }
.sign-party h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 16px; font-weight: 600; }
.sign-line { border-bottom: 1px solid #cbd5e1; margin-bottom: 6px; padding-bottom: 24px; }
.sign-name { font-weight: 700; color: #0f172a; }
.sign-title { font-size: 12px; color: #64748b; }
</style></head>
<body>
<div class="top">
  <div class="doc-label">Statement of Work</div>
  <div class="doc-title">{{project_name}}</div>
  <div class="meta-row">
    <div class="meta-item"><label>Client</label><p>{{client_name}}</p></div>
    <div class="meta-item"><label>Provider</label><p>{{provider_name}}</p></div>
    <div class="meta-item"><label>Effective Date</label><p>{{effective_date}}</p></div>
    <div class="meta-item"><label>SOW #</label><p>{{sow_number}}</p></div>
  </div>
</div>
<div class="body">
  <div class="section"><div class="sec-title">Project Overview</div><div class="sec-body">{{overview}}</div></div>
  <div class="section"><div class="sec-title">Scope of Work</div><div class="sec-body">{{scope}}</div></div>
  <div class="section"><div class="sec-title">Deliverables</div><div class="sec-body">{{deliverables}}</div></div>
  <div class="section">
    <div class="sec-title">Terms</div>
    <div class="terms">
      <div class="term"><label>Start Date</label><p>{{start_date}}</p></div>
      <div class="term"><label>End Date</label><p>{{end_date}}</p></div>
      <div class="term"><label>Total Fee</label><p>{{total_fee}}</p></div>
      <div class="term"><label>Payment Terms</label><p>{{payment_terms}}</p></div>
    </div>
  </div>
  <div class="sign-block">
    <div class="sign-party">
      <h4>Client Signature</h4>
      <div class="sign-line"></div>
      <div class="sign-name">{{client_name}}</div>
    </div>
    <div class="sign-party">
      <h4>Provider Signature</h4>
      <div class="sign-line"></div>
      <div class="sign-name">{{provider_name}}</div>
    </div>
  </div>
</div>
</body></html>`,
  },

  // ─── 8. Monthly Report ───────────────────────────────────────────────────────
  {
    name: "Monthly Report",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; background: #fff; color: #1a1a1a; font-size: 13px; line-height: 1.6; }
.header { background: #0f172a; padding: 40px 56px; color: #fff; }
.header .label { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #64748b; margin-bottom: 8px; font-weight: 600; }
.header h1 { font-size: 34px; font-weight: 900; letter-spacing: -1px; margin-bottom: 6px; }
.header .period { color: #94a3b8; font-size: 14px; }
.header .period span { color: #e2e8f0; font-weight: 600; }
.kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border-bottom: 1px solid #e2e8f0; }
.kpi { padding: 28px 24px; border-right: 1px solid #e2e8f0; }
.kpi:last-child { border-right: none; }
.kpi .k-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 8px; font-weight: 600; }
.kpi .k-value { font-size: 32px; font-weight: 900; color: #0f172a; letter-spacing: -1px; line-height: 1; }
.kpi .k-delta { font-size: 12px; margin-top: 4px; color: #22c55e; font-weight: 600; }
.kpi .k-delta.neg { color: #ef4444; }
.sections { padding: 40px 56px; }
.section { margin-bottom: 36px; }
.sec-title { font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 2px solid #f1f5f9; }
.sec-body { color: #374151; }
.highlight-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }
.hl-box { background: #f8fafc; border-radius: 10px; padding: 18px 20px; border: 1px solid #e2e8f0; }
.hl-box .hl-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 6px; font-weight: 600; }
.hl-box .hl-value { font-size: 22px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
.foot { margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8; }
</style></head>
<body>
<div class="header">
  <div class="label">Monthly Report</div>
  <h1>{{report_title}}</h1>
  <div class="period">Period: <span>{{report_period}}</span> &nbsp;·&nbsp; Prepared by <span>{{prepared_by}}</span></div>
</div>
<div class="kpis">
  <div class="kpi"><div class="k-label">{{kpi1_label}}</div><div class="k-value">{{kpi1_value}}</div><div class="k-delta">{{kpi1_change}}</div></div>
  <div class="kpi"><div class="k-label">{{kpi2_label}}</div><div class="k-value">{{kpi2_value}}</div><div class="k-delta">{{kpi2_change}}</div></div>
  <div class="kpi"><div class="k-label">{{kpi3_label}}</div><div class="k-value">{{kpi3_value}}</div><div class="k-delta">{{kpi3_change}}</div></div>
  <div class="kpi"><div class="k-label">{{kpi4_label}}</div><div class="k-value">{{kpi4_value}}</div><div class="k-delta">{{kpi4_change}}</div></div>
</div>
<div class="sections">
  <div class="section">
    <div class="sec-title">Executive Summary</div>
    <div class="sec-body">{{summary}}</div>
  </div>
  <div class="section">
    <div class="sec-title">Key Highlights</div>
    <div class="highlight-row">
      <div class="hl-box"><div class="hl-label">{{hl1_label}}</div><div class="hl-value">{{hl1_value}}</div></div>
      <div class="hl-box"><div class="hl-label">{{hl2_label}}</div><div class="hl-value">{{hl2_value}}</div></div>
      <div class="hl-box"><div class="hl-label">{{hl3_label}}</div><div class="hl-value">{{hl3_value}}</div></div>
    </div>
  </div>
  <div class="section">
    <div class="sec-title">Challenges & Next Steps</div>
    <div class="sec-body">{{challenges}}</div>
  </div>
  <div class="foot">
    <span>{{report_title}} — {{report_period}}</span>
    <span>Prepared by {{prepared_by}}</span>
  </div>
</div>
</body></html>`,
  },
];

/**
 * Seeds starter templates for a newly created user.
 * Skips if the user already has templates (idempotent for normal use).
 */
export async function seedStarterTemplates(
  userId: string,
  prisma: PrismaClient,
  { force = false } = {}
): Promise<void> {
  if (!force) {
    const existing = await prisma.template.count({ where: { userId } });
    if (existing > 0) return;
  }

  // Upsert by name so re-seeding refreshes HTML without duplicating
  for (const t of STARTER_TEMPLATES) {
    const existing = await prisma.template.findFirst({
      where: { userId, name: t.name },
      select: { id: true },
    });
    if (existing) {
      await prisma.template.update({ where: { id: existing.id }, data: { html: t.html } });
    } else {
      await prisma.template.create({ data: { userId, name: t.name, html: t.html } });
    }
  }
}
