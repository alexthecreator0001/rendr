import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { getPlanRenderLimit } from "@/lib/plans";

export const metadata = {
  title: {
    default: "Dashboard",
    template: "%s | Rendr Dashboard",
  },
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [rendersThisMonth, user, teamMemberships] = await Promise.all([
    prisma.job.count({
      where: {
        userId: session.user.id,
        status: "succeeded",
        createdAt: { gte: monthStart },
      },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, role: true, emailVerified: true },
    }),
    prisma.teamMember.findMany({
      where: { userId: session.user.id },
      select: { team: { select: { id: true, name: true } } },
      orderBy: { joinedAt: "asc" },
    }),
  ]);

  // DB-checked verification guard — cannot be bypassed via JWT
  if (!user?.emailVerified && process.env.RESEND_API_KEY) {
    redirect("/verify-email");
  }

  const plan = user?.plan ?? "starter";
  const role = user?.role ?? "user";
  const teams = teamMemberships.map((m) => m.team);

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar
          user={{ email: session.user.email ?? "" }}
          usage={{ used: rendersThisMonth, limit: getPlanRenderLimit(plan) }}
          plan={plan}
          role={role}
          teams={teams}
        />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <AppTopbar user={{ email: session.user.email ?? "" }} />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
