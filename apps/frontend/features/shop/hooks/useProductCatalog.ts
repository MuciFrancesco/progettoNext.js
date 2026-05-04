'use client';

import { useEffect, useMemo, useState } from 'react';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import type { BackendProduct, ProductCategory } from '@/types/api/product';
import { PRODUCT_CATEGORIES } from '@/types/api/product';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import { useCart } from '@/providers/CartProvider';

export type ProductCatalogCategoryOption = {
  readonly value: ProductCategory | 'ALL';
  readonly label: string;
};

export function useProductCatalog(products: BackendProduct[], locale: Locale) {
  const t = useMemo(() => createTranslator(locale), [locale]);
  const { syncWithProducts } = useCart();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'ALL'>('ALL');

  useEffect(() => {
    syncWithProducts(products);
  }, [products, syncWithProducts]);

  const categoryOptions = useMemo<ProductCatalogCategoryOption[]>(
    () => [
      { value: 'ALL', label: t('categoryAll') },
      ...PRODUCT_CATEGORIES.map((item) => ({
        value: item,
        label: t(categoryTranslationKey(item)),
      })),
    ],
    [t]
  );

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === 'ALL' || product.category === category;
      const haystack = `${product.title} ${product.name} ${product.description}`.toLowerCase();
      return matchesCategory && (!needle || haystack.includes(needle));
    });
  }, [category, products, query]);

  return {
    labels: {
      brand: 'ThinkShop',
      title: t('catalogTitle'),
      subtitle: t('catalogSubtitle'),
      search: t('catalogSearch'),
      empty: t('catalogEmpty'),
      stock: t('catalogStock'),
      addToCart: t('cartAddItem'),
      decreaseQuantity: t('cartDecreaseQuantity'),
      increaseQuantity: t('cartIncreaseQuantity'),
      removeFromCart: t('cartRemoveItem'),
      unavailable: t('productUnavailable'),
    },
    category,
    categoryOptions,
    filteredProducts,
    locale,
    query,
    setCategory,
    setQuery,
  };
}
