import Link from "next/link";
import { auth, signOut } from "@/auth";
import { CartLink } from "@/components/cart-link";

const nav = [
  { href: "/", label: "Главная" },
  { href: "/works", label: "Работы" },
  { href: "/blog", label: "Блог" },
  { href: "/courses", label: "Курсы" },
];

export async function SiteHeader() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

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
          {isAdmin ? (
            <Link href="/admin/products" className="hover:text-[#1f3342]">
              Админ
            </Link>
          ) : null}
          {session?.user ? (
            <Link href="/account" className="hover:text-[#1f3342]">
              Кабинет
            </Link>
          ) : null}
          <Link href="/authors/viktor-alvarado" className="hover:text-[#1f3342]">
            Автор
          </Link>
          <CartLink />
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="hover:text-[#1f3342]">
                Выйти
              </button>
            </form>
          ) : (
            <>
              <Link href="/register" className="hover:text-[#1f3342]">
                Регистрация
              </Link>
              <Link href="/signin" className="hover:text-[#1f3342]">
                Войти
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}