'use client';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import styles from './ProductCatalog.module.scss';

type ProductCatalogHeaderProps = {
  readonly brand: string;
  readonly title: string;
  readonly subtitle: string;
  readonly searchLabel: string;
  readonly query: string;
  readonly onQueryChange: (value: string) => void;
};

export function ProductCatalogHeader({
  brand,
  title,
  subtitle,
  searchLabel,
  query,
  onQueryChange,
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
        <TextField
          label={searchLabel}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          size="small"
          className={styles.searchField}
          slotProps={{ htmlInput: { 'data-testid': 'catalog-search' } }}
        />
      </Box>
    </Box>
  );
}
