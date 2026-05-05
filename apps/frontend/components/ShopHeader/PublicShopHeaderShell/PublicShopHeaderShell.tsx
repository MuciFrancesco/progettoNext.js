'use client';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { CartBadgeLink } from '@/components/CartBadgeLink/CartBadgeLink';
import type { ReactNode } from 'react';
import styles from './PublicShopHeaderShell.module.scss';

type PublicShopHeaderShellProps = {
  readonly appName: string;
  readonly cartLabel: string;
  readonly actionsSlot?: ReactNode;
};

export function PublicShopHeaderShell({
  appName,
  cartLabel,
  actionsSlot,
}: Readonly<PublicShopHeaderShellProps>) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      className={styles.appBar}
    >
      <Toolbar className={styles.toolbar}>
        <Box
          component={Link}
          href="/"
          aria-label={appName}
          className={styles.logoLink}
        >
          <Typography component="span" className={styles.logoText}>
            Think
            <Box component="span" className={styles.logoAccent}>
              Shop
            </Box>
          </Typography>
        </Box>

        <Box className={styles.actionsSlot}>
          <CartBadgeLink label={cartLabel} />
          {actionsSlot}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
