'use client';
import { useCallback, useState } from 'react';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import { useCart } from '@/providers/CartProvider';

export function useCartPage(locale: Locale) {
  const t = createTranslator(locale);
  const cart = useCart();
  const [quantityWarnings, setQuantityWarnings] = useState<Record<string, string>>({});

  const showMaxWarning = useCallback(
    (productId: string, maxQuantity: number) => {
      setQuantityWarnings((current) => ({
        ...current,
        [productId]: t('cartStockMaxReached').replace('{quantity}', String(maxQuantity)),
      }));
      window.setTimeout(() => {
        setQuantityWarnings((current) => {
          const next = { ...current };
          delete next[productId];
          return next;
        });
      }, 2800);
    },
    [t]
  );

  const updateQuantityWithStockCheck = useCallback(
    async (productId: string, quantity: number) => {
      const item = cart.items.find((cartItem) => cartItem.product.id === productId);
      if (!item) return;

      if (quantity <= 0) {
        cart.updateQuantity(productId, quantity);
        return;
      }

      const status = await cart.refreshProductStock(productId).catch(() => undefined);
      const maxQuantity = Math.max(
        0,
        status?.isAvailableForPurchase === false ? 0 : status?.stockQuantity ?? item.product.stockQuantity
      );

      if (maxQuantity <= 0) {
        cart.updateQuantity(productId, 0);
        return;
      }

      if (quantity > maxQuantity) {
        cart.updateQuantity(productId, maxQuantity);
        showMaxWarning(productId, maxQuantity);
        return;
      }

      cart.updateQuantity(productId, quantity);
    },
    [cart, showMaxWarning]
  );

  const stockAlerts = cart.stockAlerts.map((alert) => ({
    productId: alert.productId,
    message:
      alert.kind === 'removed'
        ? t('cartStockRemoved').replace('{product}', alert.productTitle)
        : t('cartStockReduced')
            .replace('{product}', alert.productTitle)
            .replace('{quantity}', String(alert.availableQuantity)),
  }));

  return {
    ...cart,
    locale,
    hasItems: cart.items.length > 0,
    stockAlerts,
    quantityWarnings,
    updateQuantityWithStockCheck,
    labels: {
      title: t('cartTitle'),
      subtitle: t('cartSubtitle'),
      empty: t('cartEmpty'),
      goToCatalog: t('cartGoToCatalog'),
      quantity: t('cartQuantity'),
      remove: t('cartRemoveItem'),
      total: t('cartTotal'),
      items: t('cartItems'),
      checkout: t('cartCheckout'),
      unitSuffix: t('cartUnitSuffix'),
      maxStockReached: t('cartStockMaxReached'),
    },
  };
}
