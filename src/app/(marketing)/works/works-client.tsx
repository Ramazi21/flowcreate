"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import type { ProductView } from "@/lib/products";

const ITEMS_PER_PAGE = 8;

const CATEGORIES = [
  { id: "all", name: "Все работы" },
  { id: "decor", name: "Декор" },
  { id: "furniture", name: "Мебель" },
  { id: "lighting", name: "Освещение" },
];

export function WorksClient({ initialProducts }: { initialProducts: ProductView[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.subtitle.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || product.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, search, category]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-sm text-charcoal/60">Главная / Общий / Работы</div>
      <h1 className="mt-3 text-4xl font-black uppercase">Работы</h1>

      {/* Поиск и фильтры */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Поиск работ..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setVisibleCount(ITEMS_PER_PAGE);
            }}
            className="w-full rounded border border-black/10 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-charcoal"
          />
          <span className="absolute right-3 top-2.5 text-charcoal/30">⌕</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCategory(cat.id);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              className={`rounded px-4 py-2 text-sm font-medium transition ${
                category === cat.id
                  ? "bg-charcoal text-white"
                  : "bg-slate-100 text-charcoal hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-sm text-charcoal/50">
        Показано {visibleProducts.length} из {filteredProducts.length} результатов
      </div>

      {/* Сетка товаров */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {visibleProducts.length === 0 && (
        <div className="mt-20 text-center">
          <p className="text-xl text-charcoal/50">Работы не найдены :(</p>
        </div>
      )}

      {/* Кнопка Показать еще */}
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            className="rounded bg-charcoal px-8 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-charcoal/90"
          >
            Показать еще
          </button>
        </div>
      )}
    </div>
  );
}
