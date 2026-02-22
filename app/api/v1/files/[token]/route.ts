import { NextRequest, NextResponse } from "next/server"
import fs from "node:fs/promises"
import { prisma } from "@/lib/db"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  const job = await prisma.job.findUnique({
    where: { downloadToken: token },
  })

  if (!job || job.status !== "succeeded" || !job.resultPath) {
    return new NextResponse("Not found", { status: 404 })
  }

  try {
    const fileBuffer = await fs.readFile(job.resultPath)
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="rendr-${job.id}.pdf"`,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "private, max-age=3600",
      },
    })
  } catch {
    return new NextResponse("File not found on disk", { status: 404 })
  }
}
