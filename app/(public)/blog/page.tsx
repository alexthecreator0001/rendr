import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog",
};

const posts = [
  {
    title: "Why we built Rendr instead of using headless Chrome",
    date: "Feb 12, 2026",
    tag: "Engineering",
    excerpt:
      "The short version: we got tired of babysitting Puppeteer in production. Here's what we built instead.",
  },
  {
    title: "Rendering 10,000 invoices a day without breaking a sweat",
    date: "Jan 28, 2026",
    tag: "Case study",
    excerpt:
      "How Acme Internal automated their entire billing workflow using Rendr's async job queue.",
  },
  {
    title: "Custom fonts in PDFs: a surprisingly tricky problem",
    date: "Jan 14, 2026",
    tag: "Deep dive",
    excerpt:
      "Font subsetting, embedding, and why your Arial might not look like Arial in a PDF.",
  },
];

export default function BlogPage() {
  return (
    <Section size="lg">
      <Container>
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-[-0.03em]">Blog</h1>
          <p className="mt-3 text-muted-foreground">
            Engineering notes and product updates from the Rendr team.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.title}
              className="flex flex-col gap-4 sm:flex-row sm:gap-8 border-b border-border pb-8"
            >
              {/* Cover image placeholder */}
              {/* intended final asset: blog post cover illustration */}
              {/* suggested export format: PNG */}
              {/* exact size: 320×200, aspect: 8/5 */}
              <ImagePlaceholder
                label={`Blog cover: "${post.title}"`}
                width={320}
                height={200}
                aspect="8/5"
                rounded="xl"
                className="shrink-0 sm:w-64"
              />
              <div className="flex flex-col justify-center">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full text-xs">{post.tag}</Badge>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                <h2 className="mb-2 text-lg font-semibold leading-snug hover:text-primary cursor-pointer transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-dashed border-border py-10 text-center">
          <p className="text-sm text-muted-foreground">
            More posts coming soon. Subscribe via RSS or follow{" "}
            <span className="font-medium text-foreground">@rendrpdf</span> on X.
          </p>
        </div>
      </Container>
    </Section>
  );
}
