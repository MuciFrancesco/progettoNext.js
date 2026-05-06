// ─── useCartPage Hook ────────────────────────────────────────────────────────
// SRP: Cart page business logic — stock validation, quantity warnings, i18n
// DIP: Uses CartContext, not raw fetch
// DRY: Stock check + auto-dismiss warning pattern encapsulated once

'use client';

import { useCallback, useState } from 'react';
import { useCart } from '@/store/CartContext';
import { CART_STOCK_WARNING_DURATION_MS } from '@/utils/constants';

export type StockAlertDisplay = {
  readonly productId: string;
  readonly message: string;
};

export type UseCartPageReturn = {
  readonly items: ReturnType<typeof useCart>['items'];
  readonly totalInCents: number;
  readonly totalQuantity: number;
  readonly stockAlerts: StockAlertDisplay[];
  readonly quantityWarnings: Record<string, string>;
  readonly hasItems: boolean;
  readonly isLoaded: boolean;
  readonly updateQuantityWithStockCheck: (productId: string, quantity: number) => Promise<void>;
  readonly removeItem: (productId: string) => void;
  readonly clearAlerts: () => void;
  readonly labels: {
    readonly title: string;
    readonly subtitle: string;
    readonly empty: string;
    readonly goToCatalog: string;
    readonly quantity: string;
    readonly remove: string;
    readonly total: string;
    readonly items: string;
    readonly checkout: string;
    readonly unitSuffix: string;
  };
};

export function useCartPage(
  translate: (key: string, params?: Record<string, string | number>) => string
): UseCartPageReturn {
  const cart = useCart();
  const [quantityWarnings, setQuantityWarnings] = useState<Record<string, string>>({});

  const dismissWarningAfterDelay = useCallback((productId: string) => {
    window.setTimeout(() => {
      setQuantityWarnings((current) => {
        const next = { ...current };
        delete next[productId];
        return next;
      });
    }, CART_STOCK_WARNING_DURATION_MS);
  }, []);

  const updateQuantityWithStockCheck = useCallback(
    async (productId: string, quantity: number) => {
      const item = cart.items.find((ci) => ci.product.id === productId);
      if (!item) return;

      if (quantity <= 0) {
        cart.updateQuantity(productId, quantity);
        return;
      }

      // Refresh live stock from backend
      const status = await cart.refreshItemStock(productId).catch(() => undefined);
      const maxQuantity = Math.max(
        0,
        status?.isAvailableForPurchase === false
          ? 0
          : (status?.stockQuantity ?? item.product.stockQuantity)
      );

      if (maxQuantity <= 0) {
        cart.updateQuantity(productId, 0);
        return;
      }

      if (quantity > maxQuantity) {
        cart.updateQuantity(productId, maxQuantity);
        setQuantityWarnings((current) => ({
          ...current,
          [productId]: translate('cartStockMaxReached').replace('{quantity}', String(maxQuantity)),
        }));
        dismissWarningAfterDelay(productId);
        return;
      }

      cart.updateQuantity(productId, quantity);
    },
    [cart, dismissWarningAfterDelay, translate]
  );

  const stockAlerts = cart.stockAlerts.map((alert) => ({
    productId: alert.productId,
    message:
      alert.kind === 'removed'
        ? translate('cartStockRemoved').replace('{product}', alert.productTitle)
        : translate('cartStockReduced')
            .replace('{product}', alert.productTitle)
            .replace('{quantity}', String(alert.availableQuantity)),
  }));

  return {
    items: cart.items,
    totalInCents: cart.totalInCents,
    totalQuantity: cart.totalQuantity,
    stockAlerts,
    quantityWarnings,
    hasItems: cart.items.length > 0,
    isLoaded: cart.isLoaded,
    updateQuantityWithStockCheck,
    removeItem: cart.removeItem,
    clearAlerts: cart.clearAlerts,
    labels: {
      title: translate('cartTitle'),
      subtitle: translate('cartSubtitle'),
      empty: translate('cartEmpty'),
      goToCatalog: translate('cartGoToCatalog'),
      quantity: translate('cartQuantity'),
      remove: translate('cartRemoveItem'),
      total: translate('cartTotal'),
      items: translate('cartItems'),
      checkout: translate('cartCheckout'),
      unitSuffix: translate('cartUnitSuffix'),
    },
  };
}
