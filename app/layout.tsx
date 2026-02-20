import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Rendr — HTML to PDF API",
    template: "%s | Rendr",
  },
  description:
    "Rendr converts HTML templates to production-ready PDFs via a simple API. No headless browser to manage.",
  keywords: ["pdf", "html to pdf", "api", "templates", "rendering"],
  openGraph: {
    title: "Rendr — HTML to PDF API",
    description:
      "Convert HTML templates to production PDFs via a simple API.",
    siteName: "Rendr",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
