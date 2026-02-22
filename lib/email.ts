import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "Rendr <noreply@rendrpdf.com>";
const BASE_URL = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

/**
 * Branded email shell.
 * Light theme — works in Gmail, Apple Mail, Outlook, and dark-mode clients.
 * Uses bgcolor attributes + inline styles for maximum compatibility.
 */
function shell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${title}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;" bgcolor="#f4f4f5">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f5" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <!-- Email card -->
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4e4e7;" bgcolor="#ffffff">

          <!-- Header -->
          <tr>
            <td bgcolor="#09090b" style="background-color:#09090b;padding:20px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.03em;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Rendr</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 32px;" bgcolor="#ffffff">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td bgcolor="#fafafa" style="background-color:#fafafa;padding:20px 32px;border-top:1px solid #f0f0f0;">
              <p style="margin:0;font-size:12px;color:#a1a1aa;line-height:1.7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
                © ${new Date().getFullYear()} Rendr · <a href="${BASE_URL}" style="color:#a1a1aa;text-decoration:underline;">rendrpdf.com</a><br/>
                You're receiving this because you have a Rendr account.
              </p>
            </td>
          </tr>

        </table>
        <!-- /card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

function btn(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:0;">
    <tr>
      <td style="border-radius:8px;background-color:#18181b;" bgcolor="#18181b">
        <a href="${href}" style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-0.01em;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">${label} &rarr;</a>
      </td>
    </tr>
  </table>`;
}

/** Skip silently if RESEND_API_KEY is not configured */
export function canSend(): boolean {
  return !!process.env.RESEND_API_KEY;
}

// ─── Welcome ────────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(email: string): Promise<void> {
  if (!canSend()) return;

  const steps = [
    ["Create an API key", `/app/api-keys`],
    ["Make your first render", `/app/convert`],
    ["Explore templates", `/app/templates`],
  ];

  const html = shell(
    "Welcome to Rendr",
    `<h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#09090b;letter-spacing:-0.04em;line-height:1.2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Welcome to Rendr</h1>
    <p style="margin:0 0 28px;font-size:15px;color:#52525b;line-height:1.7;">You're all set. Your account comes with <strong style="color:#09090b;">100 free renders / month</strong>. Get your first PDF in under 5 minutes:</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;">
      ${steps
        .map(
          ([label, href], i) => `
      <tr style="background-color:${i % 2 === 0 ? "#ffffff" : "#fafafa"};">
        <td style="padding:14px 20px;border-bottom:${i < 2 ? "1px solid #f0f0f0" : "none"};" bgcolor="${i % 2 === 0 ? "#ffffff" : "#fafafa"}">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="vertical-align:middle;width:32px;padding-right:14px;">
                <div style="width:24px;height:24px;background-color:#18181b;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;color:#ffffff;">${i + 1}</div>
              </td>
              <td style="vertical-align:middle;">
                <a href="${BASE_URL}${href}" style="font-size:14px;color:#18181b;text-decoration:none;font-weight:600;">${label}</a>
              </td>
              <td style="vertical-align:middle;text-align:right;padding-left:8px;">
                <span style="font-size:14px;color:#a1a1aa;">&rarr;</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
        )
        .join("")}
    </table>

    ${btn(`${BASE_URL}/app`, "Go to dashboard")}

    <p style="margin:24px 0 0;font-size:13px;color:#a1a1aa;">Questions? Reply to this email — we read every one.</p>`
  );

  await resend.emails
    .send({ from: FROM, to: email, subject: "Welcome to Rendr — you're all set", html })
    .catch(console.error);
}

// ─── Email verification (6-digit code) ──────────────────────────────────────

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  if (!canSend()) return;

  const html = shell(
    "Your Rendr verification code",
    `<h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#09090b;letter-spacing:-0.04em;line-height:1.2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Verify your email</h1>
    <p style="margin:0 0 32px;font-size:15px;color:#52525b;line-height:1.7;">Enter this code in Rendr to verify your email address. Expires in <strong style="color:#09090b;">24 hours</strong>.</p>

    <!-- Code block -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td bgcolor="#f0f4ff" style="background-color:#f0f4ff;border:2px solid #c7d7fe;border-radius:12px;padding:24px 40px;text-align:center;">
                <span style="font-family:'Courier New',Courier,monospace;font-size:48px;font-weight:900;letter-spacing:16px;color:#1e40af;display:block;line-height:1;">${code}</span>
                <span style="display:block;margin-top:10px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#93c5fd;">verification code</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${btn(`${BASE_URL}/verify-email`, "Go to verification page")}

    <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa;">If you didn't create a Rendr account, you can safely ignore this email.</p>`
  );

  await resend.emails
    .send({ from: FROM, to: email, subject: `${code} — your Rendr verification code`, html })
    .catch(console.error);
}

// ─── API key created ─────────────────────────────────────────────────────────

