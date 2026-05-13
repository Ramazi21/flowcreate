import { db } from "@/lib/db";
import { works } from "@/lib/mock-data";
import { ProductStatus } from "@prisma/client";

export type ProductView = {
  id: string;
  title: string;
  subtitle: string;
  /** отформатированная цена для отображения */
  price: string;
  /** цена в рублях (целое число) для расчётов и корзины */
  priceRub: number;
  imageUrl: string;
  slug: string;
  category: string;
  stock: number;
  status: ProductStatus;
};

function formatPrice(price: number) {
  return `${price.toLocaleString("ru-RU")} ₽`;
}

/** из строки вида «25.000 ₽» извлекает целое число рублей */
function priceStringToRub(display: string): number {
  const digits = display.replace(/\D/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10);
}

export async function listProducts(): Promise<ProductView[]> {
  try {
    const products = await db.product.findMany({
      where: { status: ProductStatus.APPROVED },
      orderBy: { createdAt: "desc" },
    });

    if (!products.length) return [];

    return products.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.description,
      price: formatPrice(item.price),
      priceRub: item.price,
      imageUrl: item.imageUrl,
      slug: item.slug,
      category: item.category,
      stock: item.stock,
      status: item.status,
    }));
  } catch {
    return works.map((item) => ({
      id: item.id,
      title: item.name,
      subtitle: item.subtitle,
      price: item.price,
      priceRub: priceStringToRub(item.price),
      imageUrl: item.imageUrl,
      slug: item.id,
      category: "decor",
      stock: 10,
      status: ProductStatus.APPROVED,
    }));
  }
}
