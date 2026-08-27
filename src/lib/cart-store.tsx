import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { listingFor } from "@/data/catalog";
import { trackActiveEvent } from "@/lib/event-tracker";
import { useAuth } from "@/lib/auth-store";
import {
  upsertCartItemFn,
  removeCartItemFn,
  clearCartItemsFn,
  listCartItemsFn,
} from "@/lib/db-server";

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
  const { user, hydrated } = useAuth();

  // Hydrate from localStorage once on mount, then merge remote items when logged in
  useEffect(() => {
    const local = readFromStorage();
    setItems(local);
  }, []);

  // After auth hydrates and user is known, fetch remote cart and merge
  useEffect(() => {
    if (!hydrated || !user?.id) return;

    listCartItemsFn({ data: { user_id: user.id } })
      .then((res) => {
        try {
          const remoteRows = JSON.parse(res.json || "[]") as Array<{ listing_id: string }>;
          if (!Array.isArray(remoteRows) || remoteRows.length === 0) return;

          setItems((prev) => {
            const merged = new Map<string, CartItem>();
            // Local takes precedence for optimistic UX
            prev.forEach((i) => merged.set(i.listingId, i));
            remoteRows.forEach((r) => {
              if (!merged.has(r.listing_id)) {
                merged.set(r.listing_id, { listingId: r.listing_id });
              }
            });
            const next = Array.from(merged.values());
            writeToStorage(next);
            return next;
          });
        } catch {
          // ignore parse errors
        }
      })
      .catch(() => {
        // ignore — table may not exist yet
      });
  }, [hydrated, user?.id]);

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

      // Background Supabase sync (fails silently when table absent)
      if (user?.id) {
        upsertCartItemFn({ data: { user_id: user.id, listing_id: listingId } }).catch(() => {});
      }

      trackActiveEvent({
        eventType: "CART_ADDED",
        entityType: "listing",
        entityId: listingId,
      }).catch(() => {});
    },
    [user?.id],
  );

  const removeFromCart = useCallback(
    (listingId: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.listingId !== listingId);
        writeToStorage(next);
        return next;
      });

      // Background Supabase sync
      if (user?.id) {
        removeCartItemFn({ data: { user_id: user.id, listing_id: listingId } }).catch(() => {});
      }

      trackActiveEvent({
        eventType: "CART_REMOVED",
        entityType: "listing",
        entityId: listingId,
      }).catch(() => {});
    },
    [user?.id],
  );

  const clearCart = useCallback(() => {
    persist([]);

    // Background Supabase sync
    if (user?.id) {
      clearCartItemsFn({ data: { user_id: user.id } }).catch(() => {});
    }
  }, [persist, user?.id]);

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

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
