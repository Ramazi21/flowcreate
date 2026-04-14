import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { works } from "@/lib/mock-data";

const hero = [
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&h=520&fit=crop",
  "https://images.unsplash.com/photo-1611059116075-15b7fdbf1e00?w=600&h=520&fit=crop",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=520&fit=crop",
  "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600&h=520&fit=crop",
  "https://images.unsplash.com/photo-1468436385273-8abca6dfd8d3?w=600&h=520&fit=crop",
  "https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=600&h=520&fit=crop",
  "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=600&h=520&fit=crop",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=520&fit=crop",
];

export default function HomePage() {
  return (
    <>
      <section className="bg-black py-4 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-xl font-black uppercase md:text-2xl">Поделитесь своим авторским проектом</p>
          <p className="text-5xl font-black text-[#31475f]">#ПАП</p>
        </div>
        <div className="mx-auto mt-6 grid max-w-6xl gap-3 px-4 sm:grid-cols-2 lg:grid-cols-4">
          {hero.map((src, idx) => (
            <div key={`${src}-${idx}`} className={`relative overflow-hidden ${idx === 1 ? "row-span-2 aspect-[3/4]" : "aspect-[4/3]"}`}>
              <Image src={src} alt="Коллекция работ" fill className="object-cover" sizes="25vw" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#728DA1] py-12">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <h2 className="text-4xl font-black leading-tight text-charcoal md:text-6xl">50+ уроков для вдохновения</h2>
            <p className="mt-4 text-lg font-semibold text-charcoal/80">Авторы уже создали много интересных курсов</p>
            <Link href="/courses" className="mt-7 inline-block bg-[#3d5368] px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white">
              Узнайте больше
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="relative aspect-[4/3] overflow-hidden bg-white">
              <Image src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&h=700&fit=crop" alt="Как цвета влияют на человека" fill className="object-cover" sizes="50vw" />
              <div className="absolute bottom-4 left-4 bg-white/95 px-4 py-3 text-3xl font-black leading-tight text-charcoal">
                Как цвета
                <br />
                влияют на
                <br />
                человека ?
              </div>
            </article>
            <article className="relative aspect-[4/3] overflow-hidden bg-white">
              <Image src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&h=700&fit=crop" alt="Дизайнерский курс" fill className="object-cover" sizes="50vw" />
              <div className="absolute bottom-4 left-4 right-4 bg-[#2c3e97]/90 px-4 py-3 text-xl font-black text-white">
                ДИЗАЙНЕРСКИЙ КУРС
                <br />
                ДЛЯ ОПЫТНЫХ ПОЛЬЗОВАТЕЛЕЙ
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-black uppercase">Популярные работы</h2>
          <Link href="/works" className="text-sm font-semibold uppercase tracking-wide text-[#1f3342]">Все работы</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {works.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}