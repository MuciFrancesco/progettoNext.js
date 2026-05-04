'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchProductStatuses } from '@/lib/api/product-status-client';
import type { BackendProduct } from '@/types/api/product';
import type { ProductStatusSnapshot } from '@/types/api/product';
import {
  reconcileCartItemsWithStatuses,
  type CartStockAlert,
} from '@/providers/cart-stock';

export type CartItem = {
  readonly product: BackendProduct;
  readonly quantity: number;
};

type CartContextValue = {
  readonly items: CartItem[];
  readonly totalQuantity: number;
  readonly totalInCents: number;
  readonly stockAlerts: readonly CartStockAlert[];
  readonly addItem: (product: BackendProduct) => void;
  readonly updateQuantity: (productId: string, quantity: number) => void;
  readonly removeItem: (productId: string) => void;
  readonly syncWithProducts: (products: readonly BackendProduct[]) => void;
  readonly syncWithProductStatuses: (statuses: readonly ProductStatusSnapshot[]) => void;
  readonly refreshCartStock: () => Promise<void>;
  readonly clearStockAlerts: () => void;
  readonly clearCart: () => void;
};

const STORAGE_KEY = 'thinkshop-cart';
const CartContext = createContext<CartContextValue | null>(null);

function sanitizeItems(items: CartItem[]): CartItem[] {
  return items
    .filter((item) => item.product?.id && item.quantity > 0)
    .map((item) => ({
      product: item.product,
      quantity: Math.min(item.quantity, Math.max(1, item.product.stockQuantity)),
    }));
}

export function CartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [stockAlerts, setStockAlerts] = useState<CartStockAlert[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(sanitizeItems(JSON.parse(raw) as CartItem[]));
      }
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hasLoaded, items]);

  const addItem = useCallback((product: BackendProduct) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (!existing) return [...current, { product, quantity: 1 }];
      return current.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stockQuantity) }
          : item
      );
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((item) => item.product.id !== productId));
      return;
    }

    setItems((current) =>
      current
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: Math.min(quantity, Math.max(1, item.product.stockQuantity)),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }, []);

  const syncWithProducts = useCallback((products: readonly BackendProduct[]) => {
    const productsById = new Map(products.map((product) => [product.id, product]));
    setItems((current) =>
      current
        .map((item) => {
          const product = productsById.get(item.product.id);
          if (!product || !product.isAvailableForPurchase || product.stockQuantity <= 0) {
            return null;
          }

          return {
            product,
            quantity: Math.min(item.quantity, product.stockQuantity),
          };
        })
        .filter((item): item is CartItem => Boolean(item))
    );
  }, []);

  const syncWithProductStatuses = useCallback((statuses: readonly ProductStatusSnapshot[]) => {
    if (statuses.length === 0) return;

    setItems((current) => {
      const result = reconcileCartItemsWithStatuses(current, statuses);
      if (result.alerts.length > 0) {
        setStockAlerts((previous) => [...result.alerts, ...previous]);
      }
      return result.items;
    });
  }, []);

  const refreshCartStock = useCallback(async () => {
    if (items.length === 0) return;
    const statuses = await fetchProductStatuses(items.map((item) => item.product.id));
    syncWithProductStatuses(statuses);
  }, [items, syncWithProductStatuses]);

  const clearStockAlerts = useCallback(() => {
    setStockAlerts([]);
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalInCents = items.reduce(
      (sum, item) => sum + item.product.priceInCents * item.quantity,
      0
    );
    return {
      items,
      totalQuantity,
      totalInCents,
      stockAlerts,
      addItem,
      updateQuantity,
      removeItem,
      syncWithProducts,
      syncWithProductStatuses,
      refreshCartStock,
      clearStockAlerts,
      clearCart,
    };
  }, [
    addItem,
    clearCart,
    clearStockAlerts,
    items,
    refreshCartStock,
    removeItem,
    stockAlerts,
    syncWithProducts,
    syncWithProductStatuses,
    updateQuantity,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
