import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-10 text-center shadow-sm sm:p-14">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Start with a free key.
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
            No credit card. 500 renders/month on the free tier — enough to build
            something real and see if Rendr fits your stack.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="gap-2 rounded-lg px-7">
              <Link href="/register">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/docs/quick-start">View quick start</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
