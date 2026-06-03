"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ProductStatus, type Product } from "@prisma/client";

const statusLabel: Record<ProductStatus, string> = {
  PENDING: "⏳ На модерации",
  APPROVED: "✅ Одобрено",
  REJECTED: "❌ Отклонено",
};

const statusColor: Record<ProductStatus, string> = {
  PENDING: "text-amber-600",
  APPROVED: "text-emerald-600",
  REJECTED: "text-red-600",
};

type ProductWithAuthor = Product & {
  author: { id: string; name?: string | null; image?: string | null } | null;
};

export function MyWorks() {
  const [works, setWorks] = useState<ProductWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/my-works")
      .then((res) => res.json())
      .then((data) => {
        setWorks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-sm text-charcoal/60">Загрузка...</div>;
  }

  return (
    <div className="border border-black/10 bg-white p-6 shadow-soft">
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">Мои работы</h2>
      
      {!works.length ? (
        <p className="mt-4 text-sm text-charcoal/60">У вас пока нет работ.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <div key={work.id} className="rounded border border-black/10 p-3">
              <div className="relative aspect-square overflow-hidden rounded">
                <Image src={work.imageUrl} alt={work.title} fill className="object-cover" sizes="200px" />
              </div>
              <h3 className="mt-3 font-semibold text-charcoal">{work.title}</h3>
              <p className={`mt-1 text-xs font-medium ${statusColor[work.status]}`}>{statusLabel[work.status]}</p>
              <p className="mt-2 text-sm text-charcoal/80">{work.price.toLocaleString("ru-RU")} ₽</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
