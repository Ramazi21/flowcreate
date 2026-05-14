"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      login: String(fd.get("login") ?? ""),
      email: String(fd.get("email") ?? ""),
      password: String(fd.get("password") ?? ""),
      passwordConfirm: String(fd.get("passwordConfirm") ?? ""),
      vkCode: String(fd.get("vkCode") ?? ""),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Ошибка регистрации");
        return;
      }

      const signInRes = await signIn("credentials", {
        login: body.login.trim(),
        password: body.password,
        redirect: false,
      });
      if (signInRes?.error) {
        setError("Аккаунт создан, но не удалось войти автоматически. Войдите вручную.");
        return;
      }
      window.location.assign("/account");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-md space-y-4 text-left">
      <div>
        <label htmlFor="reg-login" className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
          Логин
        </label>
        <input
          id="reg-login"
          name="login"
          type="text"
          autoComplete="username"
          required
          minLength={3}
          maxLength={32}
          pattern="[a-zA-Z0-9_]+"
          title="Латиница, цифры и подчёркивание"
          className="mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="reg-email" className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
          Email
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="reg-password" className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
          Пароль
        </label>
        <input
          id="reg-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="reg-password2" className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
          Подтверждение пароля
        </label>
        <input
          id="reg-password2"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="reg-vk" className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
          Код от VK-бота
        </label>
        <input
          id="reg-vk"
          name="vkCode"
          type="text"
          required
          autoComplete="one-time-code"
          placeholder="Например, AB12CD34"
          className="mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm uppercase"
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <Button type="submit" className="w-full justify-center" disabled={pending}>
        {pending ? "Регистрация…" : "Зарегистрироваться"}
      </Button>
      <p className="text-center text-sm text-charcoal/70">
        Уже есть аккаунт?{" "}
        <Link href="/signin" className="font-semibold text-[#1f3342] hover:underline">
          Войти
        </Link>
      </p>
    </form>
  );
}
