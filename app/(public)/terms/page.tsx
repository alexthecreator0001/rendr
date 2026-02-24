import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for using the Rendr HTML-to-PDF API.",
};

export default function TermsPage() {
  return (
    <Section size="md">
      <Container size="md">
        <div className="prose prose-invert prose-zinc max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
            Legal
          </p>
          <h1>Terms of Service</h1>
          <p className="text-sm text-zinc-500">Last updated: February 24, 2026</p>

          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the
            Rendr platform, website, API, and related services (collectively, the
            &quot;Service&quot;) operated by Rendr (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By creating
            an account or using the Service, you agree to be bound by these Terms. If
            you do not agree, do not use the Service.
          </p>

          <h2>1. The Service</h2>
          <p>
            Rendr is a cloud-based API platform that converts HTML content and URLs
            into PDF documents. The Service includes synchronous and asynchronous
            conversion endpoints, a template library, webhook delivery, and a
            web-based dashboard for managing your account.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            You must be at least 18 years old (or the age of majority in your
            jurisdiction) to use the Service. By registering, you represent that you
            have the legal capacity to enter into these Terms and that any
            information you provide is accurate and complete.
          </p>
          <p>
            If you are using the Service on behalf of an organization, you represent
            that you have authority to bind that organization to these Terms.
          </p>

          <h2>3. Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account
            credentials and API keys. You must notify us immediately if you suspect
            unauthorized access. We are not liable for losses arising from
            unauthorized use of your account.
          </p>
          <p>
            We reserve the right to suspend or terminate accounts that violate these
            Terms or remain inactive for an extended period.
          </p>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Generate documents containing illegal, harmful, or fraudulent content</li>
            <li>Distribute malware, phishing pages, or deceptive material</li>
            <li>Infringe on the intellectual property rights of others</li>
            <li>Reverse-engineer, decompile, or attempt to extract the source code of the Service</li>
            <li>Interfere with or disrupt the Service or its infrastructure</li>
            <li>Circumvent rate limits, usage quotas, or other technical restrictions</li>
            <li>Resell access to the Service without our written consent</li>
          </ul>
          <p>
            We may suspend or terminate your access if we reasonably believe you are
            in violation of this section.
          </p>

          <h2>5. Plans, Billing &amp; Payments</h2>
          <p>
            Rendr offers a free tier and paid subscription plans. Paid plans are
            billed on a monthly or annual basis. All fees are stated in US Dollars or
            Euros, depending on your region.
          </p>
          <p>
            Payments are processed securely through Stripe. By subscribing, you
            authorize us to charge your payment method on a recurring basis until you
            cancel. You may cancel at any time through your account settings or the
            Stripe Customer Portal — your access continues until the end of the
            current billing period.
          </p>
          <p>
            Fees are non-refundable except where required by applicable law. We
            reserve the right to change pricing with 30 days&apos; notice.
          </p>

          <h2>6. API Usage &amp; Rate Limits</h2>
          <p>
            Each plan includes a set number of PDF conversions per month and a
            per-minute rate limit. Exceeding your plan&apos;s limits may result in
            throttled requests (HTTP 429) until the next billing cycle or until you
            upgrade.
          </p>
          <p>
            We may adjust rate limits to maintain service quality. Persistent abuse
            of API resources may result in account suspension.
          </p>

          <h2>7. Your Content</h2>
          <p>
            You retain full ownership of the HTML, data, and templates you submit to
            the Service (&quot;Your Content&quot;). You grant us a limited, non-exclusive
            license to process Your Content solely for the purpose of delivering the
            Service.
          </p>
          <p>
            Generated PDF files are stored temporarily and delivered via signed,
            time-limited download URLs. We do not access, analyze, or share Your
            Content for any purpose other than providing the Service.
          </p>
          <p>
            You are solely responsible for ensuring Your Content does not violate any
            laws or third-party rights.
          </p>

          <h2>8. Intellectual Property</h2>
          <p>
            The Service, including its design, code, documentation, and branding, is
            owned by Rendr and protected by intellectual property laws. These Terms
            do not grant you any rights to our trademarks, logos, or other
            proprietary materials.
          </p>

          <h2>9. Privacy</h2>
          <p>
            Our collection and use of personal data is described in our{" "}
            <a href="/privacy">Privacy Policy</a>, which is incorporated into these
            Terms by reference. By using the Service you consent to our data
            practices as described therein.
          </p>

          <h2>10. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the
            fullest extent permitted by law, we disclaim all warranties — express,
            implied, or statutory — including warranties of merchantability, fitness
            for a particular purpose, and non-infringement.
          </p>
          <p>
            We do not guarantee that the Service will be uninterrupted, error-free,
            or free of harmful components.
          </p>

          <h2>11. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, our total liability for any
            claims arising from or related to the Service is limited to the amount
            you paid us in the 12 months preceding the claim. We are not liable for
            indirect, incidental, special, consequential, or punitive damages,
            including loss of profits, data, or business opportunities.
          </p>

          <h2>12. Indemnification</h2>
          <p>
            You agree to indemnify and hold us harmless from any claims, damages, or
            expenses (including reasonable legal fees) arising from your use of the
            Service, your violation of these Terms, or your infringement of any
            third-party rights.
          </p>

          <h2>13. Termination</h2>
          <p>
            Either party may terminate the relationship at any time. You can close
            your account through the dashboard or by contacting us. We may suspend or
            terminate your access immediately if you violate these Terms or engage in
            conduct that we reasonably consider harmful to the Service or other users.
          </p>
          <p>
            Upon termination, your right to use the Service ceases. Sections that by
            their nature should survive termination (including liability limitations,
            indemnification, and dispute resolution) will remain in effect.
          </p>

          <h2>14. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. If we make material changes,
            we will notify you via email or a notice on the dashboard at least 14
            days before the changes take effect. Continued use of the Service after
            the effective date constitutes acceptance of the updated Terms.
          </p>

          <h2>15. General</h2>
          <ul>
            <li>
              <strong>Governing law:</strong> These Terms are governed by the laws of
              the Netherlands, without regard to conflict of law principles.
            </li>
            <li>
              <strong>Severability:</strong> If any provision is found unenforceable,
              the remaining provisions continue in full force.
            </li>
            <li>
              <strong>Entire agreement:</strong> These Terms, together with the
              Privacy Policy, constitute the entire agreement between you and Rendr
              regarding the Service.
            </li>
            <li>
              <strong>Waiver:</strong> Failure to enforce any right or provision does
              not constitute a waiver of that right or provision.
            </li>
          </ul>

          <h2>16. Contact</h2>
          <p>
            If you have questions about these Terms, contact us at{" "}
            <a href="mailto:hello@rendrpdf.com">hello@rendrpdf.com</a>.
          </p>
        </div>
      </Container>
    </Section>
  );
}
