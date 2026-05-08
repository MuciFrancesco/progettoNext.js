'use client';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import type { ProductCategory } from '@/types/api/product';
import styles from './ProductCatalog.module.scss';

type FilterOption = {
  readonly value: ProductCategory | 'ALL';
  readonly label: string;
};

type ProductCatalogFiltersProps = {
  readonly options: FilterOption[];
  readonly activeCategory: ProductCategory | 'ALL';
  readonly onCategoryChange: (value: ProductCategory | 'ALL') => void;
};

export function ProductCatalogFilters({
  options,
  activeCategory,
  onCategoryChange,
}: Readonly<ProductCatalogFiltersProps>) {
  return (
    <Box className={styles.categoryFilters}>
      {options.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          color={activeCategory === option.value ? 'primary' : 'default'}
          onClick={() => onCategoryChange(option.value)}
        />
      ))}
    </Box>
  );
}
