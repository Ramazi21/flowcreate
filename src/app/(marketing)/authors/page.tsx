import Image from "next/image";
import Link from "next/link";
import { authors } from "@/lib/mock-data";

export default function AuthorsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-4xl font-black uppercase">Авторы</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map((author) => (
          <Link key={author.id} href={`/authors/${author.id}`} className="group">
            <div className="overflow-hidden border border-black/10 bg-white transition-shadow hover:shadow-lg">
              <div className="relative aspect-square">
                <Image
                  src={author.avatarUrl}
                  alt={author.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-black text-charcoal group-hover:text-[#1f3342] transition-colors">
                  {author.name}
                </h2>
                <p className="mt-1 text-sm text-charcoal/70">{author.role}</p>
                <p className="mt-2 text-sm text-charcoal/60 line-clamp-2">{author.bio}</p>
                <p className="mt-3 text-xs text-charcoal/50">{author.location} • {author.followers} подписчиков</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
