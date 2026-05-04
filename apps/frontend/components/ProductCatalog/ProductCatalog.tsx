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
}: Readonly<ProductCatalogProps>) {
  const t = createTranslator(locale);

  return (
    <Box
      component="section"
      data-testid="product-catalog"
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6"
    >
      <Box className="flex flex-col gap-3">
        <Typography variant="overline" sx={{ color: 'var(--primary)', fontWeight: 700 }}>
          {labels.brand}
        </Typography>
        <Box className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <Box>
            <Typography component="h1" variant="h3" sx={{ fontWeight: 700 }}>
              {labels.title}
            </Typography>
            <Typography sx={{ mt: 1, maxWidth: 680, color: 'var(--muted-foreground)' }}>
              {labels.subtitle}
            </Typography>
          </Box>
          <TextField
            label={labels.search}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            size="small"
            sx={{ minWidth: { md: 280 } }}
            slotProps={{ htmlInput: { 'data-testid': 'catalog-search' } }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography>{labels.empty}</Typography>
        </Paper>
      ) : (
        <Box className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Paper
              key={product.id}
              variant="outlined"
              data-testid={`product-card-${product.id}`}
              sx={{
                display: 'flex',
                minHeight: 420,
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: 2,
              }}
            >
              <Box sx={{ position: 'relative', height: 190, bgcolor: 'var(--secondary)' }}>
                {product.imagePath ? (
                  <Image
                    src={resolveProductImageSrc(product.imagePath)}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                ) : (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'grid',
                      placeItems: 'center',
                      color: 'var(--muted-foreground)',
                    }}
                  >
                    <Typography>{labels.brand}</Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', gap: 1.5, p: 2 }}>
                <Box className="flex items-start justify-between gap-3">
                  <Box>
                    <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
                      {product.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                      {product.name}
                    </Typography>
                  </Box>
                  <Chip size="small" label={t(categoryTranslationKey(product.category))} />
                </Box>
                <Typography variant="body2" sx={{ color: 'var(--muted-foreground)', flex: 1 }}>
                  {product.description}
                </Typography>
                <Box className="flex items-center justify-between gap-3">
                  <Typography sx={{ fontWeight: 800, color: 'var(--primary)' }}>
                    {formatCurrency(product.priceInCents, locale)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
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
                />
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}
