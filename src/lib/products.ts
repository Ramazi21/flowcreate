import { db } from "@/lib/db";
import { works, authors } from "@/lib/mock-data";
import { ProductStatus, ProductType } from "@prisma/client";

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
  type: ProductType;
  stock: number;
  status: ProductStatus;
  authorId?: string;
  author?: { id: string; name?: string; image?: string };
  description?: string;
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

function getCategory(name: string, subtitle?: string): string {
  const n = (name + " " + (subtitle || "")).toLowerCase();
  if (n.includes("рисунок") || n.includes("рисунки")) return "risunki";
  if (n.includes("декор")) return "decor";
  if (n.includes("картина") || n.includes("панно") || n.includes("скульптура") || n.includes("ваза")) return "decor";
  if (n.includes("лампа") || n.includes("ночник") || n.includes("освещ")) return "lighting";
  if (n.includes("мебел")) return "furniture";
  if (n.includes("стул") || n.includes("стол")) return "furniture";
  if (n.includes("книга")) return "books";
  return "other";
}

export async function listProducts(): Promise<ProductView[]> {
  try {
    const products = await db.product.findMany({
      where: { status: ProductStatus.APPROVED },
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });

    if (!products.length) throw new Error("No products in DB");

    return products.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.description,
      price: formatPrice(item.price),
      priceRub: item.price,
      imageUrl: item.imageUrl,
      slug: item.slug,
      category: item.category,
      type: item.type,
      stock: item.stock,
      status: item.status,
      author: item.author ? { id: item.author.id, name: item.author.name, image: item.author.image } : undefined,
      description: item.description,
    }));
  } catch {
    return works.map((item) => {
      const category = getCategory(item.name, item.subtitle);
      const isBook = category === "books";
      const author = item.authorId ? authors.find((a) => a.id === item.authorId) : undefined;
      return {
        id: item.id,
        title: item.name,
        subtitle: item.subtitle,
        price: item.price,
        priceRub: priceStringToRub(item.price),
        imageUrl: item.imageUrl,
        slug: item.id,
        category: category,
        type: isBook ? ProductType.BOOK : ProductType.WORK,
        stock: isBook ? 100 : 10,
        status: ProductStatus.APPROVED,
        authorId: item.authorId,
        author: author ? { id: author.id, name: author.name, image: author.avatarUrl } : undefined,
        description: item.description,
      };
    });
  }
}

export async function getProduct(id: string): Promise<ProductView | null> {
  try {
    const product = await db.product.findUnique({
      where: { id, status: ProductStatus.APPROVED },
      include: { author: true },
    });
    if (!product) return null;
    return {
      id: product.id,
      title: product.title,
      subtitle: product.description,
      price: formatPrice(product.price),
      priceRub: product.price,
      imageUrl: product.imageUrl,
      slug: product.slug,
      category: product.category,
      stock: product.stock,
      status: product.status,
      author: product.author ? { id: product.author.id, name: product.author.name, image: product.author.image } : undefined,
      description: product.description,
    };
  } catch {
    const products = await listProducts();
    return products.find((p) => p.id === id) || null;
  }
}
