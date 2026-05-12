// ─── Cart Context ────────────────────────────────────────────────────────────
// SRP: State management only — storage, API sync, and UI are separated
// DRY: Single source of truth for cart state via useReducer
// Testability: reduceCartItems is a pure function testable without React

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
import type { BackendProduct, ProductStatusSnapshot } from '@/types/api/product';
import { getEffectivePriceInCents } from '@/lib/shop/pricing';
import { productsService } from '@/services/products';
import { CART_STORAGE_KEY } from '@/utils/constants';

// ─── Public Types ───────────────────────────────────────────────────────────

export type CartItem = {
  readonly product: BackendProduct;
  readonly quantity: number;
};

export type CartStockAlert = {
  readonly productId: string;
  readonly productTitle: string;
  readonly kind: 'removed' | 'reduced';
  readonly requestedQuantity: number;
  readonly availableQuantity: number;
};

// ─── State ──────────────────────────────────────────────────────────────────

type CartState = {
  readonly items: CartItem[];
  readonly stockAlerts: CartStockAlert[];
  readonly isLoaded: boolean;
};

const INITIAL_STATE: CartState = {
  items: [],
  stockAlerts: [],
  isLoaded: false,
};

// ─── Actions ────────────────────────────────────────────────────────────────

type CartAction =
  | { type: 'ADD_ITEM'; product: BackendProduct }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'SYNC_WITH_PRODUCTS'; products: BackendProduct[] }
  | { type: 'SYNC_WITH_STATUSES'; statuses: ProductStatusSnapshot[] }
  | { type: 'CLEAR_CART' }
  | { type: 'CLEAR_ALERTS' }
  | { type: 'LOAD_FROM_STORAGE'; items: CartItem[] };

// ─── Pure Reducer (testabile senza React) ────────────────────────────────────

function clampQuantity(quantity: number, maxStock: number): number {
  return Math.max(0, Math.min(Math.round(quantity), maxStock));
}

function reduceCartItems(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: clampQuantity(i.quantity + 1, action.product.stockQuantity) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { product: action.product, quantity: 1 }] };
    }

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.product.id !== action.productId),
        };
      }
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.product.id === action.productId
              ? {
                  ...i,
                  quantity: clampQuantity(action.quantity, i.product.stockQuantity),
                }
              : i
          )
          .filter((i) => i.quantity > 0),
      };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((i) => i.product.id !== action.productId),
      };

    case 'SYNC_WITH_PRODUCTS': {
      const productMap = new Map(action.products.map((p) => [p.id, p]));
      return {
        ...state,
        items: state.items
          .map((item) => {
            const freshProduct = productMap.get(item.product.id);
            if (
              !freshProduct ||
              !freshProduct.isAvailableForPurchase ||
              freshProduct.stockQuantity <= 0
            ) {
              return null;
            }
            return {
              product: freshProduct,
              quantity: clampQuantity(item.quantity, freshProduct.stockQuantity),
            };
          })
          .filter((item): item is CartItem => item !== null),
      };
    }

    case 'SYNC_WITH_STATUSES': {
      const statusMap = new Map(action.statuses.map((s) => [s.id, s]));
      const newAlerts: CartStockAlert[] = [];
      const nextItems = state.items
        .map((item) => {
          const status = statusMap.get(item.product.id);
          if (!status) return item;

          if (!status.isAvailableForPurchase || status.stockQuantity <= 0) {
            newAlerts.push({
              productId: item.product.id,
              productTitle: item.product.title,
              kind: 'removed',
              requestedQuantity: item.quantity,
              availableQuantity: 0,
            });
            return null;
          }

          const capped = clampQuantity(item.quantity, status.stockQuantity);
          if (capped < item.quantity) {
            newAlerts.push({
              productId: item.product.id,
              productTitle: item.product.title,
              kind: 'reduced',
              requestedQuantity: item.quantity,
              availableQuantity: capped,
            });
          }

          return {
            ...item,
            product: {
              ...item.product,
              stockQuantity: status.stockQuantity,
              isAvailableForPurchase: true,
            } as BackendProduct,
            quantity: capped,
          };
        })
        .filter((item): item is CartItem => item !== null);

      return {
        ...state,
        items: nextItems,
        stockAlerts: [...state.stockAlerts, ...newAlerts],
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [], stockAlerts: [] };

    case 'CLEAR_ALERTS':
      return { ...state, stockAlerts: [] };

    case 'LOAD_FROM_STORAGE':
      return { ...state, items: action.items, isLoaded: true };

    default:
      return state;
  }
}

