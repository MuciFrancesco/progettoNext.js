'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchProductStatuses } from '@/lib/api/product-status-client';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import type { BackendProduct, ProductCategory } from '@/types/api/product';
import { PRODUCT_CATEGORIES } from '@/types/api/product';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import { useCart } from '@/providers/CartProvider';
import { APP_NAME } from '@/lib/constants';
import { mergeProductsWithStatuses } from '@/providers/cart-stock';

export type ProductCatalogCategoryOption = {
  readonly value: ProductCategory | 'ALL';
  readonly label: string;
};

type UseProductCatalogOptions = {
  readonly initialQuery?: string;
  readonly initialCategory?: ProductCategory | 'ALL';
};

export function useProductCatalog(
  products: BackendProduct[],
  locale: Locale,
  options: Readonly<UseProductCatalogOptions> = {}
) {
  const t = useMemo(() => createTranslator(locale), [locale]);
  const { syncWithProducts, syncWithProductStatuses } = useCart();
  const [query, setQuery] = useState(options.initialQuery ?? '');
  const [category, setCategory] = useState<ProductCategory | 'ALL'>(options.initialCategory ?? 'ALL');
  const [liveProducts, setLiveProducts] = useState(products);
  const liveProductsRef = useRef(products);

  useEffect(() => {
    setQuery(options.initialQuery ?? '');
  }, [options.initialQuery]);

  useEffect(() => {
    setCategory(options.initialCategory ?? 'ALL');
  }, [options.initialCategory]);

  useEffect(() => {
    liveProductsRef.current = liveProducts;
  }, [liveProducts]);

  useEffect(() => {
    liveProductsRef.current = products;
    setLiveProducts(products);
    syncWithProducts(products);
  }, [products, syncWithProducts]);

  const refreshProducts = useCallback(
    async (ids?: readonly string[]) => {
      const targetIds = ids ?? liveProductsRef.current.map((product) => product.id);
      if (targetIds.length === 0) return [];

      const statuses = await fetchProductStatuses(targetIds);
      setLiveProducts((current) => {
        const merged = mergeProductsWithStatuses(current, statuses);
        liveProductsRef.current = merged;
        return merged;
      });
      syncWithProductStatuses(statuses);
      return statuses;
    },
    [syncWithProductStatuses]
  );

  const refreshProduct = useCallback(
    async (productId: string) => {
      const statuses = await fetchProductStatuses([productId]);
      if (statuses.length === 0) {
        return liveProductsRef.current.find((item) => item.id === productId);
      }

      let nextProduct: BackendProduct | undefined;
      setLiveProducts((current) => {
        const merged = mergeProductsWithStatuses(current, statuses);
        liveProductsRef.current = merged;
        nextProduct = merged.find((item) => item.id === productId);
        return merged;
      });
      syncWithProductStatuses(statuses);
      return nextProduct;
    },
    [syncWithProductStatuses]
  );

  useEffect(() => {
    void refreshProducts(products.map((product) => product.id)).catch(() => undefined);
  }, [products, refreshProducts]);

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
    return liveProducts.filter((product) => {
      const matchesCategory = category === 'ALL' || product.category === category;
      const haystack = `${product.title} ${product.name} ${product.description}`.toLowerCase();
      return matchesCategory && (!needle || haystack.includes(needle));
    });
  }, [category, liveProducts, query]);

  return {
    labels: {
      brand: APP_NAME,
      heroEyebrow: t('homeHeroEyebrow'),
      heroTitle: t('homeHeroTitle'),
      heroSubtitle: t('homeHeroSubtitle'),
      heroPrimaryCta: t('homeHeroPrimaryCta'),
      heroSecondaryCta: t('homeHeroSecondaryCta'),
      heroSectionAria: t('homeHeroSectionAria'),
      quickCategoriesAria: t('homeQuickCategoriesAria'),
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
    refreshProduct,
    setCategory,
    setQuery,
  };
}
