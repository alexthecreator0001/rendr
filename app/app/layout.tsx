import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";
import { SidebarProvider } from "@/components/providers/sidebar-provider";

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

  const [rendersThisMonth, user] = await Promise.all([
    prisma.job.count({
      where: {
        userId: session.user.id,
        status: "succeeded",
        createdAt: { gte: monthStart },
      },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    }),
  ]);

  const plan = user?.plan ?? "starter";

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <AppSidebar
          user={{ email: session.user.email ?? "" }}
          usage={{ used: rendersThisMonth, limit: 100 }}
          plan={plan}
        />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <AppTopbar user={{ email: session.user.email ?? "" }} />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
