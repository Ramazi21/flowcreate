import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-black/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="text-2xl font-black leading-tight">Платформа</p>
          <p className="text-2xl font-black leading-tight">Авторских</p>
          <p className="text-2xl font-black leading-tight">Проектов.</p>
          <p className="mt-4 text-sm text-charcoal/70">656050, Россия, Алтайский край, Барнаул, Улица Юрина, 170</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase text-charcoal/80">Ссылки</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">Главная</Link></li>
            <li><Link href="/works">Работы</Link></li>
            <li><Link href="/blog">Блог</Link></li>
            <li><Link href="/courses">Курсы</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase text-charcoal/80">Помощь</p>
          <ul className="space-y-2 text-sm text-charcoal/80">
            <li>Варианты оплаты</li>
            <li>Возврат</li>
            <li>Политика конфиденциальности</li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase text-charcoal/80">Информационный бюллетень</p>
          <div className="flex gap-2">
            <input
              type="email"
              readOnly
              placeholder="Введите адрес электронной почты"
              className="flex-1 rounded border border-black/20 px-3 py-2 text-sm"
            />
            <button type="button" className="rounded bg-charcoal px-3 py-2 text-xs font-semibold text-white">
              ПОДПИСАТЬСЯ
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-black/10 px-4 py-4 text-xs text-charcoal/70">
        2026 Платформа авторских проектов. Все права защищены.
      </div>
    </footer>
  );
}