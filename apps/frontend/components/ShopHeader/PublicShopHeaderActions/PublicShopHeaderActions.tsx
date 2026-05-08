'use client';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';

import type { Locale } from '@/lib/i18n/translation';
import styles from './PublicShopHeaderActions.module.scss';
import { LogoutButton } from '@/features/LogOut/LogOutButton/LogOutButton';

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
      <Button
        component={Link}
        href="/login?mode=signin"
        variant="outlined"
        className={styles.actionButton}
      >
        {loginLabel}
      </Button>
    );
  }

  return (
    <Box className={styles.actionsRow}>
      <Button
        component={Link}
        href="/user/orders"
        variant="contained"
        className={styles.actionButton}
      >
        {purchasesLabel}
      </Button>
      <LogoutButton locale={locale} testId="user-header-signout-button" />
    </Box>
  );
}
