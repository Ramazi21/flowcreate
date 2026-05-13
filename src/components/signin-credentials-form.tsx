"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignInCredentialsForm({ callbackUrl }: { callbackUrl: string }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);
    const fd = new FormData(e.currentTarget);
    const login = String(fd.get("login") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    try {
      const res = await signIn("credentials", { login, password, redirect: false });
      if (res?.error) {
        setError("Неверный логин или пароль");
        return;
      }
      window.location.assign(callbackUrl);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full space-y-3 text-left">
      <div>
        <label htmlFor="signin-login" className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
          Логин или email
        </label>
        <input
          id="signin-login"
          name="login"
          type="text"
          autoComplete="username"
          required
          className="mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="signin-password" className="block text-xs font-semibold uppercase tracking-wide text-charcoal/60">
          Пароль
        </label>
        <input
          id="signin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded border border-black/20 px-3 py-2 text-sm"
        />
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <Button type="submit" className="w-full justify-center" disabled={pending}>
        {pending ? "Вход…" : "Войти"}
      </Button>
    </form>
  );
}
