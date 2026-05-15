import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/mock-data";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center text-sm font-medium text-charcoal/60 hover:text-charcoal"
      >
        ← Назад к блогу
      </Link>

      <article className="space-y-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-4">
          <div className="text-sm font-semibold uppercase tracking-wider text-charcoal/50">
            {post.category}
          </div>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            {post.title}
          </h1>
        </div>

        <div className="max-w-none">
          {post.content?.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-6 text-lg leading-relaxed text-charcoal/80">
              {paragraph}
            </p>
          ))}
        </div>
      </article>

      <div className="mt-12 border-t border-black/10 pt-8">
        <h3 className="text-xl font-bold">Читайте также</h3>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {blogPosts
            .filter((p) => p.id !== id)
            .slice(0, 2)
            .map((p) => (
              <Link key={p.id} href={`/blog/${p.id}`} className="group">
                <div className="relative aspect-video overflow-hidden rounded-md">
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h4 className="mt-3 font-bold group-hover:underline">{p.title}</h4>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
