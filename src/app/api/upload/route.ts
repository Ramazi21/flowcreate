import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { auth } from "@/auth";
import { extensionForKind, sniffImageKind } from "@/lib/upload-image";

/** Максимальный размер одного файла (совпадает с подсказкой в админке). */
export const maxSizeBytes = 8 * 1024 * 1024;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN") return Response.json({ error: "Forbidden" }, { status: 403 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "Не удалось прочитать файл. Проверьте размер (до 8 МБ) и формат (JPEG, PNG, WebP)." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "File is required" }, { status: 400 });
  }

  if (file.size > maxSizeBytes) {
    return Response.json({ error: "Файл слишком большой (максимум 8 МБ)" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const kind = sniffImageKind(buffer);
  if (!kind) {
    return Response.json(
      { error: "Недопустимый формат. Разрешены только изображения JPEG, PNG и WebP." },
      { status: 400 },
    );
  }

  const ext = extensionForKind(kind);
  const fileName = `${Date.now()}-${randomUUID()}.${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  try {
    await mkdir(uploadsDir, { recursive: true });
    const destination = path.join(uploadsDir, fileName);
    await writeFile(destination, buffer);
  } catch (e) {
    const code = e && typeof e === "object" && "code" in e ? String((e as NodeJS.ErrnoException).code) : "";
    if (code === "EACCES" || code === "EPERM") {
      return Response.json(
        {
          error:
            "Нет прав на запись в каталог загрузок (public/uploads). На сервере проверьте владельца каталога public для пользователя приложения.",
        },
        { status: 500 },
      );
    }
    console.error("upload write error", e);
    return Response.json({ error: "Не удалось сохранить файл на сервере" }, { status: 500 });
  }

  return Response.json({ url: `/uploads/${fileName}` }, { status: 201 });
}
