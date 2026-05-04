'use client';

import { Cart } from '@/components/Cart/Cart';
import type { Locale } from '@/lib/i18n/translation';
import { useCartPage } from '../hooks/useCartPage';

export function CartFeature({ locale }: Readonly<{ locale: Locale }>) {
  const cart = useCartPage(locale);

  return (
    <Cart
      items={cart.items}
      totalInCents={cart.totalInCents}
      hasItems={cart.hasItems}
      labels={cart.labels}
      locale={cart.locale}
      onQuantityChange={cart.updateQuantity}
      onRemove={cart.removeItem}
    />
  );
}
