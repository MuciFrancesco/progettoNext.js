// ─── useProductCatalog Hook ──────────────────────────────────────────────────
// SRP: Pure business logic for product catalog — no UI code, no i18n inline
// DIP: Depends on ProductsService abstraction, not on fetch() directly
// DRY: Single source of truth for filtering, status refresh, query management

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BackendProduct, ProductCategory, ProductStatusSnapshot } from '@/types/api/product';
import { PRODUCT_CATEGORIES } from '@/types/api/product';
import { productsService } from '@/services/products';
import { categoryTranslationKey } from '@/utils/format';

// ─── Public Types ───────────────────────────────────────────────────────────

export type CatalogCategoryOption = {
  readonly value: ProductCategory | 'ALL';
  readonly label: string;
};

export type UseProductCatalogReturn = {
  readonly query: string;
  readonly category: ProductCategory | 'ALL';
  readonly categoryOptions: CatalogCategoryOption[];
  readonly filteredProducts: BackendProduct[];
  readonly setQuery: (value: string) => void;
  readonly setCategory: (value: ProductCategory | 'ALL') => void;
  readonly refreshProductStock: (productId: string) => Promise<BackendProduct | undefined>;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function mergeProductStatuses(
  products: BackendProduct[],
  statuses: ProductStatusSnapshot[]
): BackendProduct[] {
  if (statuses.length === 0) return products;
  const statusMap = new Map(statuses.map((s) => [s.id, s]));
  return products.map((product) => {
    const status = statusMap.get(product.id);
    if (!status) return product;
    return {
      ...product,
      stockQuantity: status.stockQuantity,
      isAvailableForPurchase: status.isAvailableForPurchase,
    };
  });
}

function matchesQuery(product: BackendProduct, needle: string): boolean {
  if (!needle) return true;
  const haystack = `${product.title} ${product.name} ${product.description}`.toLowerCase();
  return haystack.includes(needle);
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useProductCatalog(
  products: BackendProduct[],
  translate: (key: string) => string,
  options: {
    readonly initialQuery?: string;
    readonly initialCategory?: ProductCategory | 'ALL';
  } = {}
): UseProductCatalogReturn {
  const [query, setQuery] = useState(options.initialQuery ?? '');
  const [category, setCategory] = useState<ProductCategory | 'ALL'>(
    options.initialCategory ?? 'ALL'
  );
  const [liveProducts, setLiveProducts] = useState<BackendProduct[]>(products);
  const productsRef = useRef(products);

  // Sync with SSR props
  useEffect(() => {
    productsRef.current = products;
    setLiveProducts(products);
  }, [products]);

  useEffect(() => {
    setQuery(options.initialQuery ?? '');
  }, [options.initialQuery]);

  useEffect(() => {
    setCategory(options.initialCategory ?? 'ALL');
  }, [options.initialCategory]);

  // Fetch live stock statuses on mount
  useEffect(() => {
    const ids = products.map((p) => p.id);
    if (ids.length === 0) return;

    productsService
      .fetchStatuses(ids)
      .then((statuses) => {
        if (statuses.length > 0) {
          setLiveProducts((current) => mergeProductStatuses(current, statuses));
        }
      })
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshProductStock = useCallback(async (productId: string) => {
    const statuses = await productsService.fetchStatuses([productId]);
    if (statuses.length === 0) {
      return productsRef.current.find((p) => p.id === productId);
    }

    let result: BackendProduct | undefined;
    setLiveProducts((current) => {
      const merged = mergeProductStatuses(current, statuses);
      productsRef.current = merged;
      result = merged.find((p) => p.id === productId);
      return merged;
    });
    return result;
  }, []);

  const categoryOptions = useMemo<CatalogCategoryOption[]>(() => {
    return [
      { value: 'ALL', label: translate('categoryAll') },
      ...PRODUCT_CATEGORIES.map((cat) => ({
        value: cat,
        label: translate(categoryTranslationKey(cat)),
      })),
    ];
  }, [translate]);

  const filteredProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return liveProducts.filter((product) => {
      const matchesCategory =
        category === 'ALL' || product.category === category;
      return matchesCategory && matchesQuery(product, needle);
    });
  }, [category, liveProducts, query]);

  return {
    query,
    category,
    categoryOptions,
    filteredProducts,
    setQuery,
    setCategory,
    refreshProductStock,
  };
}
