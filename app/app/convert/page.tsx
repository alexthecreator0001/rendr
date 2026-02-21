import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ConvertClient } from "./convert-client";

export const metadata = { title: "Studio" };

export default async function ConvertPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const templates = await prisma.template.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, html: true },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Studio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Render URLs, HTML, and templates to high-quality PDFs with full control over every option.
        </p>
      </div>
      <ConvertClient templates={templates} />
    </div>
  );
}
