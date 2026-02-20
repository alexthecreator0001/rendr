import path from "node:path"
import fs from "node:fs/promises"

const BASE_DIR = process.env.STORAGE_LOCAL_DIR ?? "/data"
const PDF_DIR = path.join(BASE_DIR, "pdfs")

async function ensureDir(): Promise<void> {
  await fs.mkdir(PDF_DIR, { recursive: true })
}

/**
 * Save a PDF buffer to disk.
 * Returns the absolute path where the file was saved.
 */
export async function saveFile(
  jobId: string,
  buf: Buffer
): Promise<{ path: string }> {
  await ensureDir()
  const filePath = path.join(PDF_DIR, `${jobId}.pdf`)
  await fs.writeFile(filePath, buf)
  return { path: filePath }
}

/**
 * Get the expected file path for a job's PDF.
 */
export function getFilePath(jobId: string): string {
  return path.join(PDF_DIR, `${jobId}.pdf`)
}

/**
 * Check if a PDF file exists for a given job.
 */
export async function fileExists(jobId: string): Promise<boolean> {
  try {
    await fs.access(getFilePath(jobId))
    return true
  } catch {
    return false
  }
}
