'use client';

import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DashboardHeader } from '@/components/DashboardHeader/DashboardHeader/DashboardHeader';
import { NavChip } from '@/components/DashboardHeader/NavChip/NavChip';
import { NavDrawer } from '@/components/DashboardHeader/NavDrawer/NavDrawer';
import type { DashboardLink } from '@/components/DashboardHeader/helpers/dashboardLinks';
import styles from './DashboardHeaderComposed.module.scss';

type DashboardHeaderComposedProps = {
  readonly badgeLabel?: string;
  readonly navAriaLabel?: string;
  readonly links?: DashboardLink[];
  readonly rightSlot?: React.ReactNode;
  readonly logoHref?: string;
};

export function DashboardHeaderComposed({
  badgeLabel,
  navAriaLabel,
  links,
  rightSlot,
  logoHref = '/dashboard',
}: Readonly<DashboardHeaderComposedProps>) {
  const isWide = useMediaQuery('(min-width: 1350px)');
  const hasNav = Boolean(links && links.length > 0);

  return (
    <DashboardHeader
      badgeLabel={badgeLabel}
      logoHref={logoHref}
      rightSlot={rightSlot}
      inlineNavSlot={
        isWide && hasNav ? (
          <Box
            component="nav"
            aria-label={navAriaLabel}
            className={styles.inlineNav}
          >
            {links!.map((link) => (
              <NavChip key={link.href} link={link} />
            ))}
          </Box>
        ) : null
      }
      mobileNavSlot={
        !isWide && hasNav ? <NavDrawer links={links!} navAriaLabel={navAriaLabel ?? ''} /> : null
      }
    />
  );
}
