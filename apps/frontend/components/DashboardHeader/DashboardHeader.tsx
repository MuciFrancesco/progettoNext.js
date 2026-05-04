'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from 'next/link';
import useMediaQuery from '@mui/material/useMediaQuery';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import type { ReactNode } from 'react';
import { APP_NAME } from '@/lib/constants';
import styles from './DashboardHeader.module.scss';
import type { DashboardLink } from './helpers/dashboardLinks';
import { NavChip } from './NavChip';
import { NavDrawer } from './NavDrawer';

type DashboardHeaderProps = {
  readonly badgeLabel?: string;
  readonly navAriaLabel?: string;
  readonly links?: DashboardLink[];
  readonly rightSlot?: ReactNode;
  readonly logoHref?: string;
};

export function DashboardHeader({
  badgeLabel,
  navAriaLabel,
  links,
  rightSlot,
  logoHref = '/dashboard',
}: Readonly<DashboardHeaderProps>) {
  const isWide = useMediaQuery('(min-width: 1350px)');
  const hasNav = links && links.length > 0;

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
        backdropFilter: 'blur(8px)',
        color: 'var(--foreground)',
      }}
    >
      <Toolbar
        sx={{
          width: '100%',
          gap: 1.5,
          px: { xs: 2, sm: 3 },
          py: 1.5,
          minHeight: 'unset !important',
          flexWrap: 'nowrap',
          alignItems: 'center',
        }}
      >
        {/* Logo */}
        <Link href={logoHref} aria-label={`${APP_NAME} home`} className={styles.logoLink}>
          <Box
            component="span"
            sx={{
              fontWeight: 700,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
              color: 'var(--primary)',
              fontFamily: 'inherit',
              userSelect: 'none',
            }}
          >
            Think
            <Box component="span" sx={{ color: 'var(--foreground)' }}>
              Shop
            </Box>
          </Box>
        </Link>

        {/* Badge ruolo (opzionale) */}
        {badgeLabel && (
          <Chip
            icon={<AdminPanelSettingsIcon sx={{ fontSize: '0.9rem !important' }} />}
            label={badgeLabel}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ fontWeight: 600, fontSize: '0.7rem', height: 24, flexShrink: 0 }}
          />
        )}

        {/* Nav inline (> 1350 px) */}
        {isWide && hasNav && (
          <Box
            component="nav"
            aria-label={navAriaLabel}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap' }}
          >
            {links.map((link) => (
              <NavChip key={link.href} link={link} />
            ))}
          </Box>
        )}

        {/* Slot azioni a dx (LocaleSwitcher + logout) */}
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
          {rightSlot}
        </Box>

        {/* Menu a 3 puntini (≤ 1350 px) */}
        {!isWide && hasNav && <NavDrawer links={links} navAriaLabel={navAriaLabel ?? ''} />}
      </Toolbar>
    </AppBar>
  );
}
