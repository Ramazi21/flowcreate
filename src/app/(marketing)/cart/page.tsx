import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { works } from "@/lib/mock-data";

export default function CartPage() {
  const item = works[2];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-black uppercase">Корзина</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="overflow-hidden border border-black/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 uppercase text-charcoal/70">
              <tr>
                <th className="px-4 py-3">Продукт</th>
                <th className="px-4 py-3">Цена</th>
                <th className="px-4 py-3">Количество</th>
                <th className="px-4 py-3">Итого</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-black/10">
                <td className="px-4 py-4 font-semibold">{item.name}</td>
                <td className="px-4 py-4">{item.price}</td>
                <td className="px-4 py-4">1</td>
                <td className="px-4 py-4">{item.price}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <aside className="h-fit border border-black/10 p-5">
          <h2 className="text-2xl font-black">Итоги корзины</h2>
          <div className="mt-4 space-y-2 border-t border-black/10 pt-4 text-sm">
            <div className="flex justify-between"><span>Итого</span><span>{item.price}</span></div>
            <div className="flex justify-between font-semibold"><span>Общий</span><span>{item.price}</span></div>
          </div>
          <ButtonLink href="/checkout" className="mt-5 w-full justify-center bg-[#32495e] hover:bg-[#24374a]">
            Оформить
          </ButtonLink>
          <Link href="/works" className="mt-3 block text-center text-sm text-charcoal/60 hover:text-[#1f3342]">Вернуться к работам</Link>
        </aside>
      </div>
    </div>
  );
}