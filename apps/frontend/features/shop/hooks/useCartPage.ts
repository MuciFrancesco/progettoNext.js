'use client';

import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import { useCart } from '@/providers/CartProvider';

export function useCartPage(locale: Locale) {
  const t = createTranslator(locale);
  const cart = useCart();

  return {
    ...cart,
    locale,
    hasItems: cart.items.length > 0,
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
    },
  };
}
