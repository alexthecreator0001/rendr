import type { PrismaClient } from "@prisma/client";

export type StarterTemplate = { name: string; html: string };

export const STARTER_TEMPLATES: StarterTemplate[] = [

  // ─── 1. Invoice ──────────────────────────────────────────────────────────────
  {
    name: "Invoice",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#111827;font-size:13px;line-height:1.5}
.page{padding:52px 56px}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:44px;padding-bottom:32px;border-bottom:1.5px solid #111827}
.brand{}
.brand-name{font-size:22px;font-weight:800;letter-spacing:-0.5px;color:#111827}
.brand-meta{margin-top:6px;font-size:12px;color:#6b7280;line-height:1.7}
.invoice-label{text-align:right}
.invoice-label .word{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#6b7280}
.invoice-label .num{font-size:28px;font-weight:800;letter-spacing:-1px;color:#111827;line-height:1.1;margin-top:4px}
.invoice-label .status{display:inline-block;margin-top:6px;background:#111827;color:#fff;font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;padding:3px 10px;border-radius:4px}
.meta{display:grid;grid-template-columns:2fr 1fr 1fr;gap:32px;margin-bottom:36px}
.meta-block label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;display:block;margin-bottom:5px}
.meta-block p{color:#111827;font-size:13px;font-weight:500;line-height:1.6}
table{width:100%;border-collapse:collapse;margin-bottom:32px}
thead tr{border-bottom:1.5px solid #111827}
thead th{padding:10px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#6b7280;white-space:nowrap}
thead th:last-child{text-align:right}
tbody tr{border-bottom:1px solid #f3f4f6}
tbody tr:last-child{border-bottom:none}
tbody td{padding:14px 12px;color:#374151;font-size:13px;vertical-align:top}
tbody td:last-child{text-align:right;font-weight:600;color:#111827}
.totals{display:flex;justify-content:flex-end;margin-bottom:44px}
.totals-inner{width:260px}
.t-line{display:flex;justify-content:space-between;padding:7px 0;font-size:13px;color:#6b7280}
.t-line.sep{border-top:1.5px solid #111827;margin-top:8px;padding-top:14px;font-size:16px;font-weight:800;color:#111827}
.t-line.sep .amt{color:#111827}
.footer{display:flex;justify-content:space-between;align-items:flex-end;padding-top:28px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af}
.footer .note{max-width:340px;line-height:1.7}
.footer .ty{font-size:14px;font-weight:700;color:#111827}
</style></head>
<body>
<div class="page">
  <div class="header">
    <div class="brand">
      <div class="brand-name">{{company_name}}</div>
      <div class="brand-meta">{{company_address}}<br>{{company_email}}</div>
    </div>
    <div class="invoice-label">
      <div class="word">Invoice</div>
      <div class="num">{{invoice_number}}</div>
      <div class="status">Due {{due_date}}</div>
    </div>
  </div>
  <div class="meta">
    <div class="meta-block"><label>Bill To</label><p>{{client_name}}<br>{{client_address}}</p></div>
    <div class="meta-block"><label>Issue Date</label><p>{{invoice_date}}</p></div>
    <div class="meta-block"><label>Due Date</label><p>{{due_date}}</p></div>
  </div>
  <table>
    <thead><tr><th style="width:48%">Description</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit Price</th><th>Amount</th></tr></thead>
    <tbody>
      <tr><td>{{item_description}}</td><td style="text-align:center">{{item_qty}}</td><td style="text-align:right">{{item_rate}}</td><td>{{item_amount}}</td></tr>
    </tbody>
  </table>
  <div class="totals">
    <div class="totals-inner">
      <div class="t-line"><span>Subtotal</span><span>{{subtotal}}</span></div>
      <div class="t-line"><span>Tax ({{tax_rate}}%)</span><span>{{tax_amount}}</span></div>
      <div class="t-line sep"><span>Total Due</span><span class="amt">{{total}}</span></div>
    </div>
  </div>
  <div class="footer">
    <div class="note">{{payment_instructions}}</div>
    <div class="ty">Thank you.</div>
  </div>
</div>
</body></html>`,
  },

  // ─── 2. Receipt ──────────────────────────────────────────────────────────────
  {
    name: "Receipt",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#f9fafb;padding:48px 24px;min-height:100vh;display:flex;align-items:flex-start;justify-content:center}
.card{background:#fff;width:360px;border-radius:2px;overflow:hidden;box-shadow:0 0 0 1px rgba(0,0,0,0.06),0 4px 24px rgba(0,0,0,0.08)}
.top{background:#111827;color:#fff;padding:28px 28px 24px;position:relative;overflow:hidden}
.top::before{content:'';position:absolute;top:-40px;right:-40px;width:120px;height:120px;background:rgba(255,255,255,0.04);border-radius:50%}
.biz{font-size:16px;font-weight:700;letter-spacing:-0.3px}
.biz-addr{font-size:11px;color:rgba(255,255,255,0.45);margin-top:3px}
.amount-area{padding:28px 28px 24px;text-align:center;border-bottom:1px dashed #e5e7eb}
.amt-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin-bottom:8px}
.amt{font-size:48px;font-weight:900;letter-spacing:-3px;color:#111827;line-height:1}
.rows{padding:4px 0}
.row{display:flex;justify-content:space-between;align-items:center;padding:11px 28px;font-size:12.5px}
.row+.row{border-top:1px solid #f9fafb}
.row .k{color:#9ca3af;font-weight:500}
.row .v{color:#111827;font-weight:600;text-align:right;max-width:180px}
.foot{padding:20px 28px;border-top:1px dashed #e5e7eb;text-align:center;font-size:11.5px;color:#9ca3af;line-height:1.8}
.foot strong{color:#374151;display:block;font-size:13px;margin-bottom:4px}
</style></head>
<body>
<div class="card">
  <div class="top">
    <div class="biz">{{business_name}}</div>
    <div class="biz-addr">{{business_address}}</div>
  </div>
  <div class="amount-area">
    <div class="amt-label">Amount Paid</div>
    <div class="amt">{{amount}}</div>
  </div>
  <div class="rows">
    <div class="row"><span class="k">Receipt #</span><span class="v">{{receipt_number}}</span></div>
    <div class="row"><span class="k">Date</span><span class="v">{{date}}</span></div>
    <div class="row"><span class="k">Customer</span><span class="v">{{customer_name}}</span></div>
    <div class="row"><span class="k">Item</span><span class="v">{{item_description}}</span></div>
    <div class="row"><span class="k">Payment</span><span class="v">{{payment_method}}</span></div>
    <div class="row"><span class="k">Served by</span><span class="v">{{cashier}}</span></div>
  </div>
  <div class="foot">
    <strong>Thank you for your purchase.</strong>
    Keep this receipt for your records.
  </div>
</div>
</body></html>`,
  },

  // ─── 3. Business Letter ───────────────────────────────────────────────────────
  {
    name: "Business Letter",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#111827;font-size:13.5px;line-height:1.8}
.page{padding:56px 80px;max-width:720px}
.letterhead{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px;padding-bottom:24px;border-bottom:1.5px solid #111827}
.sender-name{font-size:18px;font-weight:700;letter-spacing:-0.3px;color:#111827}
.sender-meta{font-size:12px;color:#6b7280;margin-top:4px;line-height:1.7}
.letterhead-right{text-align:right;font-size:12px;color:#9ca3af}
.date-line{color:#6b7280;margin-bottom:36px;font-size:13px}
.recipient{margin-bottom:36px}
.recipient .name{font-weight:600;color:#111827}
.recipient .meta{color:#6b7280;font-size:12.5px;line-height:1.7;margin-top:3px}
.re-line{font-size:13px;font-weight:600;color:#111827;margin-bottom:28px;padding:12px 16px;background:#f9fafb;border-left:3px solid #111827;border-radius:0 4px 4px 0}
.re-line span{color:#6b7280;font-weight:400}
.salutation{margin-bottom:20px;font-weight:500}
.body-text{color:#374151;margin-bottom:44px;white-space:pre-line}
.closing{color:#374151;margin-bottom:56px}
.sig-name{font-size:15px;font-weight:700;color:#111827}
.sig-title{color:#6b7280;font-size:12.5px;margin-top:3px}
</style></head>
<body>
<div class="page">
  <div class="letterhead">
    <div>
      <div class="sender-name">{{sender_name}}</div>
      <div class="sender-meta">{{sender_title}}<br>{{sender_address}}<br>{{sender_email}}</div>
    </div>
    <div class="letterhead-right">Official Correspondence</div>
  </div>
  <div class="date-line">{{date}}</div>
  <div class="recipient">
    <div class="name">{{recipient_name}}</div>
    <div class="meta">{{recipient_title}}<br>{{recipient_address}}</div>
  </div>
  <div class="re-line"><span>Re: </span>{{subject}}</div>
  <div class="salutation">Dear {{recipient_name}},</div>
  <div class="body-text">{{body}}</div>
  <div class="closing">{{closing}},</div>
  <div class="sig-name">{{sender_name}}</div>
  <div class="sig-title">{{sender_title}}</div>
</div>
</body></html>`,
  },

  // ─── 4. Certificate of Completion ────────────────────────────────────────────
  {
    name: "Certificate of Completion",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#faf9f6;padding:40px;display:flex;justify-content:center;min-height:100vh;align-items:center}
.cert{width:720px;background:#faf9f6;position:relative;padding:56px 72px;border:1px solid #c9a84c}
.cert::before{content:'';position:absolute;inset:8px;border:1px solid rgba(201,168,76,0.4);pointer-events:none}
.corner{position:absolute;width:32px;height:32px;border-color:#c9a84c;border-style:solid}
.tl{top:4px;left:4px;border-width:2px 0 0 2px}
.tr{top:4px;right:4px;border-width:2px 2px 0 0}
.bl{bottom:4px;left:4px;border-width:0 0 2px 2px}
.br{bottom:4px;right:4px;border-width:0 2px 2px 0}
.badge{display:flex;align-items:center;justify-content:center;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#b8860b,#daa520,#b8860b);margin:0 auto 20px;font-size:22px}
.org{font-size:10px;text-transform:uppercase;letter-spacing:5px;color:#9a7b2f;text-align:center;margin-bottom:16px;font-weight:600}
.title{font-family:'Playfair Display',Georgia,serif;font-size:50px;font-weight:400;color:#1a1a1a;text-align:center;line-height:1;margin-bottom:6px}
.subtitle{font-size:11px;text-transform:uppercase;letter-spacing:5px;color:#9a7b2f;text-align:center;margin-bottom:28px;font-weight:600}
.rule{width:80px;border:none;border-top:1px solid #c9a84c;margin:0 auto 28px}
.presented{font-size:11px;text-transform:uppercase;letter-spacing:2.5px;color:#9a7b2f;text-align:center;margin-bottom:10px;font-weight:600}
.recipient{font-family:'Playfair Display',Georgia,serif;font-size:42px;font-style:italic;color:#1a1a1a;text-align:center;line-height:1.1;margin-bottom:24px}
.completed-line{font-size:12.5px;color:#6b7280;text-align:center;margin-bottom:6px}
.course{font-family:'Playfair Display',Georgia,serif;font-size:20px;font-weight:600;color:#1a1a1a;text-align:center;margin-bottom:6px}
.date{font-size:12px;color:#9a7b2f;text-align:center;margin-bottom:40px;font-weight:500}
.sigs{display:flex;justify-content:space-around;padding-top:24px;border-top:1px solid rgba(201,168,76,0.35)}
.sig{text-align:center}
.sig-line{width:120px;border-bottom:1px solid #c9a84c;margin:0 auto 10px;padding-bottom:8px}
.sig-name{font-size:14px;font-weight:600;color:#1a1a1a}
.sig-role{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#9a7b2f;margin-top:3px}
</style></head>
<body>
<div class="cert">
  <div class="corner tl"></div><div class="corner tr"></div>
  <div class="corner bl"></div><div class="corner br"></div>
  <div class="badge">★</div>
  <div class="org">{{organization_name}}</div>
  <div class="title">Certificate</div>
  <div class="subtitle">of Completion</div>
  <hr class="rule">
  <div class="presented">This certifies that</div>
  <div class="recipient">{{recipient_name}}</div>
  <div class="completed-line">has successfully completed</div>
  <div class="course">{{course_name}}</div>
  <div class="date">Awarded {{completion_date}}</div>
  <div class="sigs">
    <div class="sig">
      <div class="sig-line"></div>
      <div class="sig-name">{{issuer_name}}</div>
      <div class="sig-role">{{issuer_title}}</div>
    </div>
    <div class="sig">
      <div class="sig-line"></div>
      <div class="sig-name">{{organization_name}}</div>
      <div class="sig-role">Issuing Organization</div>
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#111827;font-size:13.5px;line-height:1.7}
.cover{background:#0f172a;color:#fff;padding:72px 64px 60px;min-height:320px;position:relative;overflow:hidden}
.cover::after{content:'';position:absolute;bottom:-80px;right:-80px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,0.25) 0%,transparent 70%)}
.cover-eyebrow{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#818cf8;margin-bottom:20px;position:relative;z-index:1}
.cover-title{font-size:42px;font-weight:900;letter-spacing:-2px;line-height:1.05;margin-bottom:20px;position:relative;z-index:1}
.cover-meta{font-size:13px;color:#94a3b8;position:relative;z-index:1}
.cover-meta span{color:#e2e8f0;font-weight:600}
.content{padding:52px 64px}
.section{margin-bottom:40px}
.sec-tag{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#6366f1;margin-bottom:14px;padding-bottom:10px;border-bottom:1.5px solid #e0e7ff}
.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.detail{background:#f8fafc;border-radius:8px;padding:14px 16px}
.detail label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;display:block;margin-bottom:4px}
.detail p{color:#111827;font-weight:700;font-size:14px}
.text-body{color:#374151;white-space:pre-line}
.callout{background:#eef2ff;border-left:3px solid #6366f1;padding:16px 20px;border-radius:0 8px 8px 0;color:#374151;white-space:pre-line}
.page-foot{margin-top:48px;padding-top:20px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:11.5px;color:#9ca3af}
.page-foot strong{color:#374151}
</style></head>
<body>
<div class="cover">
  <div class="cover-eyebrow">Project Proposal</div>
  <div class="cover-title">{{project_name}}</div>
  <div class="cover-meta">Prepared for <span>{{client_name}}</span> &nbsp;·&nbsp; {{date}} &nbsp;·&nbsp; By <span>{{prepared_by}}</span></div>
</div>
<div class="content">
  <div class="section">
    <div class="sec-tag">Project Details</div>
    <div class="detail-grid">
      <div class="detail"><label>Client</label><p>{{client_name}}</p></div>
      <div class="detail"><label>Prepared By</label><p>{{prepared_by}}</p></div>
      <div class="detail"><label>Timeline</label><p>{{timeline}}</p></div>
      <div class="detail"><label>Investment</label><p>{{investment}}</p></div>
    </div>
  </div>
  <div class="section"><div class="sec-tag">Overview</div><div class="text-body">{{overview}}</div></div>
  <div class="section"><div class="sec-tag">Scope of Work</div><div class="callout">{{scope}}</div></div>
  <div class="section"><div class="sec-tag">Deliverables</div><div class="text-body">{{deliverables}}</div></div>
  <div class="page-foot">
    <div><strong>{{prepared_by}}</strong></div>
    <div>{{date}}</div>
  </div>
</div>
</body></html>`,
  },

  // ─── 6. Job Offer Letter ─────────────────────────────────────────────────────
  {
    name: "Job Offer Letter",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#111827;font-size:13.5px;line-height:1.75}
.header{background:#111827;padding:32px 56px;display:flex;align-items:center;justify-content:space-between}
.header-co{font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.3px}
.header-badge{background:#22c55e;color:#fff;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:5px 14px;border-radius:4px}
.body{padding:48px 56px}
.date{color:#6b7280;font-size:13px;margin-bottom:28px}
.candidate-name{font-size:15px;font-weight:600;color:#111827}
.candidate-addr{color:#6b7280;font-size:12.5px;margin-top:3px;margin-bottom:32px}
.salutation{margin-bottom:20px;font-weight:500}
.intro{color:#374151;margin-bottom:28px}
.offer-box{border:1px solid #bbf7d0;background:#f0fdf4;border-radius:8px;padding:28px 32px;margin-bottom:28px}
.offer-box-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#15803d;margin-bottom:18px}
.offer-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.offer-item label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#22c55e;display:block;margin-bottom:3px}
.offer-item p{color:#111827;font-weight:700;font-size:15px}
.body2{color:#374151;margin-bottom:48px;white-space:pre-line}
.close-word{color:#374151;margin-bottom:56px}
.sig-name{font-size:16px;font-weight:800;color:#111827}
.sig-title{color:#6b7280;font-size:13px;margin-top:4px}
.sig-co{color:#9ca3af;font-size:12px;margin-top:2px}
</style></head>
<body>
<div class="header">
  <div class="header-co">{{company_name}}</div>
  <div class="header-badge">Offer of Employment</div>
</div>
<div class="body">
  <div class="date">{{date}}</div>
  <div class="candidate-name">{{candidate_name}}</div>
  <div class="candidate-addr">{{candidate_address}}</div>
  <div class="salutation">Dear {{candidate_name}},</div>
  <div class="intro">
    We are pleased to offer you the position of <strong>{{position_title}}</strong> at {{company_name}},
    reporting to {{reporting_to}}. Your anticipated start date is <strong>{{start_date}}</strong>.
  </div>
  <div class="offer-box">
    <div class="offer-box-title">Offer Summary</div>
    <div class="offer-grid">
      <div class="offer-item"><label>Role</label><p>{{position_title}}</p></div>
      <div class="offer-item"><label>Start Date</label><p>{{start_date}}</p></div>
      <div class="offer-item"><label>Compensation</label><p>{{salary}}</p></div>
      <div class="offer-item"><label>Employment Type</label><p>{{employment_type}}</p></div>
    </div>
  </div>
  <div class="body2">{{offer_details}}

Please confirm your acceptance by signing and returning this letter no later than <strong>{{deadline}}</strong>. We look forward to welcoming you to the team.</div>
  <div class="close-word">Warm regards,</div>
  <div class="sig-name">{{hiring_manager_name}}</div>
  <div class="sig-title">{{hiring_manager_title}}</div>
  <div class="sig-co">{{company_name}}</div>
</div>
</body></html>`,
  },

  // ─── 7. Statement of Work ────────────────────────────────────────────────────
  {
    name: "Statement of Work",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#111827;font-size:13px;line-height:1.7}
.top{padding:48px 56px 36px;border-bottom:2px solid #111827}
.doc-kicker{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#6366f1;margin-bottom:12px}
.doc-title{font-size:34px;font-weight:900;letter-spacing:-1.5px;color:#111827;margin-bottom:8px}
.doc-sow{font-size:13px;color:#6b7280;margin-bottom:24px}
.parties{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.party label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;display:block;margin-bottom:4px}
.party p{font-weight:600;color:#111827;font-size:13px}
.content{padding:40px 56px}
.section{margin-bottom:36px}
.sec-head{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#6366f1;padding-bottom:10px;border-bottom:1.5px solid #e0e7ff;margin-bottom:14px}
.sec-body{color:#374151;white-space:pre-line}
.terms-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.term{background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;padding:14px 16px}
.term label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;display:block;margin-bottom:4px}
.term p{font-weight:700;color:#111827;font-size:14px}
.sign-section{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:48px;padding-top:32px;border-top:1.5px solid #e5e7eb}
.sign-party h4{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;margin-bottom:18px}
.sign-line{border-bottom:1px solid #9ca3af;margin-bottom:8px;padding-bottom:28px}
.sign-name{font-weight:700;color:#111827}
.sign-title{font-size:12px;color:#6b7280;margin-top:2px}
</style></head>
<body>
<div class="top">
  <div class="doc-kicker">Statement of Work</div>
  <div class="doc-title">{{project_name}}</div>
  <div class="doc-sow">SOW No. {{sow_number}} &nbsp;·&nbsp; Effective {{effective_date}}</div>
  <div class="parties">
    <div class="party"><label>Client</label><p>{{client_name}}</p></div>
    <div class="party"><label>Provider</label><p>{{provider_name}}</p></div>
    <div class="party"><label>Start Date</label><p>{{start_date}}</p></div>
    <div class="party"><label>End Date</label><p>{{end_date}}</p></div>
  </div>
</div>
<div class="content">
  <div class="section"><div class="sec-head">1. Project Overview</div><div class="sec-body">{{overview}}</div></div>
  <div class="section"><div class="sec-head">2. Scope of Work</div><div class="sec-body">{{scope}}</div></div>
  <div class="section"><div class="sec-head">3. Deliverables</div><div class="sec-body">{{deliverables}}</div></div>
  <div class="section">
    <div class="sec-head">4. Commercial Terms</div>
    <div class="terms-grid">
      <div class="term"><label>Total Fee</label><p>{{total_fee}}</p></div>
      <div class="term"><label>Payment Terms</label><p>{{payment_terms}}</p></div>
    </div>
  </div>
  <div class="sign-section">
    <div class="sign-party">
      <h4>Client Signature</h4>
      <div class="sign-line"></div>
      <div class="sign-name">{{client_name}}</div>
      <div class="sign-title">Authorized Representative</div>
    </div>
    <div class="sign-party">
      <h4>Provider Signature</h4>
      <div class="sign-line"></div>
      <div class="sign-name">{{provider_name}}</div>
      <div class="sign-title">Authorized Representative</div>
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
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#111827;font-size:13px;line-height:1.6}
.header{background:#0f172a;color:#fff;padding:40px 52px}
.header-kicker{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:4px;color:#475569;margin-bottom:10px}
.header-title{font-size:34px;font-weight:900;letter-spacing:-1.5px;line-height:1;margin-bottom:8px}
.header-meta{font-size:13px;color:#64748b}
.header-meta strong{color:#94a3b8}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid #e5e7eb}
.kpi{padding:24px 20px;border-right:1px solid #e5e7eb}
.kpi:last-child{border-right:none}
.kpi-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;margin-bottom:8px}
.kpi-value{font-size:28px;font-weight:900;letter-spacing:-1px;color:#111827;line-height:1}
.kpi-delta{font-size:12px;font-weight:600;margin-top:5px;color:#22c55e}
.kpi-delta.neg{color:#ef4444}
.sections{padding:40px 52px}
.section{margin-bottom:36px}
.sec-title{font-size:14px;font-weight:800;color:#111827;margin-bottom:12px;padding-bottom:10px;border-bottom:2px solid #f1f5f9;letter-spacing:-0.2px}
.sec-body{color:#374151;white-space:pre-line}
.hl-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:14px}
.hl-card{background:#f8fafc;border:1px solid #e5e7eb;border-radius:8px;padding:18px}
.hl-card-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;margin-bottom:6px}
.hl-card-value{font-size:22px;font-weight:900;letter-spacing:-0.5px;color:#111827}
.foot{margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:11.5px;color:#9ca3af}
.foot strong{color:#374151}
</style></head>
<body>
<div class="header">
  <div class="header-kicker">Monthly Report</div>
  <div class="header-title">{{report_title}}</div>
  <div class="header-meta">Period: <strong>{{report_period}}</strong> &nbsp;·&nbsp; Prepared by <strong>{{prepared_by}}</strong></div>
</div>
<div class="kpis">
  <div class="kpi"><div class="kpi-label">{{kpi1_label}}</div><div class="kpi-value">{{kpi1_value}}</div><div class="kpi-delta">{{kpi1_change}}</div></div>
  <div class="kpi"><div class="kpi-label">{{kpi2_label}}</div><div class="kpi-value">{{kpi2_value}}</div><div class="kpi-delta">{{kpi2_change}}</div></div>
  <div class="kpi"><div class="kpi-label">{{kpi3_label}}</div><div class="kpi-value">{{kpi3_value}}</div><div class="kpi-delta">{{kpi3_change}}</div></div>
  <div class="kpi"><div class="kpi-label">{{kpi4_label}}</div><div class="kpi-value">{{kpi4_value}}</div><div class="kpi-delta">{{kpi4_change}}</div></div>
</div>
<div class="sections">
  <div class="section"><div class="sec-title">Executive Summary</div><div class="sec-body">{{summary}}</div></div>
  <div class="section">
    <div class="sec-title">Key Highlights</div>
    <div class="hl-grid">
      <div class="hl-card"><div class="hl-card-label">{{hl1_label}}</div><div class="hl-card-value">{{hl1_value}}</div></div>
      <div class="hl-card"><div class="hl-card-label">{{hl2_label}}</div><div class="hl-card-value">{{hl2_value}}</div></div>
      <div class="hl-card"><div class="hl-card-label">{{hl3_label}}</div><div class="hl-card-value">{{hl3_value}}</div></div>
    </div>
  </div>
  <div class="section"><div class="sec-title">Challenges &amp; Next Steps</div><div class="sec-body">{{challenges}}</div></div>
  <div class="foot">
    <div><strong>{{report_title}}</strong> — {{report_period}}</div>
    <div>Prepared by {{prepared_by}}</div>
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
