import { PrismaClient, ProductStatus, UserRole, ProductType } from "@prisma/client";
import { works } from "../src/lib/mock-data";

const prisma = new PrismaClient();

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function parsePrice(raw: string) {
  const numeric = raw.replace(/[^\d]/g, "");
  return Number.parseInt(numeric, 10) || 0;
}

function getCategory(name: string, subtitle: string): string {
  const n = (name + " " + subtitle).toLowerCase();
  if (n.includes("рисунок") || n.includes("рисунки")) return "risunki";
  if (n.includes("картина") || n.includes("панно") || n.includes("скульптура") || n.includes("ваза") || n.includes("декор")) return "decor";
  if (n.includes("лампа") || n.includes("ночник") || n.includes("освещ")) return "lighting";
  if (n.includes("стул") || n.includes("стол") || n.includes("мебел")) return "furniture";
  if (n.includes("книга")) return "books";
  return "other";
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: UserRole.ADMIN },
      create: { email: adminEmail, name: "Admin", role: UserRole.ADMIN },
    });
  }

  for (const item of works) {
    const slug = toSlug(item.name) || item.id;
    const category = getCategory(item.name, item.subtitle);
    const isBook = category === "books";
    
    await prisma.product.upsert({
      where: { slug },
      update: {
        title: item.name,
        price: parsePrice(item.price),
        imageUrl: item.imageUrl,
        description: item.subtitle,
        stock: isBook ? 100 : 10,
        category: category,
        status: ProductStatus.APPROVED,
        type: isBook ? ProductType.BOOK : ProductType.WORK,
        isPublished: isBook,
        publishedAt: isBook ? new Date() : null,
      },
      create: {
        title: item.name,
        slug,
        price: parsePrice(item.price),
        imageUrl: item.imageUrl,
        description: item.subtitle,
        stock: isBook ? 100 : 10,
        category: category,
        status: ProductStatus.APPROVED,
        type: isBook ? ProductType.BOOK : ProductType.WORK,
        isPublished: isBook,
        publishedAt: isBook ? new Date() : null,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
