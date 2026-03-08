import { NextRequest, NextResponse } from "next/server"
import fs from "node:fs/promises"
import path from "node:path"
import { prisma } from "@/lib/db"

const BASE_DIR = process.env.STORAGE_LOCAL_DIR ?? "/data"
const PDF_DIR = path.resolve(path.join(BASE_DIR, "pdfs"))

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

  // Path traversal guard: ensure resultPath is inside the PDF storage directory
  const resolvedPath = path.resolve(job.resultPath)
  if (!resolvedPath.startsWith(PDF_DIR + path.sep) && resolvedPath !== PDF_DIR) {
    return new NextResponse("Not found", { status: 404 })
  }

  // F2: custom filename from optionsJson
  const opts = (job.optionsJson as Record<string, unknown>) ?? {}
  let downloadFilename = `rendr-${job.id}.pdf`
  if (typeof opts.filename === "string" && opts.filename.length > 0) {
    // Ensure .pdf extension
    downloadFilename = opts.filename.endsWith(".pdf") ? opts.filename : `${opts.filename}.pdf`
  }

  // Sanitize filename: strip control chars, quotes, backslashes to prevent header injection
  const safeFilename = downloadFilename
    .replace(/[\x00-\x1f\x7f"\\]/g, "")
    .slice(0, 255) || `rendr-${job.id}.pdf`
  // RFC 5987 encoded filename for non-ASCII support
  const encodedFilename = encodeURIComponent(safeFilename)

  try {
    const fileBuffer = await fs.readFile(resolvedPath)
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${safeFilename}"; filename*=UTF-8''${encodedFilename}`,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "private, max-age=3600",
      },
    })
  } catch {
    return new NextResponse("File not found on disk", { status: 404 })
  }
}
