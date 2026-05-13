import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { auth } from "@/auth";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxSizeBytes = 5 * 1024 * 1024;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN") return Response.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "File is required" }, { status: 400 });
  }
  if (!allowedTypes.has(file.type)) {
    return Response.json({ error: "Unsupported file type" }, { status: 400 });
  }
  if (file.size > maxSizeBytes) {
    return Response.json({ error: "File is too large (max 5 MB)" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1] || "bin";
  const fileName = `${Date.now()}-${randomUUID()}.${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const destination = path.join(uploadsDir, fileName);
  await writeFile(destination, buffer);

  return Response.json({ url: `/uploads/${fileName}` }, { status: 201 });
}
