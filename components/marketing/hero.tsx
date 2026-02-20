import Link from "next/link";
import { ArrowRight, BookOpen, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
      {/* Subtle gradient bg */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary/5 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Version pill */}
          <div className="mb-6 flex justify-center">
            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
              v1.0 — Now in beta
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold tracking-[-0.04em] text-foreground sm:text-6xl lg:text-7xl">
            Turn HTML into PDF.
            <br />
            <span className="text-primary">No fuss.</span>
          </h1>

          {/* Subline */}
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            Rendr converts your templates to production-ready PDFs via a simple API.
            No headless browser to manage, no infrastructure to babysit.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="gap-2 rounded-lg px-6">
              <Link href="/docs">
                <BookOpen className="h-4 w-4" />
                Read the docs
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 rounded-lg px-6">
              <Link href="/app">
                <LayoutDashboard className="h-4 w-4" />
                Open dashboard
              </Link>
            </Button>
          </div>

          {/* Secondary link */}
          <p className="mt-6 text-sm text-muted-foreground">
            Free tier available.{" "}
            <Link href="/pricing" className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors">
              See pricing <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
