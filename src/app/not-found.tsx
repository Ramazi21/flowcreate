import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <h1 className="font-serif text-4xl font-semibold text-charcoal">Страница не найдена</h1>
      <ButtonLink href="/">На главную</ButtonLink>
    </div>
  );
}