import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app/", "/admin/", "/api/", "/invite/"],
      },
    ],
    sitemap: "https://rendrpdf.com/sitemap.xml",
  };
}
