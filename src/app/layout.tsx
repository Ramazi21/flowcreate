import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Noto_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flow Atelier — авторский декор",
  description:
    "Витрина предметов интерьера ручной работы. Временная вёрстка до финальных макетов.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans min-h-screen bg-cream text-charcoal antialiased">{children}</body>
    </html>
  );
}
