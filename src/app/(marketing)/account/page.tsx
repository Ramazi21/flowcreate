import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AddWorkForm } from "./add-work-form";
import { MyWorks } from "./my-works";

const roleLabel: Record<string, string> = {
  USER: "Покупатель",
  ADMIN: "Администратор",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin?callbackUrl=/account");
  }

  const user = session.user;
  const name = user.name ?? "Без имени";
  const email = user.email ?? "—";
  const role = roleLabel[user.role] ?? user.role;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-black uppercase text-[#1f3342]">Личный кабинет</h1>
      <p className="mt-2 text-sm text-charcoal/70">Доступен только после входа в аккаунт.</p>

      <section className="mt-10 border border-black/10 bg-white p-6 shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">Профиль</h2>
        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-start">
          {user.image ? (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-black/10">
              <img src={user.image} alt="" className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-dashed border-black/20 bg-slate-50 text-2xl font-black text-charcoal/40">
              {name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <dl className="min-w-0 flex-1 space-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal/50">Имя</dt>
              <dd className="mt-0.5 font-semibold text-charcoal">{name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal/50">Email</dt>
              <dd className="mt-0.5 break-all text-charcoal">{email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-charcoal/50">Роль</dt>
              <dd className="mt-0.5 text-charcoal">{role}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-8">
        <AddWorkForm />
      </section>

      <section className="mt-8">
        <MyWorks />
      </section>

      <section className="mt-8 border border-black/10 bg-white p-6 shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-charcoal/60">Заказы и корзина</h2>
        <ul className="mt-4 flex flex-col gap-2 text-sm">
          <li>
            <Link href="/cart" className="font-medium text-[#1f3342] underline-offset-2 hover:underline">
              Корзина
            </Link>
          </li>
          <li>
            <Link href="/checkout" className="font-medium text-[#1f3342] underline-offset-2 hover:underline">
              Оформление заказа
            </Link>
          </li>
          <li>
            <Link href="/works" className="font-medium text-[#1f3342] underline-offset-2 hover:underline">
              Каталог работ
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
