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

  // h-full fills the overflow-y-auto main element (which has defined height from flex context)
  return (
    <div className="h-full overflow-hidden">
      <ConvertClient templates={templates} />
    </div>
  );
}
