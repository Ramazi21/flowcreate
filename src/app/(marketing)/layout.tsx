import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SupportChat } from "@/components/support-chat";
import { CartProvider } from "@/context/cart-context";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <SiteHeader />
      <main className="min-h-[60vh] bg-white overflow-x-hidden">{children}</main>
      <SiteFooter />
      <SupportChat />
    </CartProvider>
  );
}