import { db } from "@/lib/db";
import { ProductStatus, ProductType } from "@prisma/client";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let product = null;

  // Try to get from database first
  try {
    product = await db.product.findUnique({
      where: { slug: id },
      include: { author: true },
    });
  } catch (error) {
    // Database error, try mock data
  }

  // Fallback to mock data if database has no products
  if (!product) {
    const mockProduct = await getProduct(id);
    if (mockProduct && mockProduct.type === ProductType.BOOK) {
      product = {
        id: mockProduct.id,
        title: mockProduct.title,
        slug: mockProduct.slug,
        price: mockProduct.priceRub,
        imageUrl: mockProduct.imageUrl,
        description: mockProduct.description || mockProduct.subtitle,
        stock: mockProduct.stock,
        category: mockProduct.category,
        type: mockProduct.type,
        status: mockProduct.status,
        publishedAt: new Date(),
        author: mockProduct.author ? {
          id: mockProduct.author.id,
          name: mockProduct.author.name,
          image: mockProduct.author.image,
          email: null,
          role: "USER",
          createdAt: new Date(),
          updatedAt: new Date(),
        } : null,
        authorId: mockProduct.author?.id,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  }

  if (!product || product.type !== ProductType.BOOK || product.status !== ProductStatus.APPROVED) {
    notFound();
  }

  const formattedPrice = `${product.price.toLocaleString("ru-RU")} ₽`;
  const publishDate = product.publishedAt ? new Date(product.publishedAt).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/works" className="text-sm text-charcoal/60 hover:text-charcoal">
        ← Назад к работам
      </Link>

      <div className="mt-8 grid gap-12 md:grid-cols-2">
        {/* Обложка */}
        <div className="flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full max-h-96 w-full rounded object-cover shadow-lg"
          />
        </div>

        {/* Информация о книге */}
        <div>
          <h1 className="text-4xl font-black uppercase leading-tight">{product.title}</h1>

          {product.author && (
            <p className="mt-4 text-lg text-charcoal/70">
              <span className="font-semibold">Автор:</span> {product.author.name}
            </p>
          )}

          {publishDate && (
            <p className="mt-2 text-sm text-charcoal/60">
              Опубликована: {publishDate}
            </p>
          )}

          <div className="mt-8 rounded-lg border border-charcoal/10 bg-charcoal/5 p-6">
            <p className="text-base leading-relaxed text-charcoal">{product.description}</p>
          </div>

          {/* Ознакомительный фрагмент */}
          <div className="mt-8 rounded-lg border border-charcoal/10 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-charcoal">Ознакомительный фрагмент</h2>
            <div className="space-y-4 text-base leading-relaxed text-charcoal/80">
              <p>
                Архитектура — это не просто здания, это отражение эпохи, культуры и технологий. От величественных пирамид Египта до футуристических небоскребов Дубая — каждое сооружение рассказывает свою уникальную историю о людях, которые его создали.
              </p>
              <p>
                В этой книге мы пройдем путь через тысячелетия архитектурного наследия, рассмотрим как менялись стили, материалы и методы строительства под влиянием технологического прогресса и культурных обменов между цивилизациями.
              </p>
              <p>
                Вы узнаете о гениальных инженерных решениях древних мастеров, о революционных идеях эпохи Возрождения и о том, как современные архитекторы используют передовые технологии для создания зданий, которые меняют наши города и нашу жизнь.
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between rounded-lg bg-slate-100 p-6">
            <div>
              <p className="text-sm text-charcoal/60">Цена</p>
              <p className="text-3xl font-bold text-charcoal">{formattedPrice}</p>
            </div>
            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                price: formattedPrice,
                priceRub: product.price,
                imageUrl: product.imageUrl,
                slug: product.slug,
              }}
            />
          </div>

          <p className="mt-6 text-sm text-charcoal/50">
            В наличии: {product.stock} шт.
          </p>
        </div>
      </div>
    </div>
  );
}
