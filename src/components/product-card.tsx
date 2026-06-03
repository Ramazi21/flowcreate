import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { ProductView } from "@/lib/products";
import { ProductType } from "@prisma/client";

export function ProductCard({ product }: { product: ProductView }) {
  if (!product?.id || !product.imageUrl) {
    return null;
  }

  const author = product.author;
  const productLink = product.type === ProductType.BOOK 
    ? `/books/${product.slug}` 
    : `/works/${product.slug}`;

  return (
    <article className="group flex flex-col rounded border border-black/10 bg-white p-3 shadow-soft transition hover:shadow-md">
      <Link href={productLink} className="relative aspect-square overflow-hidden rounded">
        <Image src={product.imageUrl} alt={product.title} fill className="object-cover transition group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
      </Link>
      
      <div className="mt-3 flex flex-1 flex-col">
        <Link href={productLink}>
          <h3 className="text-xl font-black text-charcoal hover:underline">{product.title}</h3>
        </Link>
        <p className="text-sm text-charcoal/60 line-clamp-1">{product.subtitle}</p>
        
        {author && (
          <div className="mt-3 flex items-center gap-2">
            <Link href={`/authors/${author.id}`} className="relative h-6 w-6 overflow-hidden rounded-full border border-black/5 hover:opacity-80 transition-opacity">
              <Image 
                src={author.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"} 
                alt={author.name || "Автор"} 
                fill 
                className="object-cover"
                sizes="24px"
              />
            </Link>
            <Link 
              href={`/authors/${author.id}`} 
              className="text-xs font-medium text-charcoal/40 hover:text-charcoal hover:underline transition-colors"
            >
              {author.name || "Автор"}
            </Link>
          </div>
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