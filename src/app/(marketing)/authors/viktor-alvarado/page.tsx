import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { works } from "@/lib/mock-data";

export default function AuthorPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="grid gap-8 md:grid-cols-[220px_1fr] md:items-start">
        <div className="relative h-52 w-52 overflow-hidden rounded-md border border-black/10">
          <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=700&fit=crop" alt="Виктор Альварадо" fill className="object-cover" sizes="220px" />
        </div>
        <div>
          <h1 className="text-5xl font-black">Виктор Альварадо</h1>
          <p className="mt-2 text-xl text-charcoal/70">Художник-сюрреалист</p>
          <p className="mt-1 text-sm text-charcoal/60">Россия · 520 подписчиков</p>
          <div className="mt-5 flex gap-3">
            <button className="rounded-md bg-[#32495e] px-4 py-2 text-sm font-semibold text-white">Сообщение</button>
            <button className="rounded-md border border-black/20 px-4 py-2 text-sm font-semibold">Подписаться</button>
          </div>
          <h2 className="mt-8 text-2xl font-black">Обо мне</h2>
          <p className="mt-3 text-charcoal/80">
            Художник-сюрреалист, скульптор и преподаватель. Создаю картины и скульптуры в стиле сюрреализма,
            помогаю ученикам строить композицию и воплощать идеи в материале.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-3xl font-black">Работы автора</h3>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {works.slice(4, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}