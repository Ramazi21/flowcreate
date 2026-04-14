import Image from "next/image";
import Link from "next/link";
import { blogPosts, recentPosts } from "@/lib/mock-data";

export default function BlogPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_320px]">
      <section className="space-y-12">
        {blogPosts.map((post) => (
          <article key={post.id} className="border-b border-black/10 pb-8">
            <div className="relative aspect-[16/8] overflow-hidden">
              <Image src={post.imageUrl} alt={post.title} fill className="object-cover" sizes="70vw" />
            </div>
            <div className="mt-3 text-xs text-charcoal/60">4 апреля · 14 августа 2022 · {post.category}</div>
            <h2 className="mt-2 text-4xl font-black leading-tight">{post.title}</h2>
            <p className="mt-3 text-sm text-charcoal/70">{post.excerpt}</p>
            <Link href="/blog" className="mt-4 inline-block border-b border-charcoal text-sm font-semibold text-charcoal hover:text-[#1f3342]">
              Читать далее
            </Link>
          </article>
        ))}

        <div className="flex justify-center gap-2">
          <button className="h-9 w-9 bg-[#32495e] text-white">1</button>
          <button className="h-9 w-9 bg-slate-100">2</button>
          <button className="h-9 w-9 bg-slate-100">3</button>
          <button className="bg-slate-100 px-4">Следующий</button>
        </div>
      </section>

      <aside className="space-y-8">
        <div className="relative">
          <input type="search" placeholder="Поиск" className="w-full border border-black/20 px-3 py-2 pr-10" />
          <span className="absolute right-3 top-2.5 text-charcoal/50">⌕</span>
        </div>
        <div>
          <h3 className="text-3xl font-black">Категории</h3>
          <ul className="mt-4 space-y-3 text-sm text-charcoal/80">
            <li className="flex justify-between"><span>Ремонт</span><span>2</span></li>
            <li className="flex justify-between"><span>Дизайн</span><span>8</span></li>
            <li className="flex justify-between"><span>Ручной работы</span><span>7</span></li>
            <li className="flex justify-between"><span>Интерьер</span><span>1</span></li>
            <li className="flex justify-between"><span>Древесина</span><span>5</span></li>
          </ul>
        </div>
        <div>
          <h3 className="text-3xl font-black">Последние сообщения</h3>
          <ul className="mt-4 space-y-4">
            {recentPosts.map((title, idx) => (
              <li key={title} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden">
                  <Image src={blogPosts[idx % blogPosts.length].imageUrl} alt={title} fill className="object-cover" sizes="56px" />
                </div>
                <p className="text-sm text-charcoal/80">{title}</p>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}