"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export function CartLink() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="hover:text-[#1f3342] relative">
      <CartIcon />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
