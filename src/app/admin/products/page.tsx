import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProductForm } from "./product-form";
import { SiteHeader } from "@/components/site-header";
import { CartProvider } from "@/context/cart-context";

export default async function AdminProductsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?callbackUrl=/admin/products");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <CartProvider>
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-4xl font-black uppercase">Админ-панель товаров</h1>
        <p className="mt-2 text-sm text-charcoal/70">Создание, редактирование, удаление и модерация для роли admin.</p>
        <div className="mt-6">
          <ProductForm />
        </div>
      </div>
    </CartProvider>
  );
}
