import { z } from "zod";
import { ProductStatus } from "@prisma/client";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const imageUrlSchema = z
  .string()
  .min(2)
  .refine((value) => value.startsWith("/uploads/") || z.string().url().safeParse(value).success, {
    message: "Image URL must be absolute URL or /uploads path",
  });

const updateProductSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  price: z.coerce.number().int().nonnegative().optional(),
  imageUrl: imageUrlSchema.optional(),
  description: z.string().min(2).optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  category: z.string().min(2).optional(),
  status: z.nativeEnum(ProductStatus).optional(),
});

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { ok: false as const, response: Response.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.role !== "ADMIN") {
    return { ok: false as const, response: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ok: true as const };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = updateProductSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = { ...parsed.data };
  if (data.slug) {
    data.slug = normalizeSlug(data.slug);
  }

  try {
    const updated = await db.product.update({
      where: { id },
      data,
    });
    return Response.json(updated);
  } catch {
    return Response.json({ error: "Product not found or slug conflict" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { id } = await params;
  try {
    await db.product.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }
}
