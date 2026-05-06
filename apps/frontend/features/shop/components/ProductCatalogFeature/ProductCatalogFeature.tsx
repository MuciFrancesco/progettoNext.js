'use client';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import DevicesIcon from '@mui/icons-material/Devices';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SpaIcon from '@mui/icons-material/Spa';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import WeekendIcon from '@mui/icons-material/Weekend';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ProductCatalog } from '@/components/ProductCatalog/ProductCatalog';
import { AddToCartButton } from '@/components/AddToCartButton/AddToCartButton';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import { formatCurrency, resolveProductImageSrc } from '@/lib/shop/format';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import type { BackendProduct, CatalogHeroSlide, CatalogSubcategory } from '@/types/api/product';
import type { ProductCategory } from '@/types/api/product';
import { useCart } from '@/store/CartContext';
import { useProductCatalog } from '@/features/shop/hooks/useProductCatalog';

type ProductCatalogFeatureProps = {
  readonly products: BackendProduct[];
  readonly locale: Locale;
  readonly initialQuery?: string;
  readonly initialCategory?: ProductCategory | 'ALL';
  readonly heroSlides: CatalogHeroSlide[];
  readonly catalogTitle?: string;
  readonly catalogSubtitle?: string;
  readonly quickCategories?: ReadonlyArray<{
    readonly category: ProductCategory;
    readonly slug: string;
    readonly label: string;
  }>;
  readonly subcategories?: readonly CatalogSubcategory[];
  readonly selectedSubcategorySlug?: string;
};

export function ProductCatalogFeature({
  products,
  locale,
  initialQuery,
  initialCategory,
  heroSlides,
  catalogTitle,
  catalogSubtitle,
  quickCategories: quickCategoriesFromBackend,
  subcategories = [],
  selectedSubcategorySlug,
}: Readonly<ProductCatalogFeatureProps>) {
  const catalog = useProductCatalog(products, locale, { initialQuery, initialCategory });
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const t = createTranslator(catalog.locale);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Build cart action slot per card
  const cartActionSlot = useCallback(
    (card: { product: BackendProduct }) => {
      const product = card.product;
      const cartItem = items.find((i) => i.product.id === product.id);
      const quantity = cartItem?.quantity ?? 0;

      return (
        <AddToCartButton
          product={product}
          quantity={quantity}
          addLabel={t('cartAddItem')}
          decreaseLabel={t('cartDecreaseQuantity')}
          increaseLabel={t('cartIncreaseQuantity')}
          removeLabel={t('cartRemoveItem')}
          unavailableLabel={t('productUnavailable')}
          onAdd={addItem}
          onDecrease={(productId) => {
            const current = items.find((i) => i.product.id === productId);
            if (current && current.quantity <= 1) {
              removeItem(productId);
            } else {
              updateQuantity(productId, (current?.quantity ?? 1) - 1);
            }
          }}
          onIncrease={(productId, maxStock) => {
            const current = items.find((i) => i.product.id === productId);
            updateQuantity(productId, Math.min((current?.quantity ?? 0) + 1, maxStock));
          }}
          onRemove={removeItem}
        />
      );
    },
    [items, addItem, updateQuantity, removeItem, t]
  );

  const safeHeroSlides = useMemo(
    () =>
      heroSlides.length > 0
        ? heroSlides
        : [
            {
              category: 'OTHER' as ProductCategory,
              slug: 'altro',
              label: t('appName'),
              title: catalog.labels.heroTitle,
              subtitle: catalog.labels.heroSubtitle,
              imagePath: '/uploads/thinkshop/heroes/altro.svg',
            },
          ],
    [catalog.labels.heroSubtitle, catalog.labels.heroTitle, heroSlides, t]
  );

  useEffect(() => {
    setActiveHeroIndex(0);
  }, [safeHeroSlides.length]);

  useEffect(() => {
    if (safeHeroSlides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveHeroIndex((current) => (current + 1) % safeHeroSlides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [safeHeroSlides.length]);

  const quickCategoryIcons: Record<ProductCategory, ReactNode> = {
    TECHNOLOGY: <DevicesIcon fontSize="small" />,
    HOME: <WeekendIcon fontSize="small" />,
    CLOTHING: <CheckroomIcon fontSize="small" />,
    SPORTS: <SportsBasketballIcon fontSize="small" />,
    BOOKS: <MenuBookIcon fontSize="small" />,
    FOOD: <RestaurantIcon fontSize="small" />,
    BEAUTY: <SpaIcon fontSize="small" />,
    TOYS: <SmartToyIcon fontSize="small" />,
    OTHER: <AutoAwesomeIcon fontSize="small" />,
  };
  const cards = catalog.filteredProducts.map((product) => ({
    product,
    href: `/product/${product.id}`,
    imageSrc: resolveProductImageSrc(product.imagePath),
    categoryLabel: t(categoryTranslationKey(product.category)),
    priceLabel: formatCurrency(product.priceInCents, catalog.locale),
    stockLabel: `${catalog.labels.stock}: ${product.stockQuantity}`,
  }));
  const quickCategories = (
    quickCategoriesFromBackend?.length
      ? quickCategoriesFromBackend
      : catalog.categoryOptions
          .filter(
            (option): option is { value: ProductCategory; label: string } => option.value !== 'ALL'
          )
          .map((option) => ({
            category: option.value,
            slug: option.value.toLowerCase(),
            label: option.label,
          }))
  ).map((option) => ({
    value: option.category,
    label: option.label,
    href: `/categoria/${option.slug}`,
    icon: quickCategoryIcons[option.category],
  }));
  const activeHero = safeHeroSlides[activeHeroIndex] ?? safeHeroSlides[0];

  return (
    <ProductCatalog
      cards={cards}
      query={catalog.query}
      category={catalog.category}
      categoryOptions={catalog.categoryOptions}
      labels={{
        ...catalog.labels,
        title: catalogTitle ?? catalog.labels.title,
        subtitle: catalogSubtitle ?? catalog.labels.subtitle,
      }}
      hero={{
        title: activeHero.title,
        subtitle: activeHero.subtitle,
        eyebrow: activeHero.label,
        imageSrc: resolveProductImageSrc(activeHero.imagePath),
        slideLabel: `${activeHeroIndex + 1}/${safeHeroSlides.length}`,
      }}
      quickCategories={quickCategories}
      subcategories={subcategories.map((subcategory) => ({
        slug: subcategory.slug,
        label: subcategory.label,
        href:
          selectedSubcategorySlug === subcategory.slug ? '#' : `?subcategory=${subcategory.slug}`,
        isActive: selectedSubcategorySlug === subcategory.slug,
        productCount: subcategory.productCount,
      }))}
      onQueryChange={catalog.setQuery}
      onCategoryChange={catalog.setCategory}
      onPreviousHero={() =>
        setActiveHeroIndex(
          (current) => (current - 1 + safeHeroSlides.length) % safeHeroSlides.length
        )
      }
      onNextHero={() => setActiveHeroIndex((current) => (current + 1) % safeHeroSlides.length)}
      cartActionSlot={cartActionSlot}
    />
  );
}
