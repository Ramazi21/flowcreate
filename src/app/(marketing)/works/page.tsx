import { ProductCard } from "@/components/product-card";
import { works } from "@/lib/mock-data";

export default function WorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-sm text-charcoal/60">Главная / Общий / Работы</div>
      <h1 className="mt-3 text-4xl font-black uppercase">Работы</h1>
      <div className="mt-6 grid gap-3 rounded border border-black/10 bg-white p-4 text-sm text-charcoal/70 md:grid-cols-[auto_1fr_auto] md:items-center">
        <button className="w-fit border border-black/20 px-3 py-2">Фильтр</button>
        <span>Показаны 1-16 из 32 результатов</span>
        <span>По умолчанию</span>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {works.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="mt-8 flex justify-center gap-2">
        <button className="h-9 w-9 bg-[#32495e] text-white">1</button>
        <button className="h-9 w-9 bg-slate-100">2</button>
        <button className="h-9 w-9 bg-slate-100">3</button>
        <button className="bg-slate-100 px-4">Следующий</button>
      </div>
    </div>
  );
}