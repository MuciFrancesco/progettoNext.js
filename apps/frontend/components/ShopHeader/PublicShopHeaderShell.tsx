'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { CartBadgeLink } from '@/components/CartBadgeLink/CartBadgeLink';
import type { Locale } from '@/lib/i18n/translation';
import { PublicShopHeaderActions } from './PublicShopHeaderActions';

type PublicShopHeaderShellProps = {
  readonly appName: string;
  readonly cartLabel: string;
  readonly loginLabel: string;
  readonly locale: Locale;
  readonly purchasesLabel: string;
  readonly showPurchases: boolean;
};

export function PublicShopHeaderShell({
  appName,
  cartLabel,
  loginLabel,
  locale,
  purchasesLabel,
  showPurchases,
}: Readonly<PublicShopHeaderShellProps>) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 30,
        bgcolor: 'var(--background)',
        borderBottom: '1px solid',
        borderColor: 'var(--border)',
        color: 'var(--foreground)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar
        sx={{
          width: '100%',
          gap: 1.5,
          px: { xs: 2, sm: 3 },
          py: 1.5,
          minHeight: 'unset !important',
          alignItems: 'center',
        }}
      >
        <Box
          component={Link}
          href="/"
          aria-label={appName}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            flexShrink: 0,
          }}
        >
          <Typography
            component="span"
            sx={{
              fontWeight: 700,
              fontSize: '1.25rem',
              color: 'var(--primary)',
              userSelect: 'none',
            }}
          >
            Think
            <Box component="span" sx={{ color: 'var(--foreground)' }}>
              Shop
            </Box>
          </Typography>
        </Box>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <CartBadgeLink label={cartLabel} />
          <PublicShopHeaderActions
            loginLabel={loginLabel}
            locale={locale}
            purchasesLabel={purchasesLabel}
            showPurchases={showPurchases}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
