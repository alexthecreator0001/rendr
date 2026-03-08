import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SOLUTIONS } from "@/lib/solutions-data";
import { CASE_STUDIES } from "@/lib/case-studies-data";

const BASE = "https://rendrpdf.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/features`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/pricing`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/sheets`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/solutions`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/case-studies`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/docs`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/docs/quick-start`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/docs/api`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/docs/integrations`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/docs/templates`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/register`, changeFrequency: "yearly", priority: 0.4 },
  ];

  // Solution pages
  const solutionPages: MetadataRoute.Sitemap = SOLUTIONS.map((s) => ({
    url: `${BASE}/solutions/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Case study pages
  const caseStudyPages: MetadataRoute.Sitemap = CASE_STUDIES.map((c) => ({
    url: `${BASE}/case-studies/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Blog posts from DB
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" },
    });
    blogPages = posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB unavailable during build — skip dynamic posts
  }

  return [...staticPages, ...solutionPages, ...caseStudyPages, ...blogPages];
}
