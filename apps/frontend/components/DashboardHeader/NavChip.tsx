'use client';

import Chip from '@mui/material/Chip';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { DashboardLink } from './helpers/dashboardLinks';
import styles from './NavChip.module.scss';

type NavChipProps = {
  readonly link: DashboardLink;
};

export function NavChip({ link }: NavChipProps) {
  const pathname = usePathname();
  const isActive = pathname === link.href;

  return (
    <Chip
      label={link.label}
      component={Link}
      href={link.href}
      clickable
      icon={link.Icon ? <link.Icon fontSize="small" /> : undefined}
      variant={isActive ? 'filled' : 'outlined'}
      color={isActive ? 'primary' : 'default'}
      className={!isActive ? styles.inactiveChip : undefined}
    />
  );
}
