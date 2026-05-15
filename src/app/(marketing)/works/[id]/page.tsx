import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { authors } from "@/lib/mock-data";
import { AddToCartButton } from "@/components/add-to-cart-button";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function WorkDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const author = authors.find((a) => a.id === product.authorId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/works"
        className="mb-8 inline-flex items-center text-sm font-medium text-charcoal/60 hover:text-charcoal"
      >
        ← Назад к работам
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Левая колонка - Фото */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-50 shadow-lg">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Правая колонка - Детали */}
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-4xl font-black text-charcoal uppercase leading-tight">
              {product.title}
            </h1>
            <p className="mt-2 text-xl text-charcoal/60 font-medium italic">
              {product.subtitle}
            </p>
          </div>

          <div className="text-3xl font-black text-charcoal">
            {product.price}
          </div>

          <div className="prose prose-slate max-w-none">
            <h3 className="text-lg font-bold text-charcoal uppercase tracking-wider">Описание</h3>
            <p className="mt-2 text-lg leading-relaxed text-charcoal/80">
              {product.description || "Описание этой прекрасной работы пока не добавлено автором, но вы можете оценить её визуальное исполнение."}
            </p>
          </div>

          <div className="pt-6">
            <AddToCartButton
              productId={product.id}
              title={product.title}
              imageUrl={product.imageUrl}
              priceRub={product.priceRub}
              maxStock={product.stock}
            />
          </div>

          {/* Автор */}
          {author && (
            <div className="mt-auto border-t border-black/10 pt-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal/40 mb-4">Автор работы</h3>
              <Link href={`/authors/${author.id}`} className="group flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border border-black/5 bg-slate-100">
                  <Image
                    src={author.avatarUrl}
                    alt={author.name}
                    fill
                    className="object-cover transition group-hover:scale-110"
                  />
                </div>
                <div>
                  <div className="text-xl font-black text-charcoal group-hover:underline">
                    {author.name}
                  </div>
                  <div className="text-sm text-charcoal/60">{author.role}</div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
