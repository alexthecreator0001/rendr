import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { auth } from "@/auth";

const EXT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  // Require authentication to access uploaded files
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await params;
  // Prevent path traversal — basename only
  const safe = path.basename(filename);
  const filePath = path.join(process.env.STORAGE_LOCAL_DIR ?? "/data", "uploads", safe);

  try {
    const buf = await readFile(filePath);
    const ext = safe.split(".").pop()?.toLowerCase() ?? "jpg";
    const contentType = EXT_TYPES[ext] ?? "application/octet-stream";

    return new NextResponse(buf, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
