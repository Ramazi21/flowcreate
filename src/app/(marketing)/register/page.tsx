import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RegisterForm } from "@/components/register-form";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/account");

  return (
    <div className="mx-auto max-w-lg px-4 py-14">
      <h1 className="text-center text-3xl font-black">Регистрация</h1>
      <p className="mx-auto mt-3 max-w-md text-center text-sm text-charcoal/70">
        Заполните форму и введите одноразовый код, который выдаёт VK-бот сообщества (код запрашивается у бота до
        регистрации).
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
      <p className="mt-10 text-center text-sm">
        <Link href="/" className="text-charcoal/60 hover:text-[#1f3342]">
          На главную
        </Link>
      </p>
    </div>
  );
}
