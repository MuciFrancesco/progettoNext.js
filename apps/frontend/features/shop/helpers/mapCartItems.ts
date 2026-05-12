import { formatCurrency, resolveProductImageSrc } from '@/lib/shop/format';
import { getEffectivePriceInCents } from '@/lib/shop/pricing';
import type { Locale } from '@/lib/i18n/translation';
import type { CartItem } from '@/store/CartContext';
import type { CartItemViewModel } from '@/components/CartItem/CartItem';

type MapCartItemsOptions = Readonly<{
  locale: Locale;
  unitSuffix: string;
}>;

/**
 * Trasforma i CartItem del context in CartItemViewModel per la UI.
 * Pura trasformazione dati — nessun side effect.
 */
export function mapCartItemsToViewModels(
  items: CartItem[],
  options: MapCartItemsOptions
): CartItemViewModel[] {
  const { locale, unitSuffix } = options;

  return items.map((item) => {
    const unitPriceInCents = getEffectivePriceInCents(item.product);
    return {
      productId: item.product.id,
      title: item.product.title,
      imageSrc: resolveProductImageSrc(item.product.imagePath),
      quantity: item.quantity,
      maxQuantity: item.product.stockQuantity,
      unitPriceLabel: `${formatCurrency(unitPriceInCents, locale)} ${unitSuffix}`,
      lineTotalLabel: formatCurrency(unitPriceInCents * item.quantity, locale),
    };
  });
}
