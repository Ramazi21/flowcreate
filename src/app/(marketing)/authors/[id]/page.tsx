import Image from "next/image";
import { notFound } from "next/navigation";
import { authors } from "@/lib/mock-data";
import { ProductCard } from "@/components/product-card";
import { listProducts } from "@/lib/products";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AuthorDetailPage({ params }: Props) {
  const { id } = await params;
  const author = authors.find((a) => a.id === id);

  if (!author) {
    notFound();
  }

  const allProducts = await listProducts();
  const authorProducts = allProducts.filter((p) => p.authorId === author.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="grid gap-8 md:grid-cols-[220px_1fr] md:items-start">
        <div className="relative h-52 w-52 mx-auto md:mx-0 overflow-hidden rounded-md border border-black/10 shadow-sm">
          <Image
            src={author.avatarUrl}
            alt={author.name}
            fill
            className="object-cover"
            sizes="220px"
          />
        </div>
        <div className="text-center md:text-left">
          <div className="flex flex-wrap items-baseline justify-center md:justify-start gap-4">
            <h1 className="text-4xl md:text-5xl font-black text-charcoal">{author.name}</h1>
            <span className="text-xl text-charcoal/40 font-medium">@{author.id}</span>
          </div>
          <p className="mt-2 text-xl text-charcoal/70">{author.role}</p>
          <p className="mt-1 text-sm text-charcoal/60">
            {author.location} · {author.followers.toLocaleString()} подписчиков
          </p>
          
          <div className="mt-6 flex justify-center md:justify-start gap-3">
            <button className="rounded-md bg-charcoal px-6 py-2.5 text-sm font-bold text-white uppercase tracking-wider hover:bg-charcoal/90 transition">
              Сообщение
            </button>
            <button className="rounded-md border border-black/20 px-6 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-slate-50 transition">
              Подписаться
            </button>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-black uppercase tracking-widest text-charcoal/40">Обо мне</h2>
            <p className="mt-4 text-lg leading-relaxed text-charcoal/80 max-w-2xl mx-auto md:mx-0">
              {author.bio}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          <h3 className="text-3xl font-black uppercase">Работы автора</h3>
          <span className="text-sm font-bold text-charcoal/40">{authorProducts.length} предметов</span>
        </div>
        
        {authorProducts.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {authorProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center py-20 bg-slate-50 rounded-xl">
            <p className="text-xl text-charcoal/40">У автора пока нет опубликованных работ</p>
          </div>
        )}
      </section>
    </div>
  );
}
