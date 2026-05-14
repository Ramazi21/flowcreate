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

const createProductSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  price: z.coerce.number().int().nonnegative(),
  imageUrl: imageUrlSchema,
  description: z.string().min(2),
  stock: z.coerce.number().int().nonnegative(),
  category: z.string().min(2),
  status: z.nativeEnum(ProductStatus).optional(),
});

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  const session = await auth();
  const where =
    session?.user?.role === "ADMIN"
      ? undefined
      : {
          status: ProductStatus.APPROVED,
        };

  const products = await db.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return Response.json(products);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = createProductSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const slug = normalizeSlug(parsed.data.slug || parsed.data.title);

  const existing = await db.product.findUnique({ where: { slug } });
  if (existing) {
    return Response.json({ error: "Slug already exists" }, { status: 409 });
  }

  const product = await db.product.create({
    data: {
      ...parsed.data,
      slug,
      status: parsed.data.status ?? ProductStatus.PENDING,
    },
  });

  return Response.json(product, { status: 201 });
}
