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

  // Break out of the layout's px-6 py-8 padding so Studio fills the viewport
  return (
    <div className="-mx-6 -my-8" style={{ height: "calc(100dvh - 56px)" }}>
      <ConvertClient templates={templates} />
    </div>
  );
}
