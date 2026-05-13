"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[marketing]", error.message, error.digest ?? "");
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-20 text-center">
      <h1 className="font-serif text-2xl font-semibold text-charcoal">Не удалось загрузить страницу</h1>
      <p className="text-sm text-charcoal/70">
        Попробуйте обновить. Если проблема повторяется, проверьте логи сервера (digest: {error.digest ?? "—"}).
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button type="button" variant="outline" onClick={() => reset()}>
          Повторить
        </Button>
        <ButtonLink href="/">На главную</ButtonLink>
      </div>
    </div>
  );
}
