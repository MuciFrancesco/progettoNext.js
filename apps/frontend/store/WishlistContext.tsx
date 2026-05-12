'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import type { BackendProduct } from '@/types/api/product';

// ─── Types ───────────────────────────────────────────────────────────────────

export type WishlistItem = {
  readonly productId: string;
  readonly product: BackendProduct;
  readonly quantity: number;
};

type WishlistState = {
  readonly items: WishlistItem[];
  readonly isLoaded: boolean;
};

// ─── Actions ────────────────────────────────────────────────────────────────

type WishlistAction =
  | { type: 'LOAD'; items: WishlistItem[] }
  | { type: 'ADD'; item: WishlistItem }
  | { type: 'REMOVE'; productId: string };

function reduceWishlist(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case 'LOAD':
      return { items: action.items, isLoaded: true };
    case 'ADD': {
      const already = state.items.some((i) => i.productId === action.item.productId);
      if (already) return state;
      return { ...state, items: [...state.items, action.item] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.productId !== action.productId) };
    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

type WishlistContextValue = {
  readonly items: WishlistItem[];
  readonly isLoaded: boolean;
  readonly isInWishlist: (productId: string) => boolean;
  readonly addItem: (product: BackendProduct, quantity: number) => Promise<void>;
  readonly removeItem: (productId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

type WishlistResponse = { productId: string; product: BackendProduct; quantity: number }[];

export function WishlistProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [state, dispatch] = useReducer(reduceWishlist, { items: [], isLoaded: false });

  useEffect(() => {
    fetch('/api/favorites', { cache: 'no-store' })
      .then((res) => (res.ok ? (res.json() as Promise<WishlistResponse>) : Promise.resolve([])))
      .then((data) => {
        const items: WishlistItem[] = Array.isArray(data)
          ? data.map((entry) => ({ productId: entry.productId, product: entry.product, quantity: entry.quantity ?? 1 }))
          : [];
        dispatch({ type: 'LOAD', items });
      })
      .catch(() => dispatch({ type: 'LOAD', items: [] }));
  }, []);

  const addItem = useCallback(async (product: BackendProduct, quantity: number) => {
    dispatch({ type: 'ADD', item: { productId: product.id, product, quantity } });
    try {
      await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
    } catch {
      dispatch({ type: 'REMOVE', productId: product.id });
    }
  }, []);

  const removeItem = useCallback(
    async (productId: string) => {
      const snapshot = state.items.find((i) => i.productId === productId);
      dispatch({ type: 'REMOVE', productId });
      try {
        await fetch(`/api/favorites/${productId}`, { method: 'DELETE' });
      } catch {
        if (snapshot) dispatch({ type: 'ADD', item: snapshot });
      }
    },
    [state.items]
  );

  const isInWishlist = useCallback(
    (productId: string) => state.items.some((i) => i.productId === productId),
    [state.items]
  );

  const value = useMemo<WishlistContextValue>(
    () => ({ items: state.items, isLoaded: state.isLoaded, isInWishlist, addItem, removeItem }),
    [state.items, state.isLoaded, isInWishlist, addItem, removeItem]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider');
  return context;
}
