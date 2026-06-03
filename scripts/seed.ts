import { db } from "@/lib/db";
import { ProductStatus } from "@prisma/client";

async function main() {
  console.log("Seeding DB...");

  // Create a test user if not exists
  const testUser = await db.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
    },
  });

  const products = [
    {
      title: "Керамическая ваза ручной работы",
      slug: "keramicheskaya-vaza",
      price: 3500,
      imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=600&fit=crop",
      description: "Уникальная ваза из белой глины, расписанная вручную.",
      category: "decor",
      status: ProductStatus.APPROVED,
    },
    {
      title: "Настольная лампа из дерева",
      slug: "nastolnaya-lampa",
      price: 5200,
      imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=600&fit=crop",
      description: "Экологичная лампа из массива дуба с тканевым абажуром.",
      category: "lighting",
      status: ProductStatus.APPROVED,
    },
    {
      title: "Деревянный поднос",
      slug: "derevyanniy-podnos",
      price: 2800,
      imageUrl: "https://images.unsplash.com/photo-1481459018394-7259716519a8?w=800&h=600&fit=crop",
      description: "Поднос из ясеня с ручками, покрытый натуральным маслом.",
      category: "furniture",
      status: ProductStatus.PENDING,
    },
    {
      title: "Текстильная картина",
      slug: "tekstilnaya-kartina",
      price: 4500,
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      description: "Макраме-панно в технике узелкового плетения.",
      category: "decor",
      status: ProductStatus.REJECTED,
    },
  ];

  for (const product of products) {
    await db.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        stock: 10,
        authorId: testUser.id,
      },
    });
    console.log(`Created product: ${product.title}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
