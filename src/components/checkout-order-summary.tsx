"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";

function formatRub(amount: number) {
  return `${amount.toLocaleString("ru-RU")} ₽`;
}

export function CheckoutOrderSummary() {
  const { lines, subtotalRub } = useCart();

  if (lines.length === 0) {
    return (
      <aside className="space-y-4 rounded-md border border-black/10 p-5">
        <h2 className="text-2xl font-black">Заказ</h2>
        <p className="text-sm text-charcoal/70">Корзина пуста.</p>
        <Link href="/cart" className="text-sm font-semibold text-[#1f3342] hover:underline">
          В корзину
        </Link>
      </aside>
    );
  }

  return (
    <aside className="space-y-4 rounded-md border border-black/10 p-5">
      <h2 className="text-2xl font-black">Заказ</h2>
      <ul className="space-y-4 border-b border-black/10 pb-4">
        {lines.map((line) => (
          <li key={line.id} className="flex items-center gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
              <Image src={line.imageUrl} alt={line.title} fill className="object-cover" sizes="64px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">
                {line.title} × {line.quantity}
              </p>
              <p className="text-sm text-charcoal/70">{formatRub(line.priceRub * line.quantity)}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Итого</span>
          <span>{formatRub(subtotalRub)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Всего</span>
          <span>{formatRub(subtotalRub)}</span>
        </div>
      </div>
      <div className="border-t border-black/10 pt-4 text-sm text-charcoal/70">
        <p className="font-semibold text-charcoal">Прямой банковский перевод</p>
        <p className="mt-2">
          Произведите оплату непосредственно на наш банковский счёт. Заказ будет обработан после поступления средств.
        </p>
      </div>
    </aside>
  );
}
