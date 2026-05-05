'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from 'next/link';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import type { ReactNode } from 'react';
import { APP_NAME } from '@/lib/constants';
import styles from './DashboardHeader.module.scss';

type DashboardHeaderProps = {
  readonly badgeLabel?: string;
  readonly inlineNavSlot?: ReactNode;
  readonly mobileNavSlot?: ReactNode;
  readonly rightSlot?: ReactNode;
  readonly logoHref?: string;
};

export function DashboardHeader({
  badgeLabel,
  inlineNavSlot,
  mobileNavSlot,
  rightSlot,
  logoHref = '/dashboard',
}: Readonly<DashboardHeaderProps>) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      className={styles.appBar}
    >
      <Toolbar className={styles.toolbar}>
        {/* Logo */}
        <Link href={logoHref} aria-label={`${APP_NAME} home`} className={styles.logoLink}>
          <Box
            component="span"
            className={styles.logoBox}
          >
            Think
            <Box component="span" className={styles.logoSpan}>
              Shop
            </Box>
          </Box>
        </Link>

        {/* Badge ruolo (opzionale) */}
        {badgeLabel && (
          <Chip
            icon={<AdminPanelSettingsIcon className={styles.roleBadgeIcon} />}
            label={badgeLabel}
            size="small"
            variant="outlined"
            color="primary"
            className={styles.roleBadge}
          />
        )}

        {/* Nav inline (> 1350 px) */}
        {inlineNavSlot}

        {/* Slot azioni a dx (LocaleSwitcher + logout) */}
        <Box className={styles.actionsBox}>
          {rightSlot}
        </Box>

        {/* Menu a 3 puntini (≤ 1350 px) */}
        {mobileNavSlot}
      </Toolbar>
    </AppBar>
  );
}
