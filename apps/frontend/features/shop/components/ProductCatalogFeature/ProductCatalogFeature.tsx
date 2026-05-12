'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { ProductCatalogHero } from '@/components/ProductCatalog/ProductCatalogHero';
import { ProductCatalogHeader } from '@/components/ProductCatalog/ProductCatalogHeader';
import { ProductCatalogSubcategories } from '@/components/ProductCatalog/ProductCatalogSubcategories';
import catalogStyles from '@/components/ProductCatalog/ProductCatalog.module.scss';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { AddToCartButton } from '@/components/AddToCartButton/AddToCartButton';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import { formatCurrency, resolveProductImageSrc } from '@/lib/shop/format';
import { getEffectivePriceInCents } from '@/lib/shop/pricing';
import type { Locale } from '@/lib/i18n/translation';
import type {
  BackendProduct,
  CatalogHeroSlide,
  CatalogSubcategory,
  ProductCategory,
} from '@/types/api/product';
import { useCatalogPage } from '@/features/shop/hooks/useCatalogPage';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

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
  readonly children?: ReactNode;
};

export function ProductCatalogFeature(props: Readonly<ProductCatalogFeatureProps>) {
  const {
    catalog,
    t,
    activeHero,
    heroData,
    mappedSubcategories,
    labels,
    getCartQuantity,
    onCartAdd,
    handleDecrease,
    handleIncrease,
    handleQuantityChange,
    onCartRemove,
  } = useCatalogPage({
    products: props.products,
    locale: props.locale,
    initialQuery: props.initialQuery,
    initialCategory: props.initialCategory,
    heroSlides: props.heroSlides,
    catalogTitle: props.catalogTitle,
    catalogSubtitle: props.catalogSubtitle,
    quickCategoriesFromBackend: props.quickCategories,
    subcategories: props.subcategories,
    selectedSubcategorySlug: props.selectedSubcategorySlug,
  });

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubcategorySelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('subcategory', slug);
    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <Box component="section" data-testid="product-catalog" className={catalogStyles.pageSection}>
      <ProductCatalogHero
        imageSrc={heroData.imageSrc}
        eyebrow={heroData.eyebrow}
        title={heroData.title}
        subtitle={heroData.subtitle}
        slideLabel={heroData.slideLabel}
        primaryCta={labels.heroPrimaryCta}
        secondaryCta={labels.heroSecondaryCta}
        ariaLabel={labels.heroSectionAria}
        onPrevious={activeHero.goToPrevious}
        onNext={activeHero.goToNext}
        data-testid="home-page"
      />

      {props.children}

      <ProductCatalogHeader brand={labels.brand} title={labels.title} subtitle={labels.subtitle} />

      <ProductCatalogSubcategories
        items={mappedSubcategories}
        ariaLabel={labels.quickCategoriesAria}
        handleSubcategorySelect={handleSubcategorySelect}
      />

      {catalog.filteredProducts.length === 0 ? (
        <Paper variant="outlined" className={catalogStyles.emptyState}>
          <Typography>{labels.empty}</Typography>
        </Paper>
      ) : (
        <Box className={catalogStyles.productGrid}>
          {catalog.filteredProducts.map((product) => {
            const effectivePrice = getEffectivePriceInCents(product);
            return (
              <ProductCard
                key={product.id}
                card={{
                  product,
                  href: `/product/${product.id}`,
                  imageSrc: resolveProductImageSrc(product.imagePath),
                  categoryLabel: t(categoryTranslationKey(product.category)),
                  priceLabel: formatCurrency(effectivePrice, catalog.locale),
                  originalPriceLabel:
                    product.isInSale && product.salePriceInCents
                      ? formatCurrency(product.priceInCents, catalog.locale)
                      : undefined,
                  saleBadge:
                    product.isInSale && product.saleDiscountPercent
                      ? t('productSaleBadge', { percent: product.saleDiscountPercent })
                      : undefined,
                  stockLabel: `${catalog.labels.stock}: ${product.stockQuantity}`,
                }}
                labels={catalog.labels}
                cartActionSlot={
                  <AddToCartButton
                    product={product}
                    quantity={getCartQuantity(product.id)}
                    addLabel={t('cartAddItem')}
                    decreaseLabel={t('cartDecreaseQuantity')}
                    increaseLabel={t('cartIncreaseQuantity')}
                    quantityLabel={t('cartQuantity')}
                    removeLabel={t('cartRemoveItem')}
                    unavailableLabel={t('productUnavailable')}
                    onAdd={onCartAdd}
                    onDecrease={handleDecrease}
                    onIncrease={handleIncrease}
                    onQuantityChange={handleQuantityChange}
                    onRemove={onCartRemove}
                  />
                }
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
}
