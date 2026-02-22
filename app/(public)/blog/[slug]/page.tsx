"use server";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { CopyPromptButton } from "./copy-prompt-button";

export const dynamic = "force-dynamic";

// ── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { title: true, excerpt: true },
  });
  if (!post) return { title: "Blog | Rendr" };
  return {
    title: `${post.title} | Rendr Blog`,
    description: post.excerpt,
  };
}

// ── Simple markdown → JSX renderer ───────────────────────────────────────────

function inlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="font-mono text-sm bg-muted px-1.5 py-0.5 rounded">
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      })}
    </>
  );
}

function BlogContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={`code-${i}`}
          className="rounded-xl border border-border bg-muted/50 p-4 font-mono text-xs overflow-x-auto my-4"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      i++;
      continue;
    }

    // H1
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-3xl font-bold tracking-tight mt-10 mb-4">
          {line.slice(2)}
        </h1>
      );
      i++;
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-2xl font-bold tracking-tight mt-8 mb-4">
          {line.slice(3)}
        </h2>
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-lg font-semibold mt-6 mb-3">
          {line.slice(4)}
        </h3>
      );
      i++;
      continue;
    }

    // Unordered list
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-4 space-y-1.5 list-disc pl-5">
          {items.map((item, j) => (
            <li key={j} className="text-[15px] leading-relaxed">
              {inlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-4 space-y-1.5 list-decimal pl-5">
          {items.map((item, j) => (
            <li key={j} className="text-[15px] leading-relaxed">
              {inlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Horizontal rule
    if (line === "---" || line === "***") {
      elements.push(<hr key={`hr-${i}`} className="my-6 border-border" />);
      i++;
      continue;
    }

    // Blank line (paragraph break)
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Regular paragraph — group consecutive non-special lines
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("- ") &&
      !lines[i].startsWith("* ") &&
      !/^\d+\. /.test(lines[i]) &&
      lines[i] !== "---" &&
      lines[i] !== "***"
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }
    if (paragraphLines.length > 0) {
      elements.push(
        <p key={`p-${i}`} className="my-4 text-[15px] leading-relaxed">
          {inlineMarkdown(paragraphLines.join(" "))}
        </p>
      );
    }
  }

  return <div>{elements}</div>;
}

// ── Hardcoded ChatGPT prompt (for the AI template guide post) ─────────────────

const CHATGPT_PROMPT = `You are an expert HTML/CSS developer specializing in print-ready PDF documents. Create a professional HTML template for the following document type: [DOCUMENT TYPE — e.g. "invoice", "receipt", "certificate of completion"].

Requirements:
- Use only inline CSS (no external stylesheets, no Google Fonts, no CDN links)
- Use a web-safe font stack: font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif
- Use {{double_curly_brace}} placeholders for all dynamic values (e.g. {{client_name}}, {{invoice_date}}, {{total}})
- Make it A4 sized: max-width 794px, with padding 48px
- Use a clean, professional design with subtle borders and a clear visual hierarchy
- Include a complete list of all {{variable}} names used at the bottom as an HTML comment: <!-- Variables: var1, var2, var3 -->
- Do NOT use JavaScript, images from external URLs, or any external resources
- The HTML must be fully self-contained in a single file
- Test mentally that every {{variable}} has a clear, predictable meaning

Output only the raw HTML — no markdown code fences, no explanation. Start with <!DOCTYPE html>.`;

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  const formatDate = (date: Date | null) =>
    (date ?? new Date()).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const isAiGuide = slug === "how-to-create-templates";

  return (
    <Section size="lg">
      <Container className="max-w-3xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Badge variant="outline" className="rounded-full text-xs">
              {post.tag}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(post.publishedAt ?? post.createdAt)}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-[-0.03em] leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Body */}
        <div className="text-[15px] leading-relaxed">
          <BlogContent content={post.content} />

          {/* For the AI guide post, show the interactive ChatGPT prompt box */}
          {isAiGuide && (
            <div className="my-8 rounded-xl border border-border bg-zinc-950 dark:bg-zinc-900 text-green-400 p-5 font-mono text-xs leading-relaxed overflow-x-auto relative">
              <pre className="whitespace-pre-wrap">{CHATGPT_PROMPT}</pre>
              <CopyPromptButton prompt={CHATGPT_PROMPT} />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
