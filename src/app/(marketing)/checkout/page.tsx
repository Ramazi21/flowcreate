import Image from "next/image";
import { works } from "@/lib/mock-data";

export default function CheckoutPage() {
  const item = works[2];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-4 text-sm text-charcoal/60">Корзина / Оформление заказа</div>
      <h1 className="mb-6 text-4xl font-black uppercase">Оформление заказа</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <form className="space-y-4 rounded-md border border-black/10 p-6">
          <h2 className="text-2xl font-black">Платежные реквизиты</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded border border-black/20 px-3 py-2" placeholder="Имя" />
            <input className="rounded border border-black/20 px-3 py-2" placeholder="Фамилия" />
          </div>
          <input className="w-full rounded border border-black/20 px-3 py-2" placeholder="Название компании (необязательно)" />
          <input className="w-full rounded border border-black/20 px-3 py-2" placeholder="Страна/регион" defaultValue="Россия" />
          <input className="w-full rounded border border-black/20 px-3 py-2" placeholder="Адрес улицы" />
          <div className="grid gap-4 md:grid-cols-3">
            <input className="rounded border border-black/20 px-3 py-2" placeholder="Город" />
            <input className="rounded border border-black/20 px-3 py-2" placeholder="Провинция" />
            <input className="rounded border border-black/20 px-3 py-2" placeholder="Почтовый индекс" />
          </div>
          <input className="w-full rounded border border-black/20 px-3 py-2" placeholder="Телефон" />
          <input className="w-full rounded border border-black/20 px-3 py-2" placeholder="Адрес электронной почты" />
          <textarea className="w-full rounded border border-black/20 px-3 py-2" rows={4} placeholder="Дополнительная информация" />
          <button type="button" className="rounded bg-[#32495e] px-5 py-3 text-sm font-semibold text-white">Разместить заказ</button>
        </form>

        <aside className="space-y-4 rounded-md border border-black/10 p-5">
          <h2 className="text-2xl font-black">Продукт</h2>
          <div className="flex items-center gap-3 border-b border-black/10 pb-4">
            <div className="relative h-16 w-16 overflow-hidden rounded">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="64px" />
            </div>
            <div>
              <p className="font-semibold">{item.name} x 1</p>
              <p className="text-sm text-charcoal/70">{item.price}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Итого</span><span>{item.price}</span></div>
            <div className="flex justify-between"><span>Общий</span><span>{item.price}</span></div>
            <div className="flex justify-between font-semibold"><span>Итого</span><span>{item.price}</span></div>
          </div>
          <div className="border-t border-black/10 pt-4 text-sm text-charcoal/70">
            <p className="font-semibold text-charcoal">Прямой банковский перевод</p>
            <p className="mt-2">
              Произведите оплату непосредственно на наш банковский счет. Ваш заказ не будет отправлен до поступления средств.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}