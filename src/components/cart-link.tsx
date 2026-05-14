"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";

export function CartLink() {
  const { itemCount } = useCart();
  const label = itemCount > 0 ? `Корзина (${itemCount})` : "Корзина";

  return (
    <Link href="/cart" className="hover:text-[#1f3342]">
      {label}
    </Link>
  );
}
