import Link from "next/link";

const nav = [
  { href: "/", label: "Главная" },
  { href: "/works", label: "Работы" },
  { href: "/blog", label: "Блог" },
  { href: "/courses", label: "Курсы" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link href="/" className="text-3xl font-black tracking-tight text-[#1f3342]">
          ПАП
        </Link>
        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="border-b-2 border-transparent pb-1 hover:border-[#1f3342]">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm text-charcoal/80">
          <Link href="/authors/viktor-alvarado" className="hover:text-[#1f3342]">
            Автор
          </Link>
          <Link href="/cart" className="hover:text-[#1f3342]">
            Корзина
          </Link>
        </div>
      </div>
    </header>
  );
}