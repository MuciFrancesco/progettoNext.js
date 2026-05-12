'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './ProductCatalog.module.scss';

type ProductCatalogHeaderProps = {
  readonly brand: string;
  readonly title: string;
  readonly subtitle: string;
};

export function ProductCatalogHeader({
  brand,
  title,
  subtitle,
}: Readonly<ProductCatalogHeaderProps>) {
  return (
    <Box id="catalog" className={styles.headerBlock}>
      <Typography variant="overline" className={styles.eyebrow} data-testid="home-brand">
        {brand}
      </Typography>
      <Box className={styles.titleRow}>
        <Box className={styles.catalogCopy}>
          <Typography component="h2" variant="h3" className={styles.title}>
            {title}
          </Typography>
          <Typography className={styles.subtitle}>{subtitle}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
