'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, type ComponentProps } from 'react';
import styles from './Navbar.module.scss';

function NavLink(props: Readonly<Omit<ComponentProps<typeof Link>, 'className'>>) {
  const pathname = usePathname();
  const isActive = pathname === props.href;
  const className = isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;

  return (
    <MuiLink
      component={Link}
      href={props.href as string}
      {...(props as object)}
      underline="none"
      className={className}
    />
  );
}

function Navbar({ children }: Readonly<{ children?: ReactNode }>) {
  return (
    <AppBar
      position="static"
      data-testid="admin-navbar"
      elevation={0}
      className={styles.navbar}
    >
      <Toolbar className={styles.toolbar}>{children}</Toolbar>
    </AppBar>
  );
}

export { Navbar, NavLink };
