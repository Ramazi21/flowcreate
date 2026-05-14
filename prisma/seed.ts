import { PrismaClient, ProductStatus, UserRole } from "@prisma/client";
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
    await prisma.product.upsert({
      where: { slug },
      update: {
        title: item.name,
        price: parsePrice(item.price),
        imageUrl: item.imageUrl,
        description: item.subtitle,
        stock: 10,
        category: "decor",
        status: ProductStatus.APPROVED,
      },
      create: {
        title: item.name,
        slug,
        price: parsePrice(item.price),
        imageUrl: item.imageUrl,
        description: item.subtitle,
        stock: 10,
        category: "decor",
        status: ProductStatus.APPROVED,
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
