"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Script from "next/script";
import { Shield, BarChart3 } from "lucide-react";

const COOKIE_NAME = "cookie_consent";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds
const GTAG_ADS_ID = "AW-17977237081";
const GTAG_GA4_ID = "G-W4087CZ887";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
}

/** Helper to call gtag safely */
function gtagCall(...args: unknown[]) {
  const w = window as unknown as Record<string, unknown>;
  if (typeof w.gtag === "function") {
    (w.gtag as Function)(...args);
  }
}

/** Update Google Consent Mode signals */
function updateConsent(granted: boolean) {
  const value = granted ? "granted" : "denied";
  gtagCall("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
}

const PENDING_CONVERSION_KEY = "rendr_pending_conversion";

/** Check whether cookie consent has been granted */
function hasConsent(): boolean {
  return getCookie(COOKIE_NAME) === "accepted";
}

/** Fire the conversion event via gtag (only call when consent is granted + gtag loaded) */
function fireConversion() {
  gtagCall("event", "conversion", {
    send_to: `${GTAG_ADS_ID}/wqRTCPHjv_8bENm8m_xC`,
    value: 1.0,
    currency: "EUR",
  });
}

/** Queue or immediately fire a Google Ads conversion event */
export function trackConversion() {
  const w = window as unknown as Record<string, unknown>;
  const gtagReady = typeof w.gtag === "function";

  // Only fire immediately if gtag is loaded AND consent is already granted.
  // Otherwise queue — the conversion will flush when consent is accepted or
  // on next page load when consent cookie already exists.
  if (gtagReady && hasConsent()) {
    fireConversion();
  } else {
    try { sessionStorage.setItem(PENDING_CONVERSION_KEY, "1"); } catch {}
  }
}

/** Flush any queued conversion — called on gtag init AND when consent is accepted */
function flushPendingConversion() {
  try {
    if (sessionStorage.getItem(PENDING_CONVERSION_KEY) && hasConsent()) {
      sessionStorage.removeItem(PENDING_CONVERSION_KEY);
      fireConversion();
    }
  } catch {}
}

export function CookieBanner() {
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getCookie(COOKIE_NAME);
    if (stored === "accepted" || stored === "declined") {
      setConsent(stored);
    } else {
      const t = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  // When consent state is known (from cookie), update Google Consent Mode
  useEffect(() => {
    if (consent === "accepted") {
      updateConsent(true);
    }
    // "denied" is already the default — no update needed
  }, [consent]);

  const accept = useCallback(() => {
    setCookie(COOKIE_NAME, "accepted", COOKIE_MAX_AGE);
    setConsent("accepted");
    setVisible(false);
    updateConsent(true);
    // Flush any conversion that fired before consent was granted
    flushPendingConversion();
  }, []);

  const decline = useCallback(() => {
    setCookie(COOKIE_NAME, "declined", COOKIE_MAX_AGE);
    setConsent("declined");
    setVisible(false);
  }, []);

  return (
    <>
      {/*
        Google Consent Mode v2: gtag.js always loads, but consent defaults
        to denied. Signals are updated to "granted" only after user accepts.
        This enables cookieless pings and modeling even without consent.
      */}
      <Script
        id="gtag-consent-defaults"
        strategy="beforeInteractive"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'wait_for_update': 500
          });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        onReady={() => flushPendingConversion()}
      >
        {`
          window.dataLayer = window.dataLayer || [];
          if(!window.gtag){function gtag(){dataLayer.push(arguments);}window.gtag=gtag;}
          gtag('js', new Date());
          gtag('config', '${GTAG_GA4_ID}');
          gtag('config', '${GTAG_ADS_ID}');
        `}
      </Script>

      {/* Full-screen overlay consent wall */}
      {visible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-zinc-950 shadow-2xl shadow-black/80">
            {/* Header */}
            <div className="border-b border-white/[0.06] px-6 pt-7 pb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Your privacy matters</h2>
              </div>
              <p className="text-sm leading-relaxed text-zinc-400">
                We use cookies to understand how you use Rendr and to show relevant ads.
                You can accept or decline — either way, the app works the same.
              </p>
            </div>

            {/* What we use */}
            <div className="px-6 py-5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
                  <BarChart3 className="h-3.5 w-3.5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">Analytics &amp; Ads</p>
                  <p className="text-xs text-zinc-500">Google Analytics &amp; Ads conversion tracking to measure site usage and campaign performance.</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-white/[0.06] px-6 py-5">
              <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                <button
                  onClick={decline}
                  className="rounded-xl border border-white/[0.08] bg-transparent px-5 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-200"
                >
                  Decline all
                </button>
                <button
                  onClick={accept}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200"
                >
                  Accept all
                </button>
              </div>
              <p className="mt-3 text-center text-[11px] text-zinc-600">
                Read our{" "}
                <Link
                  href="/privacy"
                  className="text-zinc-500 underline underline-offset-2 hover:text-zinc-400"
                >
                  Privacy Policy
                </Link>{" "}
                for full details.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
