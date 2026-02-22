import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      slug: true,
      title: true,
      excerpt: true,
      tag: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  const formatDate = (date: Date | null) =>
    (date ?? new Date()).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <Section size="lg">
      <Container>
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-[-0.03em]">Blog</h1>
          <p className="mt-3 text-muted-foreground">
            Engineering notes and product updates from the Rendr team.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/50">
              <FileText className="h-8 w-8 text-muted-foreground/25" />
            </div>
            <p className="font-semibold text-sm">No posts yet</p>
            <p className="mt-1.5 max-w-[260px] text-xs text-muted-foreground">
              Check back soon — articles are on the way.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="flex flex-col gap-4 sm:flex-row sm:gap-8 border-b border-border pb-8"
              >
                {/* Tag + date row */}
                <div className="flex flex-col justify-center sm:flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline" className="rounded-full text-xs">
                      {post.tag}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="mb-2 text-lg font-semibold leading-snug hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-2 text-xs text-primary hover:underline"
                  >
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

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
