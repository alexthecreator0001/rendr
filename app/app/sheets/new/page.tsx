import type { Metadata } from "next"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"
import { isSheetsEnabled } from "@/lib/plans"
import { NewSyncWizard } from "./wizard-client"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "New Sheet Sync" }

export default async function NewSheetSyncPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  })
  if (!user || !isSheetsEnabled(user.plan)) redirect("/app/sheets")

  const connections = await prisma.googleConnection.findMany({
    where: { userId: session.user.id, revokedAt: null },
    select: { id: true, email: true },
    orderBy: { connectedAt: "desc" },
  })
  if (connections.length === 0) redirect("/app/sheets")

  const templates = await prisma.template.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
  if (templates.length === 0) redirect("/app/sheets")

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <NewSyncWizard connections={connections} templates={templates} />
    </div>
  )
}
