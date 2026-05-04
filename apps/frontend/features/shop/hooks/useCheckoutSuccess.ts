'use client';

import { useEffect } from 'react';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import { useCart } from '@/providers/CartProvider';

export function useCheckoutSuccess(locale: Locale) {
  const t = createTranslator(locale);
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return {
    labels: {
      title: t('checkoutSuccessTitle'),
      subtitle: t('checkoutSuccessSubtitle'),
      backToCatalog: t('checkoutBackToCatalog'),
      orders: t('navPurchaseHistory'),
    },
  };
}
