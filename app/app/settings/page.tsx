import type { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { SettingsClient } from "./settings-client";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, createdAt: true },
  });

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <SettingsClient
        email={user?.email ?? ""}
        createdAt={user?.createdAt ?? new Date()}
      />
    </div>
  );
}
