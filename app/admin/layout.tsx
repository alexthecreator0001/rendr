import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { SidebarProvider } from "@/components/providers/sidebar-provider";

export const metadata = {
  title: { default: "Admin", template: "%s | Rendr Admin" },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Double-check role from DB — middleware uses JWT (fast) but pages verify from DB (safe)
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [user, rendersThisMonth] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, email: true, plan: true },
    }),
    prisma.job.count({
      where: {
        userId: session.user.id,
        status: "succeeded",
        createdAt: { gte: monthStart },
      },
    }),
  ]);

  if (user?.role !== "admin") redirect("/app");

  const plan = user.plan ?? "starter";
  const PLAN_LIMITS: Record<string, number> = { starter: 100, growth: 1000, pro: 10000 };

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar
          user={{ email: user.email ?? "" }}
          usage={{ used: rendersThisMonth, limit: PLAN_LIMITS[plan] ?? 100 }}
          plan={plan}
          role="admin"
        />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <AppTopbar user={{ email: user.email ?? "" }} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
