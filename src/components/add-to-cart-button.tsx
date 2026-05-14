"use client";

import { useCart } from "@/context/cart-context";

type Props = {
  productId: string;
  title: string;
  imageUrl: string;
  priceRub: number;
  maxStock: number;
};

export function AddToCartButton({ productId, title, imageUrl, priceRub, maxStock }: Props) {
  const { addItem } = useCart();

  if (maxStock < 1) {
    return <p className="mt-3 text-xs text-charcoal/50">Нет в наличии</p>;
  }

  return (
    <button
      type="button"
      onClick={() =>
        addItem({
          id: productId,
          title,
          imageUrl,
          priceRub,
          maxStock,
        })
      }
      className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#1f3342] hover:underline"
    >
      Добавить в корзину
    </button>
  );
}
