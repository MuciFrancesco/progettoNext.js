'use client';

import Link from 'next/link';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MuiButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { AdminRoutes } from '@/lib/routes';
import styles from './UpdateProduct.module.scss';

export function UpdateProductHeader({ locale }: Readonly<{ locale: Locale }>) {
  const t = createTranslator(locale);

  return (
    <Box component="header" className={styles.pageHeader}>
      <Box>
        <Typography variant="h5" className={styles.sectionTitle}>
          {t('updateProductPageTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('updateProductPageSubtitle')}
        </Typography>
      </Box>
      <MuiButton
        variant="contained"
        component={Link}
        href={AdminRoutes.ADD_PRODUCT}
        startIcon={<AddBoxIcon />}
        className={`${styles.shrinkButton} btn-add`}
      >
        {t('navAddProduct')}
      </MuiButton>
    </Box>
  );
}
