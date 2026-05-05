'use client';

import MuiLink from '@mui/material/Link';
import NextLink from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './PolicyBackLink.module.scss';

interface PolicyBackLinkProps {
  label: string;
}

export function PolicyBackLink({ label }: PolicyBackLinkProps) {
  return (
    <MuiLink
      component={NextLink}
      href="/"
      underline="hover"
      className={styles.link}
    >
      <ArrowBackIcon fontSize="small" />
      {label}
    </MuiLink>
  );
}
