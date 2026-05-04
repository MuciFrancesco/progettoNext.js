'use client';

import { ProductCatalog } from '@/components/ProductCatalog/ProductCatalog';
import type { Locale } from '@/lib/i18n/translation';
import type { BackendProduct } from '@/types/api/product';
import { useProductCatalog } from '../hooks/useProductCatalog';

type ProductCatalogFeatureProps = {
  readonly products: BackendProduct[];
  readonly locale: Locale;
};

export function ProductCatalogFeature({ products, locale }: Readonly<ProductCatalogFeatureProps>) {
  const catalog = useProductCatalog(products, locale);

  return (
    <ProductCatalog
      products={catalog.filteredProducts}
      locale={catalog.locale}
      query={catalog.query}
      category={catalog.category}
      categoryOptions={catalog.categoryOptions}
      labels={catalog.labels}
      onQueryChange={catalog.setQuery}
      onCategoryChange={catalog.setCategory}
    />
  );
}
