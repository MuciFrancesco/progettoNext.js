'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from './ProductCatalog.module.scss';

type Subcategory = {
  readonly slug: string;
  readonly label: string;
  readonly href: string;
  readonly isActive: boolean;
  readonly productCount: number;
};

type ProductCatalogSubcategoriesProps = {
  readonly items: Subcategory[];
  readonly ariaLabel: string;
  readonly handleSubcategorySelect: (slug: string) => void;
};

export function ProductCatalogSubcategories({
  items,
  ariaLabel,
  handleSubcategorySelect,
}: Readonly<ProductCatalogSubcategoriesProps>) {
  if (items.length === 0) return null;

  return (
    <Box className={styles.subcategoryRail} aria-label={ariaLabel}>
      {items.map((subcategory) => (
        <Button
          key={subcategory.slug}
          type="button"
          onClick={() => handleSubcategorySelect(subcategory.slug)}
          variant={subcategory.isActive ? 'contained' : 'outlined'}
          className={styles.subcategoryButton}
        >
          <Typography component="span" variant="body2">
            {subcategory.label}
          </Typography>
          <Typography component="span" variant="caption" className={styles.subcategoryCount}>
            {subcategory.productCount}
          </Typography>
        </Button>
      ))}
    </Box>
  );
}
