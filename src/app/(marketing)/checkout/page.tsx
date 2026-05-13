import { CheckoutOrderSummary } from "@/components/checkout-order-summary";

export default function CheckoutPage() {
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
          <button type="button" className="rounded bg-[#32495e] px-5 py-3 text-sm font-semibold text-white">
            Разместить заказ
          </button>
        </form>

        <CheckoutOrderSummary />
      </div>
    </div>
  );
}
