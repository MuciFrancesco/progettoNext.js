'use client';

import Image from 'next/image';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { BackendProduct, ProductCategory } from '@/types/api/product';
import { categoryTranslationKey } from '@/features/admin/helpers/categoryLabel';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import { formatCurrency, resolveProductImageSrc } from '@/lib/shop/format';
import { AddToCartButton } from '@/components/AddToCartButton/AddToCartButton';
import styles from './ProductCatalog.module.scss';

type ProductCatalogCategoryOption = {
  readonly value: ProductCategory | 'ALL';
  readonly label: string;
};

type ProductCatalogLabels = {
  readonly brand: string;
  readonly title: string;
  readonly subtitle: string;
  readonly search: string;
  readonly empty: string;
  readonly stock: string;
  readonly addToCart: string;
  readonly decreaseQuantity: string;
  readonly increaseQuantity: string;
  readonly removeFromCart: string;
  readonly unavailable: string;
};

type ProductCatalogProps = {
  readonly products: BackendProduct[];
  readonly locale: Locale;
  readonly query: string;
  readonly category: ProductCategory | 'ALL';
  readonly categoryOptions: ProductCatalogCategoryOption[];
  readonly labels: ProductCatalogLabels;
  readonly onQueryChange: (value: string) => void;
  readonly onCategoryChange: (value: ProductCategory | 'ALL') => void;
  readonly onRefreshProduct: (productId: string) => Promise<BackendProduct | undefined>;
};

export function ProductCatalog({
  products,
  locale,
  query,
  category,
  categoryOptions,
  labels,
  onQueryChange,
  onCategoryChange,
  onRefreshProduct,
}: Readonly<ProductCatalogProps>) {
  const t = createTranslator(locale);

  return (
    <Box
      component="section"
      data-testid="product-catalog"
      className={styles.pageSection}
    >
      <Box className={styles.headerBlock}>
        <Typography variant="overline" className={styles.eyebrow}>
          {labels.brand}
        </Typography>
        <Box className={styles.titleRow}>
          <Box>
            <Typography component="h1" variant="h3" className={styles.title}>
              {labels.title}
            </Typography>
            <Typography className={styles.subtitle}>
              {labels.subtitle}
            </Typography>
          </Box>
          <TextField
            label={labels.search}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            size="small"
            className={styles.searchField}
            slotProps={{ htmlInput: { 'data-testid': 'catalog-search' } }}
          />
        </Box>
      </Box>

      <Box className={styles.categoryFilters}>
        {categoryOptions.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            color={category === option.value ? 'primary' : 'default'}
            onClick={() => onCategoryChange(option.value)}
          />
        ))}
      </Box>

      {products.length === 0 ? (
        <Paper variant="outlined" className={styles.emptyState}>
          <Typography>{labels.empty}</Typography>
        </Paper>
      ) : (
        <Box className={styles.productGrid}>
          {products.map((product) => (
            <Paper
              key={product.id}
              variant="outlined"
              data-testid={`product-card-${product.id}`}
              className={styles.productCard}
            >
              <Box className={styles.imageFrame}>
                {product.imagePath ? (
                  <Image
                    src={resolveProductImageSrc(product.imagePath)}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={styles.containImage}
                    unoptimized
                  />
                ) : (
                  <Box className={styles.imagePlaceholder}>
                    <Typography>{labels.brand}</Typography>
                  </Box>
                )}
              </Box>
              <Box className={styles.productContent}>
                <Box className={styles.productHeadingRow}>
                  <Box>
                    <Typography component="h2" variant="h6" className={styles.productTitle}>
                      {product.title}
                    </Typography>
                    <Typography variant="body2" className={styles.mutedText}>
                      {product.name}
                    </Typography>
                  </Box>
                  <Chip size="small" label={t(categoryTranslationKey(product.category))} />
                </Box>
                <Typography variant="body2" className={styles.productDescription}>
                  {product.description}
                </Typography>
                <Box className={styles.priceRow}>
                  <Typography className={styles.price}>
                    {formatCurrency(product.priceInCents, locale)}
                  </Typography>
                  <Typography variant="caption" className={styles.mutedText}>
                    {labels.stock}: {product.stockQuantity}
                  </Typography>
                </Box>
                <AddToCartButton
                  product={product}
                  addLabel={labels.addToCart}
                  decreaseLabel={labels.decreaseQuantity}
                  increaseLabel={labels.increaseQuantity}
                  removeLabel={labels.removeFromCart}
                  unavailableLabel={labels.unavailable}
                  onRefreshProduct={onRefreshProduct}
                />
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
