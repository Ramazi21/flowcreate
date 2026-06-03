import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { CartLink } from "@/components/cart-link";
import { MobileMenu } from "@/components/mobile-menu";

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const nav = [
  { href: "/", label: "Главная" },
  { href: "/works", label: "Работы" },
  { href: "/blog", label: "Блог" },
  { href: "/courses", label: "Курсы" },
  { href: "/authors", label: "Авторы" },
];

export async function SiteHeader() {
  let session = null;
  try {
    session = await auth();
  } catch (e) {
    console.error("Auth error in SiteHeader:", e);
  }
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-5">
        <div className="flex items-center gap-4">
          <MobileMenu nav={nav} isAdmin={isAdmin} user={session?.user} />
          <Link href="/" className="relative h-10 w-auto">
            <Image src="/images/logo/logo.jpg" alt="ПАП" width={120} height={40} className="h-10 w-auto" />
          </Link>
        </div>

        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.12em] text-charcoal md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="border-b-2 border-transparent pb-1 hover:border-[#1f3342]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4 text-sm text-charcoal/80">
        <div className="hidden items-center gap-4 lg:flex">
          {isAdmin ? (
            <Link href="/admin/products" className="hover:text-[#1f3342]">
              Админ
            </Link>
          ) : null}
          {session?.user ? (
            <>
              <Link href="/account" className="hover:text-[#1f3342]">
                Кабинет
              </Link>
              <Link href="/account" className="hover:text-[#1f3342]">
                Мои работы
              </Link>
            </>
          ) : null}
        </div>
          
          <CartLink />
          
          <div className="hidden sm:block">
            {session?.user ? (
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="hover:text-[#1f3342]">
                  <UserIcon />
                </button>
              </form>
            ) : (
              <div className="flex gap-4">
                <Link href="/signin" className="hover:text-[#1f3342]">
                  <UserIcon />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}