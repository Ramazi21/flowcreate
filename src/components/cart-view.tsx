"use client";

import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function formatRub(amount: number) {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

export function CartView() {
  const { lines, subtotalRub, increment, decrement, removeItem, setQuantity } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-6 text-4xl font-black uppercase">Корзина</h1>
        <p className="text-charcoal/70">Корзина пуста.</p>
        <Link href="/works" className="mt-4 inline-block text-sm font-semibold text-[#1f3342] hover:underline">
          Перейти к работам
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-black uppercase">Корзина</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto border border-black/10">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-slate-50 uppercase text-charcoal/70">
              <tr>
                <th className="px-4 py-3">Продукт</th>
                <th className="px-4 py-3">Цена</th>
                <th className="px-4 py-3">Количество</th>
                <th className="px-4 py-3">Итого</th>
                <th className="px-2 py-3" aria-label="Удалить" />
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => {
                const lineTotal = line.priceRub * line.quantity;
                return (
                  <tr key={line.id} className="border-t border-black/10">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded border border-black/10">
                          <Image src={line.imageUrl} alt={line.title} fill className="object-cover" sizes="56px" />
                        </div>
                        <span className="font-semibold">{line.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatRub(line.priceRub)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decrement(line.id)}
                          className="flex h-8 w-8 items-center justify-center rounded border border-black/20 text-lg leading-none hover:bg-slate-50"
                          aria-label="Уменьшить количество"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={line.maxStock}
                          value={line.quantity}
                          onChange={(e) => {
                            const v = parseInt(e.target.value, 10);
                            if (Number.isNaN(v)) return;
                            setQuantity(line.id, v);
                          }}
                          className="w-14 rounded border border-black/20 px-2 py-1 text-center text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => increment(line.id)}
                          disabled={line.quantity >= line.maxStock}
                          className="flex h-8 w-8 items-center justify-center rounded border border-black/20 text-lg leading-none hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Увеличить количество"
                        >
                          +
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-charcoal/50">Макс. {line.maxStock}</p>
                    </td>
                    <td className="px-4 py-4 font-medium whitespace-nowrap">{formatRub(lineTotal)}</td>
                    <td className="px-2 py-4">
                      <button
                        type="button"
                        onClick={() => removeItem(line.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Удалить"
                      >
                        <TrashIcon />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <aside className="h-fit border border-black/10 p-5">
          <h2 className="text-2xl font-black">Итоги корзины</h2>
          <div className="mt-4 space-y-2 border-t border-black/10 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Товаров</span>
              <span>{lines.reduce((n, l) => n + l.quantity, 0)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Итого</span>
              <span className="text-red-600">{formatRub(subtotalRub)}</span>
            </div>
          </div>
          <ButtonLink href="/checkout" className="mt-5 w-full justify-center border-2 border-black bg-transparent hover:bg-black hover:text-white text-black">
            Оформить
          </ButtonLink>
          <Link href="/works" className="mt-3 block text-center text-sm text-charcoal/60 hover:text-[#1f3342]">
            Вернуться к работам
          </Link>
        </aside>
      </div>
    </div>
  );
}
