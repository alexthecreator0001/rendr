import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const BASE_URL = () =>
  process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });

  if (!job || job.userId !== session.user.id) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({
    status: job.status,
    downloadUrl: job.downloadToken
      ? `${BASE_URL()}/api/v1/files/${job.downloadToken}`
      : null,
    errorMessage: job.errorMessage ?? null,
  });
}
