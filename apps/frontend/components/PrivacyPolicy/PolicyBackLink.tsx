'use client';

import MuiLink from '@mui/material/Link';
import NextLink from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface PolicyBackLinkProps {
  label: string;
}

export function PolicyBackLink({ label }: PolicyBackLinkProps) {
  return (
    <MuiLink
      component={NextLink}
      href="/"
      underline="hover"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        mb: 3,
        fontSize: '0.875rem',
        color: 'text.secondary',
        '&:hover': { color: 'primary.main' },
      }}
    >
      <ArrowBackIcon fontSize="small" />
      {label}
    </MuiLink>
  );
}
