'use client';

import Box from '@mui/material/Box';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import { formatCurrency, resolveProductImageSrc } from '@/lib/shop/format';
import { getEffectivePriceInCents } from '@/lib/shop/pricing';
import type { BackendProduct } from '@/types/api/product';
import styles from '@/app/search/page.module.scss';

type SearchResultsGridProps = {
  readonly products: readonly BackendProduct[];
  readonly locale: Locale;
};

export function SearchResultsGrid({ products, locale }: Readonly<SearchResultsGridProps>) {
  const t = createTranslator(locale);

  return (
    <Box className={styles.productGrid}>
      {products.map((product) => {
        const effectivePrice = getEffectivePriceInCents(product);
        return (
          <ProductCard
            key={product.id}
            card={{
              product,
              href: `/product/${product.id}`,
              imageSrc: resolveProductImageSrc(product.imagePath),
              categoryLabel: t(categoryTranslationKey(product.category)),
              priceLabel: formatCurrency(effectivePrice, locale),
              originalPriceLabel:
                product.isInSale && product.salePriceInCents
                  ? formatCurrency(product.priceInCents, locale)
                  : undefined,
              saleBadge:
                product.isInSale && product.saleDiscountPercent
                  ? t('productSaleBadge', { percent: product.saleDiscountPercent })
                  : undefined,
              stockLabel: `${t('catalogStock')}: ${product.stockQuantity}`,
            }}
            labels={{
              brand: product.brand ?? t('appName'),
              addToCart: t('cartAddItem'),
              decreaseQuantity: t('cartDecreaseQuantity'),
              increaseQuantity: t('cartIncreaseQuantity'),
              removeFromCart: t('cartRemoveItem'),
              unavailable: t('productUnavailable'),
            }}
          />
        );
      })}
    </Box>
  );
}
