import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "Rendr <noreply@rendrpdf.com>";
const BASE_URL = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

/** Wrap every email in our branded shell */
function shell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:48px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <tr>
          <td style="padding:24px 32px;border-bottom:1px solid rgba(255,255,255,0.06);">
            <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.03em;text-decoration:none;">Rendr</span>
          </td>
        </tr>

        <!-- Body -->
        <tr><td style="padding:32px 32px 28px;">${body}</td></tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0;font-size:12px;color:#52525b;line-height:1.6;">
              © ${new Date().getFullYear()} Rendr · <a href="${BASE_URL}" style="color:#52525b;">rendrpdf.com</a><br/>
              You're receiving this because you signed up for a Rendr account.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btn(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#ffffff;color:#09090b;font-size:14px;font-weight:600;padding:12px 22px;border-radius:8px;text-decoration:none;letter-spacing:-0.01em;">${label} →</a>`;
}

/** Skip silently if RESEND_API_KEY is not configured */
function canSend(): boolean {
  return !!process.env.RESEND_API_KEY;
}

// ─── Welcome ────────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(email: string): Promise<void> {
  if (!canSend()) return;

  const html = shell(
    "Welcome to Rendr",
    `<h1 style="margin:0 0 10px;font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.03em;">Welcome to Rendr 👋</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#a1a1aa;line-height:1.7;">You now have <strong style="color:#e4e4e7;">100 free renders / month</strong>. Get your first PDF in under 5 minutes:</p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      ${[
        ["Create an API key", `/app/api-keys`],
        ["Make your first render", `/app/convert`],
        ["Explore templates", `/app/templates`],
      ]
        .map(
          ([label, href], i) =>
            `<tr>
              <td style="padding:6px 0;vertical-align:middle;width:28px;">
                <span style="display:inline-flex;width:22px;height:22px;background:#1d4ed8;border-radius:50%;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;">${i + 1}</span>
              </td>
              <td style="padding:6px 0;font-size:14px;color:#e4e4e7;">
                <a href="${BASE_URL}${href}" style="color:#60a5fa;text-decoration:none;">${label}</a>
              </td>
            </tr>`
        )
        .join("")}
    </table>

    ${btn(`${BASE_URL}/app`, "Go to dashboard")}

    <p style="margin:24px 0 0;font-size:13px;color:#52525b;">Need help? Reply to this email and we'll get back to you.</p>`
  );

  await resend.emails
    .send({ from: FROM, to: email, subject: "Welcome to Rendr — you're all set", html })
    .catch(console.error);
}

// ─── Email verification ──────────────────────────────────────────────────────

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  if (!canSend()) return;

  const verifyUrl = `${BASE_URL}/verify-email?token=${token}`;

  const html = shell(
    "Verify your email",
    `<h1 style="margin:0 0 10px;font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.03em;">Verify your email address</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#a1a1aa;line-height:1.7;">Click below to verify your email. This link expires in <strong style="color:#e4e4e7;">24 hours</strong>.</p>

    ${btn(verifyUrl, "Verify email")}

    <p style="margin:24px 0 0;font-size:12px;color:#52525b;">Or paste this link into your browser:<br/>
      <a href="${verifyUrl}" style="color:#60a5fa;word-break:break-all;">${verifyUrl}</a>
    </p>
    <p style="margin:16px 0 0;font-size:12px;color:#52525b;">If you didn't create a Rendr account, you can safely ignore this email.</p>`
  );

  await resend.emails
    .send({ from: FROM, to: email, subject: "Please verify your Rendr email address", html })
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
    `<h1 style="margin:0 0 10px;font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.03em;">New API key created</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#a1a1aa;line-height:1.7;">A new API key was added to your Rendr account.</p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d0d0d;border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:0;margin-bottom:28px;">
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#71717a;border-bottom:1px solid rgba(255,255,255,0.06);">Key name</td>
        <td style="padding:12px 16px;font-size:13px;color:#e4e4e7;text-align:right;border-bottom:1px solid rgba(255,255,255,0.06);font-weight:600;">${keyName}</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#71717a;">Prefix</td>
        <td style="padding:12px 16px;font-size:13px;color:#e4e4e7;text-align:right;font-family:monospace;">${keyPrefix}•••</td>
      </tr>
    </table>

    <p style="margin:0 0 20px;font-size:14px;color:#a1a1aa;">If you didn't create this key, <a href="${BASE_URL}/app/api-keys" style="color:#f87171;">revoke it immediately</a>.</p>

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

// ─── Password reset (future use) ─────────────────────────────────────────────

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  if (!canSend()) return;

  const resetUrl = `${BASE_URL}/reset-password?token=${token}`;

  const html = shell(
    "Reset your password",
    `<h1 style="margin:0 0 10px;font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.03em;">Reset your password</h1>
    <p style="margin:0 0 24px;font-size:15px;color:#a1a1aa;line-height:1.7;">We received a request to reset your Rendr password. This link expires in <strong style="color:#e4e4e7;">1 hour</strong>.</p>

    ${btn(resetUrl, "Reset password")}

    <p style="margin:24px 0 0;font-size:12px;color:#52525b;">If you didn't request a password reset, ignore this email — your password won't change.</p>`
  );

  await resend.emails
    .send({ from: FROM, to: email, subject: "Reset your Rendr password", html })
    .catch(console.error);
}