export async function sendApiKeyCreatedEmail(
  email: string,
  keyName: string,
  keyPrefix: string
): Promise<void> {
  if (!canSend()) return;

  const html = shell(
    "New API key created",
    `<h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#09090b;letter-spacing:-0.04em;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">New API key created</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#52525b;line-height:1.7;">A new API key was just added to your Rendr account.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e4e4e7;border-radius:10px;overflow:hidden;margin-bottom:28px;">
      <tr bgcolor="#fafafa">
        <td style="padding:12px 20px;font-size:13px;color:#71717a;border-bottom:1px solid #f0f0f0;" bgcolor="#fafafa">Key name</td>
        <td style="padding:12px 20px;font-size:13px;color:#09090b;text-align:right;border-bottom:1px solid #f0f0f0;font-weight:600;">${keyName}</td>
      </tr>
      <tr bgcolor="#ffffff">
        <td style="padding:12px 20px;font-size:13px;color:#71717a;" bgcolor="#ffffff">Prefix</td>
        <td style="padding:12px 20px;font-size:13px;color:#09090b;text-align:right;font-family:'Courier New',Courier,monospace;">${keyPrefix}•••</td>
      </tr>
    </table>

    <p style="margin:0 0 24px;font-size:14px;color:#52525b;padding:14px 16px;background-color:#fef2f2;border:1px solid #fecaca;border-radius:8px;">
      <strong style="color:#dc2626;">Not you?</strong> <a href="${BASE_URL}/app/api-keys" style="color:#dc2626;font-weight:600;">Revoke this key immediately &rarr;</a>
    </p>

    ${btn(`${BASE_URL}/app/api-keys`, "Manage API keys")}`
  );

  await resend.emails
    .send({
      from: FROM,
      to: email,
      subject: `New API key created: ${keyName}`,
      html,
    })
    .catch(console.error);
}

// ─── Usage warning (80% of plan limit) ──────────────────────────────────────

export async function sendUsageWarningEmail(
  email: string,
  used: number,
  limit: number
): Promise<void> {
  if (!canSend()) return;

  const pct = Math.round((used / limit) * 100);
  const remaining = limit - used;

  const html = shell(
    `You've used ${pct}% of your renders`,
    `<h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#09090b;letter-spacing:-0.04em;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">You're at ${pct}% of your limit</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#52525b;line-height:1.7;">You've used <strong style="color:#09090b;">${used} of ${limit}</strong> renders this month. Only <strong style="color:#d97706;">${remaining} renders</strong> remaining.</p>

    <!-- Progress bar -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;border:1px solid #fde68a;border-radius:10px;overflow:hidden;">
      <tr bgcolor="#fffbeb">
        <td style="padding:16px 20px;" bgcolor="#fffbeb">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="background-color:#e5e7eb;border-radius:4px;height:8px;overflow:hidden;" bgcolor="#e5e7eb">
                <div style="background:linear-gradient(90deg,#f59e0b,#ef4444);height:8px;width:${pct}%;border-radius:4px;"></div>
              </td>
            </tr>
          </table>
          <p style="margin:10px 0 0;font-size:12px;color:#92400e;text-align:right;">${used} / ${limit} renders used this month</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 24px;font-size:14px;color:#52525b;line-height:1.7;">Upgrade to keep rendering without interruption. Your plan resets on the 1st of each month.</p>

    ${btn(`${BASE_URL}/app/billing`, "Upgrade plan")}

    <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa;">Reply to this email if you have questions about your plan.</p>`
  );

  await resend.emails
    .send({
      from: FROM,
      to: email,
      subject: `Heads up: ${pct}% of your Rendr renders used`,
      html,
    })
    .catch(console.error);
}

// ─── Usage limit reached (100%) ──────────────────────────────────────────────

export async function sendUsageLimitReachedEmail(
  email: string,
  limit: number
): Promise<void> {
  if (!canSend()) return;

  const html = shell(
    "Render limit reached",
    `<h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#09090b;letter-spacing:-0.04em;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Render limit reached</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#52525b;line-height:1.7;">You've used all <strong style="color:#09090b;">${limit} renders</strong> in your plan this month.</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;border:1px solid #fecaca;border-radius:10px;overflow:hidden;">
      <tr bgcolor="#fef2f2">
        <td style="padding:16px 20px;" bgcolor="#fef2f2">
          <p style="margin:0;font-size:14px;color:#991b1b;font-weight:600;">⚠ New renders are paused until you upgrade or your plan resets on the 1st.</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 28px;font-size:14px;color:#52525b;line-height:1.7;">Upgrade now to keep generating PDFs instantly, or wait for your free tier to reset next month.</p>

    ${btn(`${BASE_URL}/app/billing`, "Upgrade now")}

    <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa;">Reply to this email if you need help or want to discuss a custom plan.</p>`
  );

  await resend.emails
    .send({
      from: FROM,
      to: email,
      subject: "Your Rendr render limit has been reached",
      html,
    })
    .catch(console.error);
}

// ─── Password reset ───────────────────────────────────────────────────────────

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  if (!canSend()) return;

  const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

  const html = shell(
    "Reset your Rendr password",
    `<h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#09090b;letter-spacing:-0.04em;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">Reset your password</h1>
    <p style="margin:0 0 28px;font-size:15px;color:#52525b;line-height:1.7;">We received a request to reset your Rendr password. This link expires in <strong style="color:#09090b;">1 hour</strong>.</p>

    ${btn(resetUrl, "Reset password")}

    <p style="margin:24px 0 0;font-size:12px;color:#a1a1aa;">If you didn't request this, you can safely ignore this email — your password won't change.</p>`
  );

  await resend.emails
    .send({ from: FROM, to: email, subject: "Reset your Rendr password", html })
    .catch(console.error);
}