// ─── Storage Helpers ────────────────────────────────────────────────────────

function sanitizeStoredItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (item): item is CartItem =>
        Boolean(item?.product?.id) &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
    )
    .map((item) => ({
      product: item.product,
      quantity: clampQuantity(item.quantity, item.product.stockQuantity ?? 999),
    }));
}

function loadFromStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    return raw ? sanitizeStoredItems(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

function persistToStorage(items: CartItem[]): void {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage unavailable — fail silently
  }
}

// ─── Context Value ──────────────────────────────────────────────────────────

type CartContextValue = {
  readonly items: CartItem[];
  readonly totalQuantity: number;
  readonly totalInCents: number;
  readonly stockAlerts: CartStockAlert[];
  readonly isLoaded: boolean;
  readonly addItem: (product: BackendProduct) => void;
  readonly updateQuantity: (productId: string, quantity: number) => void;
  readonly removeItem: (productId: string) => void;
  readonly clearCart: () => void;
  readonly clearAlerts: () => void;
  readonly syncWithProducts: (products: BackendProduct[]) => void;
  readonly syncWithStatuses: (statuses: ProductStatusSnapshot[]) => void;
  readonly refreshItemStock: (productId: string) => Promise<ProductStatusSnapshot | undefined>;
  readonly refreshAllStock: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function CartProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [state, dispatch] = useReducer(reduceCartItems, INITIAL_STATE);

  // Load from localStorage on mount
  useEffect(() => {
    const storedItems = loadFromStorage();
    dispatch({ type: 'LOAD_FROM_STORAGE', items: storedItems });
  }, []);

  // Persist to localStorage on every change after initial load
  useEffect(() => {
    if (state.isLoaded) {
      persistToStorage(state.items);
    }
  }, [state.items, state.isLoaded]);

  const addItem = useCallback(
    (product: BackendProduct) => dispatch({ type: 'ADD_ITEM', product }),
    []
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) =>
      dispatch({ type: 'UPDATE_QUANTITY', productId, quantity }),
    []
  );

  const removeItem = useCallback(
    (productId: string) => dispatch({ type: 'REMOVE_ITEM', productId }),
    []
  );

  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const clearAlerts = useCallback(() => dispatch({ type: 'CLEAR_ALERTS' }), []);

  const syncWithProducts = useCallback(
    (products: BackendProduct[]) => dispatch({ type: 'SYNC_WITH_PRODUCTS', products }),
    []
  );

  const syncWithStatuses = useCallback(
    (statuses: ProductStatusSnapshot[]) =>
      dispatch({ type: 'SYNC_WITH_STATUSES', statuses }),
    []
  );

  const refreshItemStock = useCallback(
    async (productId: string) => {
      const statuses = await productsService.fetchStatuses([productId]);
      if (statuses.length > 0) {
        syncWithStatuses(statuses);
        return statuses[0];
      }
      return undefined;
    },
    [syncWithStatuses]
  );

  const refreshAllStock = useCallback(async () => {
    if (state.items.length === 0) return;
    const ids = state.items.map((item) => item.product.id);
    const statuses = await productsService.fetchStatuses(ids);
    if (statuses.length > 0) {
      syncWithStatuses(statuses);
    }
  }, [state.items, syncWithStatuses]);

  const value = useMemo<CartContextValue>(() => {
    const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalInCents = state.items.reduce(
      (sum, item) => sum + getEffectivePriceInCents(item.product) * item.quantity,
      0
    );
    return {
      items: state.items,
      totalQuantity,
      totalInCents,
      stockAlerts: state.stockAlerts,
      isLoaded: state.isLoaded,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      clearAlerts,
      syncWithProducts,
      syncWithStatuses,
      refreshItemStock,
      refreshAllStock,
    };
  }, [
    state.items,
    state.stockAlerts,
    state.isLoaded,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    clearAlerts,
    syncWithProducts,
    syncWithStatuses,
    refreshItemStock,
    refreshAllStock,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}
