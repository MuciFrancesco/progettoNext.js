'use client';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';
import LogoutButton from '@/components/DashboardHeader/LogoutButton';
import type { Locale } from '@/lib/i18n/translation';

type PublicShopHeaderActionsProps = {
  readonly loginLabel: string;
  readonly locale: Locale;
  readonly purchasesLabel: string;
  readonly showPurchases: boolean;
};

export function PublicShopHeaderActions({
  loginLabel,
  locale,
  purchasesLabel,
  showPurchases,
}: Readonly<PublicShopHeaderActionsProps>) {
  if (!showPurchases) {
    return (
      <Button component={Link} href="/login?mode=signin" variant="outlined" sx={{ borderRadius: 1.5 }}>
        {loginLabel}
      </Button>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Button component={Link} href="/user/orders" variant="contained" sx={{ borderRadius: 1.5 }}>
        {purchasesLabel}
      </Button>
      <LogoutButton locale={locale} testId="user-header-signout-button" />
    </Box>
  );
}
