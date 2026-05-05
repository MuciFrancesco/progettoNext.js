'use client';

import MuiLink from '@mui/material/Link';
import NextLink from 'next/link';
import styles from './FooterLink.module.scss';

export interface FooterLinkProps {
  readonly href: string;
  readonly label: string;
  readonly external?: boolean;
}

export function FooterLink({ href, label, external = false }: FooterLinkProps) {
  if (external) {
    return (
      <MuiLink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
        className={styles.link}
      >
        {label}
      </MuiLink>
    );
  }
  return (
    <MuiLink
      component={NextLink}
      href={href}
      underline="hover"
      className={styles.link}
    >
      {label}
    </MuiLink>
  );
}
