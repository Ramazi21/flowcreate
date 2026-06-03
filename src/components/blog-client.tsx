"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/mock-data";

interface BlogClientProps {
  initialPosts: BlogPost[];
  recentPosts: string[];
}

export function BlogClient({ initialPosts, recentPosts }: BlogClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    initialPosts.forEach((post) => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialPosts, search, selectedCategory]);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_320px]">
      {/* Основной контент */}
      <section className="space-y-12">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article key={post.id} className="border-b border-black/10 pb-8 transition-opacity duration-300">
              <Link href={`/blog/${post.id}`} className="block group">
                <div className="relative aspect-[16/8] overflow-hidden rounded-lg">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 70vw"
                  />
                </div>
              </Link>
              <div className="mt-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#32495e]">
                <span>{post.category}</span>
                <span className="h-1 w-1 rounded-full bg-black/20" />
                <span className="text-charcoal/40">4 апреля 2022</span>
              </div>
              <Link href={`/blog/${post.id}`} className="group">
                <h2 className="mt-2 text-3xl font-black leading-tight text-charcoal group-hover:text-[#1f3342] transition-colors md:text-4xl">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-3 text-lg leading-relaxed text-charcoal/70">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.id}`}
                className="mt-6 inline-block border-b-2 border-charcoal pb-1 text-sm font-black uppercase tracking-wider text-charcoal hover:border-[#1f3342] hover:text-[#1f3342] transition-all"
              >
                Читать далее
              </Link>
            </article>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-2xl font-black text-charcoal/30 uppercase tracking-widest">Статьи не найдены</p>
            <button 
              onClick={() => { setSearch(""); setSelectedCategory(null); }}
              className="mt-4 text-sm font-bold text-charcoal underline underline-offset-4"
            >
              Сбросить все фильтры
            </button>
          </div>
        )}
      </section>

      {/* Боковая колонка */}
      <aside className="space-y-12">
        {/* Поиск */}
        <div className="group relative">
          <input
            type="text"
            placeholder="Поиск по блогу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-black/10 bg-slate-50 px-4 py-3 pr-10 text-sm transition-all focus:border-charcoal focus:bg-white focus:outline-none focus:ring-4 focus:ring-charcoal/5"
          />
          <span className="absolute right-3 top-3 text-xl text-charcoal/30 group-focus-within:text-charcoal transition-colors">⌕</span>
        </div>

        {/* Категории (Теги) */}
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-charcoal">Категории</h3>
          <div className="mt-6 flex flex-col gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex justify-between rounded-md px-3 py-2 text-sm font-bold transition-all ${
                !selectedCategory 
                ? "bg-charcoal text-white shadow-md" 
                : "text-charcoal/60 hover:bg-slate-100"
              }`}
            >
              <span>Все статьи</span>
              <span>{initialPosts.length}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex justify-between rounded-md px-3 py-2 text-sm font-bold transition-all ${
                  selectedCategory === cat.name
                  ? "bg-charcoal text-white shadow-md"
                  : "text-charcoal/60 hover:bg-slate-100"
                }`}
              >
                <span>{cat.name}</span>
                <span className={selectedCategory === cat.name ? "text-white/60" : "text-charcoal/30"}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Последние записи */}
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-charcoal">Свежее</h3>
          <ul className="mt-6 space-y-6">
            {recentPosts.map((title, idx) => {
              const post = initialPosts[idx % initialPosts.length];
              return (
                <li key={`${title}-${idx}`}>
                  <Link href={`/blog/${post.id}`} className="group flex gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-slate-100">
                      <Image
                        src={post.imageUrl}
                        alt=""
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-black leading-tight text-charcoal group-hover:text-[#1f3342] transition-colors line-clamp-2">
                        {title}
                      </p>
                      <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-charcoal/40">
                        {post.category}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
}
