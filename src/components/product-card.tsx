import Image from "next/image";
import Link from "next/link";
import type { Work } from "@/lib/mock-data";

export function ProductCard({ product }: { product: Work }) {
  return (
    <article className="group rounded border border-black/10 bg-white p-3 shadow-soft">
      <div className="relative aspect-square overflow-hidden rounded">
        <Image src={product.imageUrl} alt={product.name} fill className="object-cover transition group-hover:scale-105" sizes="25vw" />
      </div>
      <h3 className="mt-3 text-xl font-black text-charcoal">{product.name}</h3>
      <p className="text-sm text-charcoal/60">{product.subtitle}</p>
      <p className="mt-2 text-sm font-semibold">
        {product.price}
        {product.oldPrice ? <span className="ml-2 text-charcoal/40 line-through">{product.oldPrice}</span> : null}
      </p>
      <Link href="/cart" className="mt-3 inline-block text-xs font-semibold uppercase tracking-wide text-[#1f3342] hover:underline">
        Добавить в корзину
      </Link>
    </article>
  );
}