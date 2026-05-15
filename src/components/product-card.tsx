import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { ProductView } from "@/lib/products";
import { authors } from "@/lib/mock-data";

export function ProductCard({ product }: { product: ProductView }) {
  if (!product?.id || !product.imageUrl) {
    return null;
  }

  const author = authors.find((a) => a.id === product.authorId);

  return (
    <article className="group flex flex-col rounded border border-black/10 bg-white p-3 shadow-soft transition hover:shadow-md">
      <Link href={`/works/${product.id}`} className="relative aspect-square overflow-hidden rounded">
        <Image src={product.imageUrl} alt={product.title} fill className="object-cover transition group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
      </Link>
      
      <div className="mt-3 flex flex-1 flex-col">
        <Link href={`/works/${product.id}`}>
          <h3 className="text-xl font-black text-charcoal hover:underline">{product.title}</h3>
        </Link>
        <p className="text-sm text-charcoal/60 line-clamp-1">{product.subtitle}</p>
        
        {author && (
          <Link href={`/authors/${author.id}`} className="mt-2 text-xs font-medium text-charcoal/40 hover:text-charcoal hover:underline">
            Автор: {author.name}
          </Link>
        )}

        <div className="mt-auto pt-4">
          <p className="text-lg font-black text-charcoal">{product.price}</p>
          <AddToCartButton
            productId={product.id}
            title={product.title}
            imageUrl={product.imageUrl}
            priceRub={product.priceRub}
            maxStock={product.stock}
          />
        </div>
      </div>
    </article>
  );
}