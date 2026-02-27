"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Script from "next/script";

const COOKIE_NAME = "cookie_consent";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year in seconds
const GTAG_ID = "AW-17977237081";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
}

const PENDING_CONVERSION_KEY = "rendr_pending_conversion";

/** Queue or immediately fire a Google Ads conversion event */
export function trackConversion() {
  const w = window as unknown as Record<string, unknown>;
  if (typeof w.gtag === "function") {
    (w.gtag as Function)("event", "conversion", {
      send_to: `${GTAG_ID}/zf6WCITqgv8bENm8m_xC`,
      value: 1.0,
      currency: "EUR",
    });
  } else {
    // gtag not loaded yet (no consent or script still loading) — queue it
    try { sessionStorage.setItem(PENDING_CONVERSION_KEY, "1"); } catch {}
  }
}

/** Flush any queued conversion — called once gtag is ready */
function flushPendingConversion() {
  try {
    if (sessionStorage.getItem(PENDING_CONVERSION_KEY)) {
      sessionStorage.removeItem(PENDING_CONVERSION_KEY);
      const w = window as unknown as Record<string, unknown>;
      if (typeof w.gtag === "function") {
        (w.gtag as Function)("event", "conversion", {
          send_to: `${GTAG_ID}/zf6WCITqgv8bENm8m_xC`,
          value: 1.0,
          currency: "EUR",
        });
      }
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
      // Small delay so it doesn't flash on page load
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = useCallback(() => {
    setCookie(COOKIE_NAME, "accepted", COOKIE_MAX_AGE);
    setConsent("accepted");
    setVisible(false);
  }, []);

  const decline = useCallback(() => {
    setCookie(COOKIE_NAME, "declined", COOKIE_MAX_AGE);
    setConsent("declined");
    setVisible(false);
  }, []);

  return (
    <>
      {/* Only load gtag after consent */}
      {consent === "accepted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            onReady={() => flushPendingConversion()}
          >
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GTAG_ID}');
            `}
          </Script>
        </>
      )}

      {/* Banner */}
      {visible && (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6">
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/[0.08] bg-zinc-950/95 px-5 py-4 shadow-2xl shadow-black/60 backdrop-blur-xl sm:flex sm:items-center sm:gap-5">
            <p className="text-sm text-zinc-400 sm:flex-1">
              We use cookies for analytics and ads to improve your experience.
              See our{" "}
              <Link
                href="/privacy"
                className="text-blue-400 underline underline-offset-2 hover:text-blue-300"
              >
                Privacy Policy
              </Link>.
            </p>
            <div className="mt-3 flex gap-2.5 sm:mt-0 sm:shrink-0">
              <button
                onClick={decline}
                className="rounded-lg border border-white/[0.08] bg-transparent px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-zinc-200"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
