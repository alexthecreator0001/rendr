import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ConvertClient } from "./convert-client";

export const metadata = { title: "Convert" };

export default async function ConvertPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const templates = await prisma.template.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, html: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Convert</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Convert a URL, raw HTML, or a saved template to PDF.
        </p>
      </div>
      <ConvertClient templates={templates} />
    </div>
  );
}
