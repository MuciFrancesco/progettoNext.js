import { formatCurrency, resolveProductImageSrc } from '@/lib/shop/format';
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

  return items.map((item) => ({
    productId: item.product.id,
    title: item.product.title,
    imageSrc: resolveProductImageSrc(item.product.imagePath),
    quantity: item.quantity,
    maxQuantity: item.product.stockQuantity,
    unitPriceLabel: `${formatCurrency(item.product.priceInCents, locale)} ${unitSuffix}`,
    lineTotalLabel: formatCurrency(item.product.priceInCents * item.quantity, locale),
  }));
}
