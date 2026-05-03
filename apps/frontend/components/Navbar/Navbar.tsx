'use client';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MuiLink from '@mui/material/Link';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, type ComponentProps } from 'react';

function NavLink(props: Readonly<Omit<ComponentProps<typeof Link>, 'className'>>) {
  const pathname = usePathname();
  const isActive = pathname === props.href;
  return (
    <MuiLink
      component={Link}
      href={props.href as string}
      {...(props as object)}
      underline="none"
      sx={{
        px: 2,
        py: 1.5,
        borderRadius: 1,
        color: 'primary.contrastText',
        transition: 'background-color 200ms',
        bgcolor: isActive ? 'rgba(255,255,255,0.20)' : 'transparent',
        fontWeight: isActive ? 600 : 400,
        '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
      }}
    />
  );
}

function Navbar({ children }: Readonly<{ children?: ReactNode }>) {
  return (
    <AppBar
      position="static"
      data-testid="admin-navbar"
      elevation={0}
      sx={{ bgcolor: 'var(--primary)', color: 'var(--primary-foreground)' }}
    >
      <Toolbar sx={{ justifyContent: 'center', gap: 0.5, px: 2 }}>{children}</Toolbar>
    </AppBar>
  );
}

export { Navbar, NavLink };
