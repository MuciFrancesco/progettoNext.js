'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import type { ProductCategory } from '@/types/api/product';
import styles from './ProductCatalog.module.scss';

type QuickCategory = {
  readonly value: ProductCategory;
  readonly label: string;
  readonly href: string;
  readonly icon: ReactNode;
};

type ProductCatalogQuickNavProps = {
  readonly items: QuickCategory[];
  readonly activeCategory: ProductCategory | 'ALL';
  readonly ariaLabel: string;
};

export function ProductCatalogQuickNav({
  items,
  activeCategory,
  ariaLabel,
}: Readonly<ProductCatalogQuickNavProps>) {
  return (
    <Box
      component="nav"
      id="quick-categories"
      aria-label={ariaLabel}
      className={styles.quickCategories}
    >
      {items.map((item) => (
        <ButtonBase
          key={item.value}
          component={Link}
          href={item.href}
          className={styles.quickCategoryButton}
        >
          <Paper
            elevation={0}
            className={
              activeCategory === item.value ? styles.quickCategoryActive : styles.quickCategoryCard
            }
          >
            <Box className={styles.quickCategoryIcon}>{item.icon}</Box>
            <Typography variant="body2" className={styles.quickCategoryLabel}>
              {item.label}
            </Typography>
          </Paper>
        </ButtonBase>
      ))}
    </Box>
  );
}
