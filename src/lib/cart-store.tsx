import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { listingFor } from "@/data/catalog";

export interface CartItem {
  listingId: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (listingId: string) => void;
  removeFromCart: (listingId: string) => void;
  clearCart: () => void;
  isInCart: (listingId: string) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "resale.cart";

function readFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    setItems(readFromStorage());
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    writeToStorage(next);
  }, []);

  const addToCart = useCallback(
    (listingId: string) => {
      setItems((prev) => {
        if (prev.some((i) => i.listingId === listingId)) return prev;
        const next = [...prev, { listingId }];
        writeToStorage(next);
        return next;
      });
    },
    [],
  );

  const removeFromCart = useCallback(
    (listingId: string) => {
      const next = items.filter((i) => i.listingId !== listingId);
      persist(next);
    },
    [items, persist],
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const isInCart = useCallback(
    (listingId: string) => items.some((i) => i.listingId === listingId),
    [items],
  );

  const subtotal = items.reduce((acc, item) => {
    const listing = listingFor(item.listingId);
    return acc + (listing?.price ?? 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: items.length,
        subtotal,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
