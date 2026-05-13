"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "flowcreate-cart-v1";

export type CartLine = {
  id: string;
  title: string;
  imageUrl: string;
  /** цена за единицу в рублях (целое число) */
  priceRub: number;
  quantity: number;
  /** макс. доступное количество (остаток на момент добавления) */
  maxStock: number;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotalRub: number;
  addItem: (input: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadFromStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is CartLine =>
        typeof row === "object" &&
        row !== null &&
        typeof (row as CartLine).id === "string" &&
        typeof (row as CartLine).title === "string" &&
        typeof (row as CartLine).imageUrl === "string" &&
        typeof (row as CartLine).priceRub === "number" &&
        typeof (row as CartLine).quantity === "number" &&
        typeof (row as CartLine).maxStock === "number",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const itemCount = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines]);
  const subtotalRub = useMemo(
    () => lines.reduce((sum, line) => sum + line.priceRub * line.quantity, 0),
    [lines],
  );

  const addItem = useCallback((input: Omit<CartLine, "quantity"> & { quantity?: number }) => {
    const qty = Math.max(1, input.quantity ?? 1);
    setLines((current) => {
      const existing = current.find((line) => line.id === input.id);
      if (existing) {
        const nextQty = Math.min(existing.maxStock, existing.quantity + qty);
        return current.map((line) =>
          line.id === input.id ? { ...line, quantity: nextQty } : line,
        );
      }
      const firstQty = Math.min(input.maxStock, qty);
      if (firstQty < 1) return current;
      return [
        ...current,
        {
          id: input.id,
          title: input.title,
          imageUrl: input.imageUrl,
          priceRub: input.priceRub,
          maxStock: input.maxStock,
          quantity: firstQty,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setLines((current) => current.filter((line) => line.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    const safe = Math.floor(Number.isFinite(quantity) ? quantity : 0);
    if (safe < 1) {
      removeItem(id);
      return;
    }
    setLines((current) =>
      current.map((line) => {
        if (line.id !== id) return line;
        return { ...line, quantity: Math.min(line.maxStock, safe) };
      }),
    );
  }, [removeItem]);

  const increment = useCallback((id: string) => {
    setLines((current) =>
      current.map((line) => {
        if (line.id !== id) return line;
        if (line.quantity >= line.maxStock) return line;
        return { ...line, quantity: line.quantity + 1 };
      }),
    );
  }, []);

  const decrement = useCallback((id: string) => {
    setLines((current) => {
      const next = current
        .map((line) => {
          if (line.id !== id) return line;
          const q = line.quantity - 1;
          return q < 1 ? null : { ...line, quantity: q };
        })
        .filter(Boolean) as CartLine[];
      return next;
    });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotalRub,
      addItem,
      removeItem,
      setQuantity,
      increment,
      decrement,
      clear,
    }),
    [lines, itemCount, subtotalRub, addItem, removeItem, setQuantity, increment, decrement, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
