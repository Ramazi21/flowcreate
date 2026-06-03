import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-black text-white">
      <div className="relative w-full flex">
        <div className="relative flex-1 h-[222px]">
          <Image 
            src="/images/header_fotter/footer 2.png" 
            alt="" 
            fill
            className="object-cover"
          />
        </div>
        <div className="relative flex-1 h-[222px]">
          <Image 
            src="/images/header_fotter/footer 2.png" 
            alt="" 
            fill
            className="object-cover"
          />
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <p className="text-2xl font-black leading-tight">Платформа</p>
          <p className="text-2xl font-black leading-tight">Авторских</p>
          <p className="text-2xl font-black leading-tight">Проектов.</p>
          <p className="mt-4 text-sm text-white/70">656050, Россия, Алтайский край, Барнаул, Павловский тракт, 174А</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase text-white/80">Ссылки</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="text-white hover:text-white/70">Главная</Link></li>
            <li><Link href="/works" className="text-white hover:text-white/70">Работы</Link></li>
            <li><Link href="/blog" className="text-white hover:text-white/70">Блог</Link></li>
            <li><Link href="/courses" className="text-white hover:text-white/70">Курсы</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase text-white/80">Помощь</p>
          <ul className="space-y-2 text-sm text-white/80">
            <li>Варианты оплаты</li>
            <li>Возврат</li>
            <li>Политика конфиденциальности</li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold uppercase text-white/80">Информационный бюллетень</p>
          <div className="flex gap-2">
            <input
              type="email"
              readOnly
              placeholder="Введите адрес электронной почты"
              className="flex-1 rounded border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50"
            />
            <button type="button" className="rounded bg-white px-3 py-2 text-xs font-semibold text-black hover:bg-white/90">
              ПОДПИСАТЬСЯ
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-white/10 px-4 py-4 text-xs text-white/70">
        2026 Платформа авторских проектов. Все права защищены.
      </div>
    </footer>
  );
}