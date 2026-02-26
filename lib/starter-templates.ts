import type { PrismaClient } from "@prisma/client";

export type StarterTemplate = { name: string; html: string; coverImageUrl?: string | null };

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

  // ─── 9. Shipping Label ──────────────────────────────────────────────────────
  {
    name: "Shipping Label",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;padding:24px;display:flex;justify-content:center}
.label{width:400px;border:2px solid #111827;border-radius:4px;overflow:hidden}
.bar{background:#111827;color:#fff;padding:10px 16px;display:flex;justify-content:space-between;align-items:center}
.bar-carrier{font-size:14px;font-weight:800;letter-spacing:-0.3px}
.bar-type{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;background:#fff;color:#111827;padding:3px 10px;border-radius:3px}
.tracking{padding:16px;text-align:center;border-bottom:2px dashed #d1d5db}
.tracking-label{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin-bottom:4px}
.tracking-num{font-size:20px;font-weight:900;letter-spacing:1px;color:#111827}
.addresses{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #e5e7eb}
.addr{padding:16px}
.addr+.addr{border-left:1px solid #e5e7eb}
.addr-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin-bottom:6px}
.addr-name{font-size:13px;font-weight:700;color:#111827}
.addr-detail{font-size:11.5px;color:#6b7280;line-height:1.6;margin-top:2px}
.ship-info{padding:12px 16px;display:flex;justify-content:space-between;font-size:11px;color:#6b7280}
.ship-info strong{color:#111827}
</style></head>
<body>
<div class="label">
  <div class="bar">
    <div class="bar-carrier">{{carrier}}</div>
    <div class="bar-type">{{service_type}}</div>
  </div>
  <div class="tracking">
    <div class="tracking-label">Tracking Number</div>
    <div class="tracking-num">{{tracking_number}}</div>
  </div>
  <div class="addresses">
    <div class="addr">
      <div class="addr-label">From</div>
      <div class="addr-name">{{sender_name}}</div>
      <div class="addr-detail">{{sender_address}}<br>{{sender_city}}</div>
    </div>
    <div class="addr">
      <div class="addr-label">To</div>
      <div class="addr-name">{{recipient_name}}</div>
      <div class="addr-detail">{{recipient_address}}<br>{{recipient_city}}</div>
    </div>
  </div>
  <div class="ship-info">
    <span>Weight: <strong>{{weight}}</strong></span>
    <span>Ship date: <strong>{{ship_date}}</strong></span>
    <span>Order: <strong>{{order_number}}</strong></span>
  </div>
</div>
</body></html>`,
  },

  // ─── 10. Event Ticket ───────────────────────────────────────────────────────
  {
    name: "Event Ticket",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#f3f4f6;padding:40px;display:flex;justify-content:center}
.ticket{width:480px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1)}
.hero{background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;padding:32px 28px;position:relative;overflow:hidden}
.hero::after{content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;background:rgba(255,255,255,0.06);border-radius:50%}
.event-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.6);margin-bottom:10px}
.event-name{font-size:28px;font-weight:900;letter-spacing:-1px;line-height:1.1;margin-bottom:16px}
.event-meta{display:flex;gap:20px;font-size:12px;color:rgba(255,255,255,0.8)}
.event-meta strong{color:#fff;display:block;font-size:14px;margin-top:2px}
.divider{height:0;border:none;border-top:2px dashed #e5e7eb;margin:0 28px;position:relative}
.divider::before,.divider::after{content:'';position:absolute;top:-12px;width:24px;height:24px;background:#f3f4f6;border-radius:50%}
.divider::before{left:-40px}
.divider::after{right:-40px}
.details{padding:24px 28px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
.detail-item label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;display:block;margin-bottom:3px}
.detail-item p{font-size:14px;font-weight:700;color:#111827}
.footer{padding:16px 28px;border-top:1px solid #f3f4f6;text-align:center;font-size:11px;color:#9ca3af}
</style></head>
<body>
<div class="ticket">
  <div class="hero">
    <div class="event-type">{{event_type}}</div>
    <div class="event-name">{{event_name}}</div>
    <div class="event-meta">
      <div>Date<strong>{{event_date}}</strong></div>
      <div>Time<strong>{{event_time}}</strong></div>
      <div>Venue<strong>{{venue}}</strong></div>
    </div>
  </div>
  <hr class="divider">
  <div class="details">
    <div class="detail-item"><label>Attendee</label><p>{{attendee_name}}</p></div>
    <div class="detail-item"><label>Ticket #</label><p>{{ticket_number}}</p></div>
    <div class="detail-item"><label>Section / Seat</label><p>{{seat}}</p></div>
    <div class="detail-item"><label>Price</label><p>{{ticket_price}}</p></div>
  </div>
  <div class="footer">Present this ticket at the entrance &middot; Non-transferable &middot; No refunds</div>
</div>
</body></html>`,
  },

  // ─── 11. NDA (Non-Disclosure Agreement) ────────────────────────────────────
  {
    name: "Non-Disclosure Agreement",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#374151;font-size:13px;line-height:1.8}
.page{padding:56px 64px;max-width:700px;margin:0 auto}
.header{text-align:center;margin-bottom:40px;padding-bottom:28px;border-bottom:2px solid #111827}
.doc-type{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:#6b7280;margin-bottom:8px}
.doc-title{font-size:24px;font-weight:800;color:#111827;letter-spacing:-0.5px}
.doc-date{font-size:12px;color:#9ca3af;margin-top:6px}
.parties{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:32px;padding:20px;background:#f9fafb;border-radius:8px}
.party label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;display:block;margin-bottom:4px}
.party p{color:#111827;font-weight:600;font-size:13px}
.clause{margin-bottom:20px}
.clause h3{font-size:13px;font-weight:700;color:#111827;margin-bottom:6px}
.clause p{color:#374151}
.sign-section{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:48px;padding-top:28px;border-top:1.5px solid #e5e7eb}
.sign-block h4{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;margin-bottom:20px}
.sign-line{border-bottom:1px solid #9ca3af;margin-bottom:8px;padding-bottom:28px}
.sign-name{font-weight:700;color:#111827;font-size:13px}
.sign-role{font-size:11px;color:#6b7280;margin-top:2px}
</style></head>
<body>
<div class="page">
  <div class="header">
    <div class="doc-type">Confidential</div>
    <div class="doc-title">Non-Disclosure Agreement</div>
    <div class="doc-date">Effective Date: {{effective_date}}</div>
  </div>
  <div class="parties">
    <div class="party"><label>Disclosing Party</label><p>{{disclosing_party}}</p></div>
    <div class="party"><label>Receiving Party</label><p>{{receiving_party}}</p></div>
  </div>
  <div class="clause"><h3>1. Definition of Confidential Information</h3><p>{{definition_clause}}</p></div>
  <div class="clause"><h3>2. Obligations of Receiving Party</h3><p>{{obligations_clause}}</p></div>
  <div class="clause"><h3>3. Term and Duration</h3><p>This Agreement shall remain in effect for a period of {{duration}} from the Effective Date.</p></div>
  <div class="clause"><h3>4. Governing Law</h3><p>This Agreement shall be governed by the laws of {{governing_law}}.</p></div>
  <div class="sign-section">
    <div class="sign-block">
      <h4>Disclosing Party</h4>
      <div class="sign-line"></div>
      <div class="sign-name">{{disclosing_party}}</div>
      <div class="sign-role">Date: _______________</div>
    </div>
    <div class="sign-block">
      <h4>Receiving Party</h4>
      <div class="sign-line"></div>
      <div class="sign-name">{{receiving_party}}</div>
      <div class="sign-role">Date: _______________</div>
    </div>
  </div>
</div>
</body></html>`,
  },

  // ─── 12. Packing Slip ──────────────────────────────────────────────────────
  {
    name: "Packing Slip",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#111827;font-size:13px;line-height:1.5}
.page{padding:44px 52px}
.top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:36px;padding-bottom:24px;border-bottom:2px solid #111827}
.brand{font-size:20px;font-weight:800;letter-spacing:-0.5px}
.brand-sub{font-size:11px;color:#6b7280;margin-top:3px}
.slip-label{text-align:right}
.slip-label .word{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#6b7280}
.slip-label .num{font-size:22px;font-weight:800;letter-spacing:-0.5px;margin-top:2px}
.addresses{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-bottom:32px}
.addr label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;display:block;margin-bottom:6px}
.addr p{font-size:13px;font-weight:500;line-height:1.6;color:#111827}
table{width:100%;border-collapse:collapse;margin-bottom:28px}
thead tr{border-bottom:1.5px solid #111827}
thead th{padding:10px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#6b7280}
thead th:last-child{text-align:center}
tbody tr{border-bottom:1px solid #f3f4f6}
tbody td{padding:12px;color:#374151;font-size:13px}
tbody td:last-child{text-align:center;font-weight:700;color:#111827}
.notes{background:#f9fafb;border-radius:8px;padding:16px 20px;font-size:12px;color:#6b7280}
.notes strong{color:#111827;display:block;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px}
.foot{margin-top:28px;text-align:center;font-size:11px;color:#9ca3af}
</style></head>
<body>
<div class="page">
  <div class="top">
    <div><div class="brand">{{company_name}}</div><div class="brand-sub">{{company_address}}</div></div>
    <div class="slip-label"><div class="word">Packing Slip</div><div class="num">{{order_number}}</div></div>
  </div>
  <div class="addresses">
    <div class="addr"><label>Ship To</label><p>{{ship_to_name}}<br>{{ship_to_address}}</p></div>
    <div class="addr"><label>Order Date</label><p>{{order_date}}<br>Shipping: {{shipping_method}}</p></div>
  </div>
  <table>
    <thead><tr><th style="width:50%">Item</th><th>SKU</th><th>Qty</th></tr></thead>
    <tbody>
      <tr><td>{{item1_name}}</td><td>{{item1_sku}}</td><td>{{item1_qty}}</td></tr>
      <tr><td>{{item2_name}}</td><td>{{item2_sku}}</td><td>{{item2_qty}}</td></tr>
      <tr><td>{{item3_name}}</td><td>{{item3_sku}}</td><td>{{item3_qty}}</td></tr>
    </tbody>
  </table>
  <div class="notes"><strong>Notes</strong>{{packing_notes}}</div>
  <div class="foot">Thank you for your order! Questions? Contact {{company_email}}</div>
</div>
</body></html>`,
  },

  // ─── 13. Meeting Minutes ───────────────────────────────────────────────────
  {
    name: "Meeting Minutes",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#111827;font-size:13px;line-height:1.7}
.page{padding:48px 56px;max-width:700px}
.header{margin-bottom:36px;padding-bottom:24px;border-bottom:2px solid #111827}
.kicker{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#6b7280;margin-bottom:8px}
.title{font-size:26px;font-weight:900;letter-spacing:-1px;color:#111827;margin-bottom:12px}
.meta-row{display:flex;flex-wrap:wrap;gap:24px}
.meta-item{font-size:12px;color:#6b7280}
.meta-item strong{color:#111827}
.section{margin-bottom:28px}
.sec-head{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#2563eb;padding-bottom:8px;border-bottom:1.5px solid #dbeafe;margin-bottom:12px}
.sec-body{color:#374151;white-space:pre-line}
.attendees{display:flex;flex-wrap:wrap;gap:8px;margin-top:4px}
.attendee{background:#f1f5f9;border-radius:6px;padding:5px 12px;font-size:12px;font-weight:600;color:#334155}
.action-items{list-style:none;padding:0}
.action-items li{padding:10px 14px;background:#f8fafc;border-left:3px solid #2563eb;border-radius:0 6px 6px 0;margin-bottom:8px;font-size:13px}
.action-items li strong{color:#111827}
.foot{margin-top:36px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;display:flex;justify-content:space-between}
</style></head>
<body>
<div class="page">
  <div class="header">
    <div class="kicker">Meeting Minutes</div>
    <div class="title">{{meeting_title}}</div>
    <div class="meta-row">
      <div class="meta-item">Date: <strong>{{meeting_date}}</strong></div>
      <div class="meta-item">Time: <strong>{{meeting_time}}</strong></div>
      <div class="meta-item">Location: <strong>{{location}}</strong></div>
    </div>
  </div>
  <div class="section">
    <div class="sec-head">Attendees</div>
    <div class="attendees">
      <div class="attendee">{{attendee1}}</div>
      <div class="attendee">{{attendee2}}</div>
      <div class="attendee">{{attendee3}}</div>
      <div class="attendee">{{attendee4}}</div>
    </div>
  </div>
  <div class="section"><div class="sec-head">Agenda</div><div class="sec-body">{{agenda}}</div></div>
  <div class="section"><div class="sec-head">Discussion Summary</div><div class="sec-body">{{discussion}}</div></div>
  <div class="section">
    <div class="sec-head">Action Items</div>
    <ul class="action-items">
      <li><strong>{{action1_owner}}:</strong> {{action1_task}} — Due {{action1_due}}</li>
      <li><strong>{{action2_owner}}:</strong> {{action2_task}} — Due {{action2_due}}</li>
      <li><strong>{{action3_owner}}:</strong> {{action3_task}} — Due {{action3_due}}</li>
    </ul>
  </div>
  <div class="section"><div class="sec-head">Next Meeting</div><div class="sec-body">{{next_meeting}}</div></div>
  <div class="foot">
    <span>Recorded by <strong>{{recorder}}</strong></span>
    <span>{{meeting_date}}</span>
  </div>
</div>
</body></html>`,
  },

  // ─── 14. Gift Card ─────────────────────────────────────────────────────────
  {
    name: "Gift Card",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#f9fafb;padding:40px;display:flex;justify-content:center;align-items:center;min-height:100vh}
.card{width:440px;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.12)}
.top{background:linear-gradient(135deg,#111827 0%,#1e293b 100%);color:#fff;padding:36px 32px;position:relative;overflow:hidden}
.top::after{content:'';position:absolute;top:-40px;right:-40px;width:160px;height:160px;background:linear-gradient(135deg,rgba(251,191,36,0.15),transparent);border-radius:50%}
.brand{font-size:16px;font-weight:800;letter-spacing:-0.3px;margin-bottom:24px;position:relative;z-index:1}
.gift-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:3px;color:rgba(255,255,255,0.4);margin-bottom:6px;position:relative;z-index:1}
.amount{font-size:56px;font-weight:900;letter-spacing:-3px;line-height:1;position:relative;z-index:1;background:linear-gradient(135deg,#fbbf24,#f59e0b);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.middle{background:#fff;padding:28px 32px}
.msg-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin-bottom:8px}
.msg{font-family:'Playfair Display',Georgia,serif;font-size:18px;font-style:italic;color:#374151;line-height:1.5;margin-bottom:16px}
.names{display:flex;justify-content:space-between;font-size:13px}
.names label{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;display:block;margin-bottom:2px}
.names p{font-weight:700;color:#111827}
.bottom{background:#f9fafb;padding:16px 32px;display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb}
.code{font-family:monospace;font-size:14px;font-weight:700;color:#111827;letter-spacing:2px}
</style></head>
<body>
<div class="card">
  <div class="top">
    <div class="brand">{{brand_name}}</div>
    <div class="gift-label">Gift Card</div>
    <div class="amount">{{amount}}</div>
  </div>
  <div class="middle">
    <div class="msg-label">Message</div>
    <div class="msg">{{message}}</div>
    <div class="names">
      <div><label>From</label><p>{{from_name}}</p></div>
      <div><label>To</label><p>{{to_name}}</p></div>
    </div>
  </div>
  <div class="bottom">
    <span>Redeem at {{brand_name}} stores or online</span>
    <span class="code">{{redemption_code}}</span>
  </div>
</div>
</body></html>`,
  },

  // ─── 15. Resume / CV ───────────────────────────────────────────────────────
  {
    name: "Resume",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#374151;font-size:12.5px;line-height:1.6}
.page{display:grid;grid-template-columns:240px 1fr;min-height:100vh}
.sidebar{background:#0f172a;color:#fff;padding:44px 28px}
.name{font-size:22px;font-weight:800;letter-spacing:-0.5px;line-height:1.2;margin-bottom:4px}
.title{font-size:12px;font-weight:500;color:#94a3b8;margin-bottom:28px}
.side-section{margin-bottom:24px}
.side-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;color:#475569;margin-bottom:10px}
.side-item{font-size:12px;color:#cbd5e1;line-height:1.7;margin-bottom:2px}
.side-item strong{color:#fff}
.skill-bar{height:4px;background:#1e293b;border-radius:2px;margin-top:4px;margin-bottom:10px;overflow:hidden}
.skill-fill{height:100%;background:linear-gradient(90deg,#3b82f6,#60a5fa);border-radius:2px}
.main{padding:44px 40px}
.section{margin-bottom:28px}
.sec-head{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2.5px;color:#111827;padding-bottom:8px;border-bottom:2px solid #111827;margin-bottom:14px}
.entry{margin-bottom:18px}
.entry-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:3px}
.entry-role{font-size:14px;font-weight:700;color:#111827}
.entry-date{font-size:11px;color:#9ca3af;font-weight:500}
.entry-co{font-size:12px;color:#6b7280;font-weight:500;margin-bottom:4px}
.entry-desc{color:#374151;font-size:12.5px;line-height:1.7}
</style></head>
<body>
<div class="page">
  <div class="sidebar">
    <div class="name">{{full_name}}</div>
    <div class="title">{{job_title}}</div>
    <div class="side-section">
      <div class="side-label">Contact</div>
      <div class="side-item">{{email}}</div>
      <div class="side-item">{{phone}}</div>
      <div class="side-item">{{location}}</div>
      <div class="side-item">{{website}}</div>
    </div>
    <div class="side-section">
      <div class="side-label">Skills</div>
      <div class="side-item"><strong>{{skill1}}</strong></div><div class="skill-bar"><div class="skill-fill" style="width:95%"></div></div>
      <div class="side-item"><strong>{{skill2}}</strong></div><div class="skill-bar"><div class="skill-fill" style="width:88%"></div></div>
      <div class="side-item"><strong>{{skill3}}</strong></div><div class="skill-bar"><div class="skill-fill" style="width:82%"></div></div>
      <div class="side-item"><strong>{{skill4}}</strong></div><div class="skill-bar"><div class="skill-fill" style="width:75%"></div></div>
    </div>
    <div class="side-section">
      <div class="side-label">Languages</div>
      <div class="side-item">{{language1}}</div>
      <div class="side-item">{{language2}}</div>
    </div>
  </div>
  <div class="main">
    <div class="section">
      <div class="sec-head">Profile</div>
      <div class="entry-desc">{{profile_summary}}</div>
    </div>
    <div class="section">
      <div class="sec-head">Experience</div>
      <div class="entry">
        <div class="entry-header"><span class="entry-role">{{exp1_role}}</span><span class="entry-date">{{exp1_dates}}</span></div>
        <div class="entry-co">{{exp1_company}}</div>
        <div class="entry-desc">{{exp1_desc}}</div>
      </div>
      <div class="entry">
        <div class="entry-header"><span class="entry-role">{{exp2_role}}</span><span class="entry-date">{{exp2_dates}}</span></div>
        <div class="entry-co">{{exp2_company}}</div>
        <div class="entry-desc">{{exp2_desc}}</div>
      </div>
    </div>
    <div class="section">
      <div class="sec-head">Education</div>
      <div class="entry">
        <div class="entry-header"><span class="entry-role">{{edu_degree}}</span><span class="entry-date">{{edu_dates}}</span></div>
        <div class="entry-co">{{edu_school}}</div>
      </div>
    </div>
  </div>
</div>
</body></html>`,
  },

  // ─── 16. Pay Stub ──────────────────────────────────────────────────────────
  {
    name: "Pay Stub",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#111827;font-size:13px;line-height:1.5}
.page{padding:44px 52px}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:2px solid #111827}
.co{font-size:18px;font-weight:800;letter-spacing:-0.3px}
.co-addr{font-size:11px;color:#6b7280;margin-top:3px}
.stub-label{text-align:right}
.stub-label .word{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#6b7280}
.stub-label .period{font-size:14px;font-weight:700;margin-top:4px}
.emp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:28px;padding:16px 20px;background:#f9fafb;border-radius:8px}
.emp-item label{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;display:block;margin-bottom:3px}
.emp-item p{font-weight:600;color:#111827;font-size:13px}
.columns{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px}
.col-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#111827;padding-bottom:8px;border-bottom:1.5px solid #111827;margin-bottom:10px}
.line{display:flex;justify-content:space-between;padding:6px 0;font-size:12.5px;color:#374151}
.line .v{font-weight:600;color:#111827}
.net{display:flex;justify-content:space-between;align-items:center;padding:20px 24px;background:#111827;border-radius:8px;margin-top:8px}
.net .label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:#9ca3af}
.net .val{font-size:32px;font-weight:900;color:#fff;letter-spacing:-1px}
.foot{margin-top:24px;text-align:center;font-size:11px;color:#9ca3af}
</style></head>
<body>
<div class="page">
  <div class="header">
    <div><div class="co">{{company_name}}</div><div class="co-addr">{{company_address}}</div></div>
    <div class="stub-label"><div class="word">Pay Stub</div><div class="period">{{pay_period}}</div></div>
  </div>
  <div class="emp-grid">
    <div class="emp-item"><label>Employee</label><p>{{employee_name}}</p></div>
    <div class="emp-item"><label>Employee ID</label><p>{{employee_id}}</p></div>
    <div class="emp-item"><label>Department</label><p>{{department}}</p></div>
    <div class="emp-item"><label>Pay Date</label><p>{{pay_date}}</p></div>
  </div>
  <div class="columns">
    <div>
      <div class="col-title">Earnings</div>
      <div class="line"><span>Regular Hours ({{regular_hours}} hrs)</span><span class="v">{{regular_pay}}</span></div>
      <div class="line"><span>Overtime ({{overtime_hours}} hrs)</span><span class="v">{{overtime_pay}}</span></div>
      <div class="line"><span>Bonus</span><span class="v">{{bonus}}</span></div>
      <div class="line" style="border-top:1px solid #e5e7eb;padding-top:10px;margin-top:4px;font-weight:700"><span>Gross Pay</span><span class="v">{{gross_pay}}</span></div>
    </div>
    <div>
      <div class="col-title">Deductions</div>
      <div class="line"><span>Federal Tax</span><span class="v">{{federal_tax}}</span></div>
      <div class="line"><span>State Tax</span><span class="v">{{state_tax}}</span></div>
      <div class="line"><span>Social Security</span><span class="v">{{social_security}}</span></div>
      <div class="line"><span>Health Insurance</span><span class="v">{{health_insurance}}</span></div>
      <div class="line" style="border-top:1px solid #e5e7eb;padding-top:10px;margin-top:4px;font-weight:700"><span>Total Deductions</span><span class="v">{{total_deductions}}</span></div>
    </div>
  </div>
  <div class="net">
    <div class="label">Net Pay</div>
    <div class="val">{{net_pay}}</div>
  </div>
  <div class="foot">This is a system-generated document. Retain for your records.</div>
</div>
</body></html>`,
  },

  // ─── 17. Boarding Pass ─────────────────────────────────────────────────────
  {
    name: "Boarding Pass",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#f3f4f6;padding:40px;display:flex;justify-content:center}
.pass{width:520px;display:flex;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1)}
.main-section{flex:1;padding:28px 24px}
.airline{font-size:16px;font-weight:800;color:#111827;letter-spacing:-0.3px;margin-bottom:20px}
.route{display:flex;align-items:center;gap:16px;margin-bottom:24px}
.city{text-align:center}
.city-code{font-size:32px;font-weight:900;letter-spacing:-1px;color:#111827;line-height:1}
.city-name{font-size:10px;color:#9ca3af;font-weight:500;margin-top:2px}
.route-line{flex:1;display:flex;align-items:center;gap:8px}
.route-line .line{flex:1;height:1px;background:#d1d5db}
.route-line .plane{font-size:16px;color:#2563eb}
.details{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.detail label{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;display:block;margin-bottom:2px}
.detail p{font-size:14px;font-weight:700;color:#111827}
.detail p.highlight{color:#2563eb}
.tear{width:1px;background:repeating-linear-gradient(to bottom,#d1d5db 0,#d1d5db 6px,transparent 6px,transparent 12px);margin:12px 0}
.stub{width:120px;padding:20px 16px;display:flex;flex-direction:column;justify-content:space-between;background:#f8fafc}
.stub-label{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#9ca3af}
.stub-value{font-size:13px;font-weight:700;color:#111827;margin-top:1px}
.stub-route{text-align:center;margin:12px 0}
.stub-route .codes{font-size:18px;font-weight:900;color:#111827;letter-spacing:-0.5px}
.stub-route .arrow{color:#9ca3af;font-size:11px}
</style></head>
<body>
<div class="pass">
  <div class="main-section">
    <div class="airline">{{airline}}</div>
    <div class="route">
      <div class="city"><div class="city-code">{{origin_code}}</div><div class="city-name">{{origin_city}}</div></div>
      <div class="route-line"><div class="line"></div><div class="plane">&#9992;</div><div class="line"></div></div>
      <div class="city"><div class="city-code">{{dest_code}}</div><div class="city-name">{{dest_city}}</div></div>
    </div>
    <div class="details">
      <div class="detail"><label>Passenger</label><p>{{passenger_name}}</p></div>
      <div class="detail"><label>Flight</label><p class="highlight">{{flight_number}}</p></div>
      <div class="detail"><label>Date</label><p>{{flight_date}}</p></div>
      <div class="detail"><label>Boarding</label><p>{{boarding_time}}</p></div>
      <div class="detail"><label>Gate</label><p class="highlight">{{gate}}</p></div>
      <div class="detail"><label>Seat</label><p>{{seat}}</p></div>
    </div>
  </div>
  <div class="tear"></div>
  <div class="stub">
    <div><div class="stub-label">Passenger</div><div class="stub-value">{{passenger_name}}</div></div>
    <div class="stub-route"><div class="codes">{{origin_code}}</div><div class="arrow">&#9660;</div><div class="codes">{{dest_code}}</div></div>
    <div><div class="stub-label">Seat</div><div class="stub-value">{{seat}}</div></div>
    <div><div class="stub-label">Gate</div><div class="stub-value">{{gate}}</div></div>
  </div>
</div>
</body></html>`,
  },

  // ─── 18. Quote / Estimate ──────────────────────────────────────────────────
  {
    name: "Quote",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#111827;font-size:13px;line-height:1.5}
.page{padding:52px 56px}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:28px;border-bottom:1.5px solid #2563eb}
.brand{font-size:20px;font-weight:800;letter-spacing:-0.5px}
.brand-meta{font-size:11.5px;color:#6b7280;margin-top:4px;line-height:1.7}
.quote-info{text-align:right}
.quote-info .word{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#2563eb}
.quote-info .num{font-size:24px;font-weight:800;letter-spacing:-0.5px;margin-top:4px}
.quote-info .valid{font-size:11px;color:#6b7280;margin-top:4px}
.quote-info .valid strong{color:#111827}
.meta{display:grid;grid-template-columns:2fr 1fr 1fr;gap:28px;margin-bottom:32px}
.meta-block label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;display:block;margin-bottom:4px}
.meta-block p{color:#111827;font-size:13px;font-weight:500;line-height:1.6}
table{width:100%;border-collapse:collapse;margin-bottom:28px}
thead tr{background:#eff6ff;border-bottom:1.5px solid #2563eb}
thead th{padding:10px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#2563eb}
thead th:last-child{text-align:right}
tbody tr{border-bottom:1px solid #f3f4f6}
tbody td{padding:14px 12px;color:#374151;font-size:13px}
tbody td:last-child{text-align:right;font-weight:600;color:#111827}
.totals{display:flex;justify-content:flex-end;margin-bottom:40px}
.totals-inner{width:260px}
.t-line{display:flex;justify-content:space-between;padding:7px 0;font-size:13px;color:#6b7280}
.t-line.total{border-top:2px solid #2563eb;margin-top:8px;padding-top:14px;font-size:18px;font-weight:800;color:#111827}
.notes{background:#eff6ff;border-radius:8px;padding:16px 20px;font-size:12px;color:#374151;line-height:1.7}
.notes strong{display:block;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#2563eb;margin-bottom:4px}
.footer{margin-top:36px;display:flex;justify-content:space-between;padding-top:20px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af}
</style></head>
<body>
<div class="page">
  <div class="header">
    <div><div class="brand">{{company_name}}</div><div class="brand-meta">{{company_address}}<br>{{company_email}}</div></div>
    <div class="quote-info"><div class="word">Quote</div><div class="num">{{quote_number}}</div><div class="valid">Valid until <strong>{{valid_until}}</strong></div></div>
  </div>
  <div class="meta">
    <div class="meta-block"><label>Prepared For</label><p>{{client_name}}<br>{{client_address}}</p></div>
    <div class="meta-block"><label>Issue Date</label><p>{{issue_date}}</p></div>
    <div class="meta-block"><label>Prepared By</label><p>{{prepared_by}}</p></div>
  </div>
  <table>
    <thead><tr><th style="width:48%">Description</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit Price</th><th>Amount</th></tr></thead>
    <tbody>
      <tr><td>{{qt_item1_desc}}</td><td style="text-align:center">{{qt_item1_qty}}</td><td style="text-align:right">{{qt_item1_price}}</td><td>{{qt_item1_total}}</td></tr>
      <tr><td>{{qt_item2_desc}}</td><td style="text-align:center">{{qt_item2_qty}}</td><td style="text-align:right">{{qt_item2_price}}</td><td>{{qt_item2_total}}</td></tr>
      <tr><td>{{qt_item3_desc}}</td><td style="text-align:center">{{qt_item3_qty}}</td><td style="text-align:right">{{qt_item3_price}}</td><td>{{qt_item3_total}}</td></tr>
    </tbody>
  </table>
  <div class="totals">
    <div class="totals-inner">
      <div class="t-line"><span>Subtotal</span><span>{{subtotal}}</span></div>
      <div class="t-line"><span>Tax ({{tax_rate}}%)</span><span>{{tax_amount}}</span></div>
      <div class="t-line total"><span>Total</span><span>{{total}}</span></div>
    </div>
  </div>
  <div class="notes"><strong>Terms &amp; Notes</strong>{{quote_notes}}</div>
  <div class="footer"><div>{{company_name}} &middot; {{company_email}}</div><div>Quote {{quote_number}}</div></div>
</div>
</body></html>`,
  },

  // ─── 19. Warranty Card ─────────────────────────────────────────────────────
  {
    name: "Warranty Card",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#f3f4f6;padding:40px;display:flex;justify-content:center}
.card{width:480px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)}
.top{background:#111827;color:#fff;padding:28px;display:flex;justify-content:space-between;align-items:flex-start}
.top-brand{font-size:18px;font-weight:800;letter-spacing:-0.3px}
.top-type{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;background:#22c55e;color:#fff;padding:4px 12px;border-radius:4px;margin-top:4px;display:inline-block}
.shield{width:48px;height:48px;background:linear-gradient(135deg,#22c55e,#16a34a);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:24px}
.body{padding:28px}
.product{background:#f9fafb;border-radius:10px;padding:18px;margin-bottom:20px}
.product-name{font-size:16px;font-weight:800;color:#111827;margin-bottom:10px}
.product-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.product-item label{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af}
.product-item p{font-size:13px;font-weight:600;color:#111827;margin-top:1px}
.dates{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
.date-box{border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;text-align:center}
.date-box label{font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;display:block;margin-bottom:4px}
.date-box p{font-size:16px;font-weight:800;color:#111827}
.date-box.active{border-color:#22c55e;background:#f0fdf4}
.date-box.active p{color:#16a34a}
.coverage{font-size:12px;color:#6b7280;line-height:1.7;margin-bottom:20px}
.coverage strong{color:#111827;display:block;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px}
.footer{padding:16px 28px;border-top:1px solid #f3f4f6;text-align:center;font-size:11px;color:#9ca3af}
</style></head>
<body>
<div class="card">
  <div class="top">
    <div><div class="top-brand">{{warranty_brand}}</div><div class="top-type">Warranty Certificate</div></div>
    <div class="shield">&#10003;</div>
  </div>
  <div class="body">
    <div class="product">
      <div class="product-name">{{product_name}}</div>
      <div class="product-grid">
        <div class="product-item"><label>Serial Number</label><p>{{serial_number}}</p></div>
        <div class="product-item"><label>Model</label><p>{{model_number}}</p></div>
        <div class="product-item"><label>Customer</label><p>{{customer_name}}</p></div>
        <div class="product-item"><label>Purchase Location</label><p>{{purchase_location}}</p></div>
      </div>
    </div>
    <div class="dates">
      <div class="date-box"><label>Purchase Date</label><p>{{purchase_date}}</p></div>
      <div class="date-box active"><label>Warranty Expires</label><p>{{warranty_expiry}}</p></div>
    </div>
    <div class="coverage"><strong>Coverage</strong>{{coverage_details}}</div>
  </div>
  <div class="footer">Keep this document for warranty claims &middot; {{warranty_brand}} Support: {{support_email}}</div>
</div>
</body></html>`,
  },

  // ─── 20. Donation Receipt ──────────────────────────────────────────────────
  {
    name: "Donation Receipt",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#fff;color:#111827;font-size:13px;line-height:1.6}
.page{padding:52px 56px;max-width:600px;margin:0 auto}
.header{text-align:center;margin-bottom:36px;padding-bottom:28px;border-bottom:1.5px solid #111827}
.org-name{font-size:22px;font-weight:800;letter-spacing:-0.5px;margin-bottom:4px}
.org-addr{font-size:11.5px;color:#6b7280;line-height:1.7}
.org-ein{font-size:11px;color:#9ca3af;margin-top:4px}
.badge{display:inline-block;margin-top:12px;background:#f0fdf4;border:1px solid #bbf7d0;color:#15803d;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;padding:5px 14px;border-radius:6px}
.receipt-num{text-align:center;font-size:12px;color:#9ca3af;margin-bottom:28px}
.receipt-num strong{color:#111827;font-size:14px}
.amount-section{text-align:center;padding:28px;background:#f9fafb;border-radius:12px;margin-bottom:28px}
.amount-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:2.5px;color:#9ca3af;margin-bottom:8px}
.amount{font-size:48px;font-weight:900;letter-spacing:-2px;color:#111827;line-height:1}
.amount-type{font-size:12px;color:#6b7280;margin-top:8px}
.details{margin-bottom:28px}
.detail-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:13px}
.detail-row .k{color:#6b7280}
.detail-row .v{font-weight:600;color:#111827}
.tax-note{background:#eff6ff;border-radius:8px;padding:16px 20px;font-size:12px;color:#374151;line-height:1.7}
.tax-note strong{display:block;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#2563eb;margin-bottom:4px}
.footer{margin-top:32px;text-align:center;font-size:11px;color:#9ca3af;line-height:1.7}
.footer strong{color:#111827;display:block;font-size:13px;margin-bottom:4px}
</style></head>
<body>
<div class="page">
  <div class="header">
    <div class="org-name">{{organization_name}}</div>
    <div class="org-addr">{{organization_address}}</div>
    <div class="org-ein">EIN: {{ein_number}}</div>
    <div class="badge">Official Donation Receipt</div>
  </div>
  <div class="receipt-num">Receipt #: <strong>{{receipt_number}}</strong></div>
  <div class="amount-section">
    <div class="amount-label">Donation Amount</div>
    <div class="amount">{{donation_amount}}</div>
    <div class="amount-type">{{donation_type}}</div>
  </div>
  <div class="details">
    <div class="detail-row"><span class="k">Donor Name</span><span class="v">{{donor_name}}</span></div>
    <div class="detail-row"><span class="k">Donor Address</span><span class="v">{{donor_address}}</span></div>
    <div class="detail-row"><span class="k">Donation Date</span><span class="v">{{donation_date}}</span></div>
    <div class="detail-row"><span class="k">Payment Method</span><span class="v">{{payment_method}}</span></div>
    <div class="detail-row"><span class="k">Purpose</span><span class="v">{{donation_purpose}}</span></div>
  </div>
  <div class="tax-note"><strong>Tax Deduction Notice</strong>No goods or services were provided in exchange for this contribution. This receipt may be used for tax deduction purposes. Please consult your tax advisor.</div>
  <div class="footer"><strong>Thank you for your generous contribution.</strong>{{organization_name}} is a registered 501(c)(3) nonprofit organization.</div>
</div>
</body></html>`,
  },
];

/**
 * Seeds starter templates for a newly created user.
 * Skips if the user already has templates (idempotent for normal use).
 *
 * Uses admin's templates as the canonical source (so cover images set in
 * /admin/templates are included). Falls back to the hardcoded STARTER_TEMPLATES
 * if no admin account exists yet.
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

  // Prefer admin's templates as the canonical seed source (includes coverImageUrl)
  const adminUser = await prisma.user.findFirst({
    where: { role: "admin" },
    select: { id: true },
  });

  const source: StarterTemplate[] =
    adminUser
      ? await prisma.template.findMany({
          where: { userId: adminUser.id },
          select: { name: true, html: true, coverImageUrl: true },
          orderBy: { createdAt: "asc" },
        })
      : STARTER_TEMPLATES;

  // Upsert by name so re-seeding refreshes HTML and cover images without duplicating
  for (const t of source) {
    const existing = await prisma.template.findFirst({
      where: { userId, name: t.name },
      select: { id: true },
    });
    if (existing) {
      await prisma.template.update({
        where: { id: existing.id },
        data: { html: t.html, coverImageUrl: t.coverImageUrl ?? null },
      });
    } else {
      await prisma.template.create({
        data: { userId, name: t.name, html: t.html, coverImageUrl: t.coverImageUrl ?? null },
      });
    }
  }
}
