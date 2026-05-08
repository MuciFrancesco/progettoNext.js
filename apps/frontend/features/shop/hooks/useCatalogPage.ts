'use client';

import { useCallback, useMemo } from 'react';
import { buildQuickCategories } from '@/features/shop/helpers/quickCategories';
import { mapCatalogHero } from '@/features/shop/helpers/mapCatalogHero';
import { mapSubcategories } from '@/features/shop/helpers/mapSubcategories';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import type {
  BackendProduct,
  CatalogHeroSlide,
  CatalogSubcategory,
  ProductCategory,
} from '@/types/api/product';
import { useProductCatalog } from '@/features/shop/hooks/useProductCatalog';
import { useHeroSlideshow } from '@/features/shop/hooks/useHeroSlideshow';
import { useCart } from '@/store/CartContext';

type UseCatalogPageOptions = {
  readonly products: BackendProduct[];
  readonly locale: Locale;
  readonly initialQuery?: string;
  readonly initialCategory?: ProductCategory | 'ALL';
  readonly heroSlides: CatalogHeroSlide[];
  readonly catalogTitle?: string;
  readonly catalogSubtitle?: string;
  readonly quickCategoriesFromBackend?: ReadonlyArray<{
    readonly category: ProductCategory;
    readonly slug: string;
    readonly label: string;
  }>;
  readonly subcategories?: readonly CatalogSubcategory[];
  readonly selectedSubcategorySlug?: string;
};

export function useCatalogPage(options: Readonly<UseCatalogPageOptions>) {
  const {
    products,
    locale,
    initialQuery,
    initialCategory,
    heroSlides,
    catalogTitle,
    catalogSubtitle,
    quickCategoriesFromBackend,
    subcategories = [],
    selectedSubcategorySlug,
  } = options;

  const catalog = useProductCatalog(products, locale, { initialQuery, initialCategory });
  const t = createTranslator(catalog.locale);

  const activeHero = useHeroSlideshow(heroSlides, {
    fallbackSlide: {
      category: 'OTHER' as const,
      slug: 'altro',
      label: t('appName'),
      title: catalog.labels.heroTitle,
      subtitle: catalog.labels.heroSubtitle,
      imagePath: '/uploads/thinkshop/heroes/altro.svg',
    },
  });

  const quickCategories = useMemo(
    () => buildQuickCategories(quickCategoriesFromBackend, catalog.categoryOptions),
    [quickCategoriesFromBackend, catalog.categoryOptions]
  );

  const heroData = mapCatalogHero(activeHero);

  const mappedSubcategories = mapSubcategories(subcategories, selectedSubcategorySlug);

  const labels = {
    ...catalog.labels,
    title: catalogTitle ?? catalog.labels.title,
    subtitle: catalogSubtitle ?? catalog.labels.subtitle,
  };

  // ── Carrello ─────────────────────────────────────────────────────────

  const { items, addItem, updateQuantity, removeItem } = useCart();

  const getCartQuantity = useCallback(
    (productId: string) => items.find((i) => i.product.id === productId)?.quantity ?? 0,
    [items]
  );

  const handleDecrease = useCallback(
    (productId: string) => {
      const existing = items.find((i) => i.product.id === productId);
      const currentQty = existing?.quantity ?? 1;
      if (currentQty <= 1) {
        removeItem(productId);
        return;
      }
      updateQuantity(productId, currentQty - 1);
    },
    [items, removeItem, updateQuantity]
  );

  const handleIncrease = useCallback(
    (productId: string, maxStock: number) => {
      const existing = items.find((i) => i.product.id === productId);
      const nextQty = (existing?.quantity ?? 0) + 1;
      updateQuantity(productId, Math.min(nextQty, maxStock));
    },
    [items, updateQuantity]
  );

  return {
    /** Prodotti filtrati / query / categoria dall'hook base */
    catalog,
    /** Traduttore */
    t,
    /** Hero slideshow (hook) */
    activeHero,
    /** Categorie rapide costruite */
    quickCategories,
    /** Dati hero per ProductCatalogHero */
    heroData,
    /** Sottocategorie mappate */
    mappedSubcategories,
    /** Labels con override */
    labels,
    /** Quantità di un prodotto nel carrello */
    getCartQuantity,
    /** Aggiunge un prodotto al carrello */
    onCartAdd: addItem,
    /** Decrementa / rimuove un prodotto dal carrello */
    handleDecrease,
    /** Incrementa un prodotto nel carrello (con max stock) */
    handleIncrease,
    /** Rimuove un prodotto dal carrello */
    onCartRemove: removeItem,
  };
}
