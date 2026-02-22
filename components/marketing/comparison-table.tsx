import { Check, X, Minus } from "lucide-react";

type CellValue = "yes" | "no" | "partial" | string;

const rows: { feature: string; rendr: CellValue; puppeteer: CellValue; wkhtmltopdf: CellValue; prince: CellValue }[] = [
  { feature: "Setup time",         rendr: "5 min",     puppeteer: "1–3 days",    wkhtmltopdf: "2–4 hrs",  prince: "4+ hrs"     },
  { feature: "Managed infra",      rendr: "yes",        puppeteer: "no",          wkhtmltopdf: "no",        prince: "no"          },
  { feature: "Async job queue",    rendr: "yes",        puppeteer: "Build it",    wkhtmltopdf: "no",        prince: "no"          },
  { feature: "Webhooks",           rendr: "yes",        puppeteer: "Build it",    wkhtmltopdf: "no",        prince: "no"          },
  { feature: "Full CSS + JS",      rendr: "yes",        puppeteer: "yes",         wkhtmltopdf: "partial",   prince: "partial"     },
  { feature: "Custom fonts",       rendr: "yes",        puppeteer: "Manual",      wkhtmltopdf: "partial",   prince: "yes"         },
  { feature: "Dashboard & logs",   rendr: "yes",        puppeteer: "no",          wkhtmltopdf: "no",        prince: "no"          },
  { feature: "Pricing",            rendr: "Free tier",  puppeteer: "Server cost", wkhtmltopdf: "Free",      prince: "$$$$"        },
];

function Cell({ value, highlight }: { value: CellValue; highlight?: boolean }) {
  const base = highlight ? "text-white font-semibold" : "text-zinc-500";
  if (value === "yes") return (
    <span className={`inline-flex items-center justify-center ${highlight ? "" : ""}`}>
      <Check className="h-4 w-4 text-emerald-400" />
    </span>
  );
  if (value === "no") return (
    <span className="inline-flex items-center justify-center">
      <X className="h-4 w-4 text-zinc-700" />
    </span>
  );
  if (value === "partial") return (
    <span className="inline-flex items-center justify-center">
      <Minus className="h-4 w-4 text-amber-500/70" />
    </span>
  );
  return <span className={`text-sm ${base}`}>{value}</span>;
}

export function ComparisonTable() {
  return (
    <section className="border-t border-white/[0.06] bg-zinc-950 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.15em] text-blue-400">
            Why Rendr
          </p>
          <h2 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
            Stop duct-taping
            <br />
            <span className="text-zinc-500">a rendering pipeline.</span>
          </h2>
          <p className="mt-5 text-base text-zinc-400">
            Every alternative either means running your own Chromium, patching missing primitives, or paying thousands per month.
          </p>
        </div>

        {/* Table — scrollable on mobile */}
        <div className="overflow-x-auto rounded-2xl border border-white/[0.07]">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07]">
                <th className="py-4 pl-6 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Feature
                </th>
                <th className="bg-blue-600/[0.06] py-4 px-4 text-center text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-500/20">
                  Rendr
                </th>
                <th className="py-4 px-4 text-center text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  DIY Puppeteer
                </th>
                <th className="py-4 px-4 text-center text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  wkhtmltopdf
                </th>
                <th className="py-4 px-4 pr-6 text-center text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Prince XML
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {rows.map((row) => (
                <tr key={row.feature} className="group transition-colors hover:bg-white/[0.02]">
                  <td className="py-3.5 pl-6 pr-4 text-sm text-zinc-400">{row.feature}</td>
                  <td className="bg-blue-600/[0.04] py-3.5 px-4 text-center ring-1 ring-inset ring-blue-500/10">
                    <Cell value={row.rendr} highlight />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Cell value={row.puppeteer} />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Cell value={row.wkhtmltopdf} />
                  </td>
                  <td className="py-3.5 px-4 pr-6 text-center">
                    <Cell value={row.prince} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
