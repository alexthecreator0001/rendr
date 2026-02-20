import { Separator } from "@/components/ui/separator";

const steps = [
  {
    number: "01",
    title: "Send your template",
    description:
      "POST your HTML string or a stored template ID to the /render endpoint. Pass any variables as JSON.",
  },
  {
    number: "02",
    title: "We render it",
    description:
      "Rendr queues the job, runs it through a managed rendering pipeline, and applies your fonts and styles.",
  },
  {
    number: "03",
    title: "Get your PDF",
    description:
      "Receive a signed URL in the webhook payload — or poll the job endpoint. Download directly from storage.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-28 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            Three steps. That&apos;s it.
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          {steps.map((step, i) => (
            <div key={step.number}>
              <div className="flex gap-6 py-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-sm font-semibold text-muted-foreground">
                  {step.number}
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              {i < steps.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
