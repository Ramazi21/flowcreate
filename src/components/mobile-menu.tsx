"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { createPortal } from "react-dom";

interface NavItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  nav: NavItem[];
  isAdmin: boolean;
  user: any;
  cartCount?: number;
}

export function MobileMenu({ nav, isAdmin, user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuContent = (
    <>
      <div 
        className="fixed inset-0 z-[100] bg-black"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed inset-y-0 left-0 z-[101] w-[320px] bg-black shadow-2xl border-r-4 border-white">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/20">
            <span className="text-xl font-black text-white">МЕНЮ</span>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8">
            <div className="flex flex-col gap-6 text-lg font-bold uppercase tracking-wider text-white">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-gray-300 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-5 pt-8 border-t border-white/10 text-sm font-semibold text-white/70">
              {isAdmin && (
                <Link href="/admin/products" onClick={() => setIsOpen(false)} className="hover:text-gray-300">
                  Админ-панель
                </Link>
              )}
              {user ? (
                <>
                  <Link href="/account" onClick={() => setIsOpen(false)} className="hover:text-gray-300">
                    Личный кабинет
                  </Link>
                  <Link href="/account" onClick={() => setIsOpen(false)} className="hover:text-gray-300">
                    Мои работы
                  </Link>
                  <button 
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="text-left hover:text-red-400 transition-colors uppercase tracking-wider text-xs font-black"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" onClick={() => setIsOpen(false)} className="hover:text-gray-300">
                    Войти
                  </Link>
                </>
              )}
            </div>
          </nav>

          <div className="p-6 border-t border-white/10 text-[10px] uppercase tracking-widest text-white/40 font-bold">
            © 2026 ПАП
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 -ml-2 text-charcoal"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        )}
      </button>

      {isOpen && typeof window !== 'undefined' && createPortal(menuContent, document.body)}
    </div>
  );
}
