'use client';

import { Cart } from '@/components/Cart/Cart';
import type { Locale } from '@/lib/i18n/translation';
import { formatCurrency, resolveProductImageSrc } from '@/lib/shop/format';
import { useCartPage } from '@/features/shop/hooks/useCartPage';

export function CartFeature({ locale }: Readonly<{ locale: Locale }>) {
  const cart = useCartPage(locale);
  const items = cart.items.map((item) => ({
    productId: item.product.id,
    title: item.product.title,
    imageSrc: resolveProductImageSrc(item.product.imagePath),
    quantity: item.quantity,
    maxQuantity: item.product.stockQuantity,
    unitPriceLabel: `${formatCurrency(item.product.priceInCents, cart.locale)} ${cart.labels.unitSuffix}`,
    lineTotalLabel: formatCurrency(item.product.priceInCents * item.quantity, cart.locale),
  }));

  return (
    <Cart
      items={items}
      totalLabel={formatCurrency(cart.totalInCents, cart.locale)}
      hasItems={cart.hasItems}
      labels={cart.labels}
      stockAlerts={cart.stockAlerts}
      quantityWarnings={cart.quantityWarnings}
      onQuantityChange={cart.updateQuantityWithStockCheck}
      onRemove={cart.removeItem}
    />
  );
}
