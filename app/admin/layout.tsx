import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export const metadata = {
  title: { default: "Admin", template: "%s | Rendr Admin" },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Double-check role from DB — middleware uses JWT (fast) but pages verify from DB (safe)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, email: true },
  });

  if (user?.role !== "admin") redirect("/app");

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar email={user.email} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
