import Image from "next/image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { ProductView } from "@/lib/products";

export function ProductCard({ product }: { product: ProductView }) {
  if (!product?.id || !product.imageUrl) {
    return null;
  }
  return (
    <article className="group rounded border border-black/10 bg-white p-3 shadow-soft">
      <div className="relative aspect-square overflow-hidden rounded">
        <Image src={product.imageUrl} alt={product.title} fill className="object-cover transition group-hover:scale-105" sizes="25vw" />
      </div>
      <h3 className="mt-3 text-xl font-black text-charcoal">{product.title}</h3>
      <p className="text-sm text-charcoal/60">{product.subtitle}</p>
      <p className="mt-2 text-sm font-semibold">{product.price}</p>
      <AddToCartButton
        productId={product.id}
        title={product.title}
        imageUrl={product.imageUrl}
        priceRub={product.priceRub}
        maxStock={product.stock}
      />
    </article>
  );
}