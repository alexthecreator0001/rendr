import { NextRequest } from "next/server"
import { requireApiKey } from "@/lib/require-api-key"
import { prisma } from "@/lib/db"
import { apiError, ApiError } from "@/lib/errors"

const BASE_URL = () => process.env.NEXTAUTH_URL ?? "http://localhost:3000"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireApiKey(req)
    const { id } = await params

    const job = await prisma.job.findUnique({ where: { id } })

    if (!job || job.userId !== user.id) {
      return apiError(404, "Job not found", "not_found")
    }

    return Response.json({
      job_id: job.id,
      status: job.status,
      input_type: job.inputType,
      pdf_url: job.downloadToken
        ? `${BASE_URL()}/api/v1/files/${job.downloadToken}`
        : null,
      status_url: `${BASE_URL()}/api/v1/jobs/${job.id}`,
      error:
        job.status === "failed"
          ? { code: job.errorCode, message: job.errorMessage }
          : null,
      created_at: job.createdAt,
      updated_at: job.updatedAt,
    })
  } catch (e) {
    if (e instanceof ApiError) return apiError(e.status, e.message, e.code)
    return apiError(500, "Internal server error", "internal_error")
  }
}
