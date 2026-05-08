'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ProductCatalogHero } from '@/components/ProductCatalog/ProductCatalogHero';
import { ProductCatalogQuickNav } from '@/components/ProductCatalog/ProductCatalogQuickNav';
import { ProductCatalogHeader } from '@/components/ProductCatalog/ProductCatalogHeader';
import { ProductCatalogSubcategories } from '@/components/ProductCatalog/ProductCatalogSubcategories';
import { ProductCatalogFilters } from '@/components/ProductCatalog/ProductCatalogFilters';
import catalogStyles from '@/components/ProductCatalog/ProductCatalog.module.scss';
import { ProductCard } from '@/components/ProductCard/ProductCard';
import { AddToCartButton } from '@/components/AddToCartButton/AddToCartButton';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import { formatCurrency, resolveProductImageSrc } from '@/lib/shop/format';
import type { Locale } from '@/lib/i18n/translation';
import type {
  BackendProduct,
  CatalogHeroSlide,
  CatalogSubcategory,
  ProductCategory,
} from '@/types/api/product';
import { useCatalogPage } from '@/features/shop/hooks/useCatalogPage';

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

export function ProductCatalogFeature(props: Readonly<ProductCatalogFeatureProps>) {
  const {
    catalog,
    t,
    activeHero,
    quickCategories,
    heroData,
    mappedSubcategories,
    labels,
    getCartQuantity,
    onCartAdd,
    handleDecrease,
    handleIncrease,
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

      <ProductCatalogQuickNav
        items={quickCategories}
        activeCategory={catalog.category}
        ariaLabel={labels.quickCategoriesAria}
      />

      <ProductCatalogHeader
        brand={labels.brand}
        title={labels.title}
        subtitle={labels.subtitle}
        searchLabel={labels.search}
        query={catalog.query}
        onQueryChange={catalog.setQuery}
      />

      <ProductCatalogSubcategories
        items={mappedSubcategories}
        ariaLabel={labels.quickCategoriesAria}
      />

      <ProductCatalogFilters
        options={catalog.categoryOptions}
        activeCategory={catalog.category}
        onCategoryChange={catalog.setCategory}
      />

      {catalog.filteredProducts.length === 0 ? (
        <Paper variant="outlined" className={catalogStyles.emptyState}>
          <Typography>{labels.empty}</Typography>
        </Paper>
      ) : (
        <Box className={catalogStyles.productGrid}>
          {catalog.filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              card={{
                product,
                href: `/product/${product.id}`,
                imageSrc: resolveProductImageSrc(product.imagePath),
                categoryLabel: t(categoryTranslationKey(product.category)),
                priceLabel: formatCurrency(product.priceInCents, catalog.locale),
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
                  removeLabel={t('cartRemoveItem')}
                  unavailableLabel={t('productUnavailable')}
                  onAdd={onCartAdd}
                  onDecrease={handleDecrease}
                  onIncrease={handleIncrease}
                  onRemove={onCartRemove}
                />
              }
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
