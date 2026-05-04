'use client';

import Link from 'next/link';
import AddBoxIcon from '@mui/icons-material/AddBox';
import MuiButton from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { AdminRoutes } from '@/lib/routes';

export function UpdateProductHeader({ locale }: Readonly<{ locale: Locale }>) {
  const t = createTranslator(locale);

  return (
    <Box
      component="header"
      sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {t('updateProductPageTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('updateProductPageSubtitle')}
        </Typography>
      </Box>
      <MuiButton
        variant="contained"
        className="btn-add"
        component={Link}
        href={AdminRoutes.ADD_PRODUCT}
        startIcon={<AddBoxIcon />}
        sx={{ flexShrink: 0 }}
      >
        {t('navAddProduct')}
      </MuiButton>
    </Box>
  );
}
