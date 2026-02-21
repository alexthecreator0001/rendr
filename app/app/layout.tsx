import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppTopbar } from "@/components/layout/app-topbar";

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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar user={{ email: session.user.email ?? "" }} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppTopbar user={{ email: session.user.email ?? "" }} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
