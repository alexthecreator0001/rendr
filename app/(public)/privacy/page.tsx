import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Rendr collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <Section size="md">
      <Container size="md">
        <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Legal
          </p>
          <h1>Privacy Policy</h1>
          <p className="text-sm text-zinc-500">Last updated: February 24, 2026</p>

          <p>
            This Privacy Policy explains how Rendr (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
            collects, uses, stores, and protects information when you use our
            website, API, and related services (the &quot;Service&quot;). We are committed to
            safeguarding your privacy and handling your data responsibly.
          </p>

          <h2>1. Information We Collect</h2>

          <h3>Account information</h3>
          <p>
            When you create an account we collect your email address, name (if
            provided), and a hashed password. If you sign in through a third-party
            provider we receive basic profile data from that provider.
          </p>

          <h3>Billing information</h3>
          <p>
            Payment details (card number, billing address) are collected and
            processed by our payment processor, Stripe. We do not store full card
            numbers on our servers. We retain Stripe customer and subscription
            identifiers to manage your plan.
          </p>

          <h3>Usage data</h3>
          <p>
            We collect information about how you interact with the Service, including
            API request metadata (timestamps, response codes, conversion counts),
            dashboard activity, and IP addresses. This data helps us monitor
            performance and enforce rate limits.
          </p>

          <h3>Document data</h3>
          <p>
            HTML content, URLs, and template data you submit for PDF conversion are
            processed on our servers. Generated PDFs are stored temporarily and
            served via signed, time-limited download URLs. We do not read, analyze,
            or train models on your document data.
          </p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>Provide, operate, and improve the Service</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send transactional emails (account verification, billing receipts, usage alerts)</li>
            <li>Monitor for abuse, fraud, and security threats</li>
            <li>Respond to support requests</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>
            We do not use your data for advertising or sell it to third parties.
          </p>

          <h2>3. Legal Basis for Processing (GDPR)</h2>
          <p>If you are in the European Economic Area, we process your data based on:</p>
          <ul>
            <li>
              <strong>Contractual necessity:</strong> processing required to deliver
              the Service you signed up for
            </li>
            <li>
              <strong>Legitimate interests:</strong> maintaining security, preventing
              fraud, and improving the Service
            </li>
            <li>
              <strong>Legal obligation:</strong> complying with applicable laws and
              regulations
            </li>
            <li>
              <strong>Consent:</strong> where you have opted in to optional
              communications
            </li>
          </ul>

          <h2>4. Third-Party Services</h2>
          <p>
            We share limited data with the following third-party providers to operate
            the Service:
          </p>
          <ul>
            <li>
              <strong>Stripe</strong> — payment processing. Stripe&apos;s own privacy
              policy governs the data they collect.
            </li>
            <li>
              <strong>Resend</strong> — transactional email delivery (account
              verification, billing alerts).
            </li>
          </ul>
          <p>
            We do not sell, rent, or trade your personal data. We may disclose
            information if required by law, subpoena, or court order.
          </p>

          <h2>5. Data Retention</h2>
          <ul>
            <li>
              <strong>Account data</strong> is retained for as long as your account is
              active. If you delete your account, we remove your personal data within
              30 days, except where retention is required by law.
            </li>
            <li>
              <strong>Generated PDFs</strong> are stored temporarily and delivered via
              signed download links. Files are not retained indefinitely.
            </li>
            <li>
              <strong>API logs</strong> (request metadata, not document content) are
              retained for up to 90 days for debugging and analytics, then purged.
            </li>
          </ul>

          <h2>6. Data Security</h2>
          <p>
            We implement industry-standard security measures including encrypted
            connections (TLS), hashed passwords, hashed API keys, and access controls
            on our infrastructure. However, no method of electronic transmission or
            storage is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>7. International Transfers</h2>
          <p>
            Our servers are located in the United States. If you access the Service
            from outside the US, your data may be transferred to and processed in the
            US. For users in the EEA, we rely on Standard Contractual Clauses or
            other approved mechanisms to ensure adequate data protection.
          </p>

          <h2>8. Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (&quot;right to be forgotten&quot;)</li>
            <li>Restrict or object to certain processing activities</li>
            <li>Request a portable copy of your data</li>
            <li>Withdraw consent at any time (where processing is based on consent)</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:hello@rendrpdf.com">hello@rendrpdf.com</a>. We will
            respond within 30 days.
          </p>

          <h3>California residents (CCPA)</h3>
          <p>
            If you are a California resident, you have the right to know what
            personal information we collect, request its deletion, and opt out of
            its sale. We do not sell personal information. To submit a request,
            contact us using the email above.
          </p>

          <h2>9. Cookies</h2>
          <p>
            We use essential cookies required for authentication and session
            management. We do not use third-party tracking or advertising cookies.
            Our analytics are privacy-focused and do not rely on cookies to identify
            users.
          </p>

          <h2>10. Children&apos;s Privacy</h2>
          <p>
            The Service is not directed at individuals under 18. We do not knowingly
            collect data from minors. If we learn that we have collected personal
            information from a child, we will delete it promptly.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make material
            changes, we will notify you via email or a prominent notice on the
            dashboard at least 14 days before the changes take effect. Your continued
            use of the Service after the effective date constitutes acceptance.
          </p>

          <h2>12. Contact</h2>
          <p>
            If you have questions or concerns about this Privacy Policy or our data
            practices, contact us at{" "}
            <a href="mailto:hello@rendrpdf.com">hello@rendrpdf.com</a>.
          </p>
        </div>
      </Container>
    </Section>
  );
}
