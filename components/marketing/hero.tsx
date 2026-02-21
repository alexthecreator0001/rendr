"use client";
import Link from "next/link";
import { ArrowRight, BookOpen, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const snippets = {
  node: `import { Rendr } from "@rendr/sdk";

const rendr = new Rendr("rk_live_••••••••");

const job = await rendr.convert({
  template: "invoice-pro",
  variables: {
    client: "Acme Corp",
    amount: "$4,200.00",
    due:    "Mar 15, 2026",
  },
});

console.log(job.download_url);
// → https://cdn.rendrpdf.com/files/job_7f3k2m…`,

  curl: `curl https://api.rendrpdf.com/v1/convert \\
  -H "Authorization: Bearer rk_live_••••••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "template": "invoice-pro",
    "variables": {
      "client": "Acme Corp",
      "amount": "$4,200.00",
      "due":    "Mar 15, 2026"
    }
  }'`,

  python: `from rendr import Rendr

rendr = Rendr("rk_live_••••••••")

job = rendr.convert(
    template="invoice-pro",
    variables={
        "client": "Acme Corp",
        "amount": "$4,200.00",
        "due":    "Mar 15, 2026",
    },
)

print(job.download_url)
# → https://cdn.rendrpdf.com/files/job_7f3k2m…`,

  php: `$rendr = new \\Rendr\\Client("rk_live_••••••••");

$job = $rendr->convert([
    "template"  => "invoice-pro",
    "variables" => [
        "client" => "Acme Corp",
        "amount" => "$4,200.00",
        "due"    => "Mar 15, 2026",
    ],
]);

echo $job->download_url;
// → https://cdn.rendrpdf.com/files/job_7f3k2m…`,
};

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-zinc-950">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float animate-pulse-glow absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto w-full max-w-4xl px-6 py-28 lg:px-8 lg:py-0">
          {/* Eyebrow */}
          <div className="animate-fade-up mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/50 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Beta · 500 free renders/month
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* Headline — centered */}
          <h1 className="animate-fade-up delay-100 text-center font-heading text-[3rem] font-extrabold leading-[0.9] tracking-[-0.045em] text-white sm:text-[4rem] lg:text-[5.25rem]">
            HTML to PDF,
            <br />
            <span
              style={{
                background: "linear-gradient(115deg, #60a5fa 5%, #22d3ee 75%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              without the mess.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-up delay-200 mx-auto mt-7 max-w-xl text-center text-base leading-[1.75] text-zinc-400 sm:text-lg">
            One API call. Pixel-perfect PDFs. Async jobs, webhooks, signed URLs
            — no headless browser to babysit.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300 mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              asChild
              className="h-11 rounded-xl bg-white px-7 text-sm font-semibold text-zinc-900 shadow-md transition-all duration-200 hover:bg-zinc-100 hover:shadow-lg gap-2"
            >
              <Link href="/register">
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              asChild
              className="h-11 rounded-xl px-6 text-sm text-white/50 transition-all duration-200 hover:bg-white/[0.06] hover:text-white gap-2"
            >
              <Link href="/docs">
                <BookOpen className="h-4 w-4" />
                Read the docs
              </Link>
            </Button>
          </div>

          {/* Install command */}
          <div className="animate-fade-up delay-300 mt-10 flex justify-center">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-zinc-900/60 px-4 py-2.5 backdrop-blur-sm">
              <Terminal className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
              <span className="font-mono text-sm text-zinc-400">
                npm install{" "}
                <span className="text-white">@rendr/sdk</span>
              </span>
            </div>
          </div>

          {/* Code block with language tabs */}
          <div className="animate-fade-up delay-400 mt-5">
            <Tabs defaultValue="node">
              <TabsList className="mb-0 w-full justify-start gap-0.5 rounded-t-xl rounded-b-none border border-b-0 border-white/[0.07] bg-zinc-900/80 px-3 pt-2.5 pb-0 backdrop-blur-sm">
                <TabsTrigger
                  value="node"
                  className="rounded-t-md rounded-b-none border-b-2 border-transparent px-3.5 py-2 font-mono text-xs text-zinc-500 data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
                >
                  Node.js
                </TabsTrigger>
                <TabsTrigger
                  value="curl"
                  className="rounded-t-md rounded-b-none border-b-2 border-transparent px-3.5 py-2 font-mono text-xs text-zinc-500 data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
                >
                  cURL
                </TabsTrigger>
                <TabsTrigger
                  value="python"
                  className="rounded-t-md rounded-b-none border-b-2 border-transparent px-3.5 py-2 font-mono text-xs text-zinc-500 data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
                >
                  Python
                </TabsTrigger>
                <TabsTrigger
                  value="php"
                  className="rounded-t-md rounded-b-none border-b-2 border-transparent px-3.5 py-2 font-mono text-xs text-zinc-500 data-[state=active]:border-blue-400 data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:shadow-none"
                >
                  PHP
                </TabsTrigger>
              </TabsList>

              {(["node", "curl", "python", "php"] as const).map((lang) => (
                <TabsContent key={lang} value={lang} className="mt-0">
                  <div className="overflow-hidden rounded-b-xl border border-t-0 border-white/[0.07] bg-zinc-950/80 backdrop-blur-sm">
                    <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-[1.9] text-zinc-300">
                      <code>{snippets[lang]}</code>
                    </pre>
                    <div className="flex items-center gap-2 border-t border-white/[0.05] bg-white/[0.02] px-5 py-2.5">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      <span className="font-mono text-[11px] text-zinc-500">
                        Returns a signed download URL in ~800ms
                      </span>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <p className="animate-fade-up delay-500 mt-6 text-center text-[11px] tracking-[0.025em] text-zinc-600">
            No credit card required · Free tier forever · Set up in 5 minutes
          </p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent" />
    </section>
  );
}
