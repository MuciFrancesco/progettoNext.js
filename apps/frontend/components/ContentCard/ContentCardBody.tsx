'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import type { ReactNode } from 'react';
import styles from './ContentCardBody.module.scss';

export type ContentCardBodyProps = {
  readonly title?: ReactNode;
  readonly subtitle?: ReactNode;
  readonly children?: ReactNode;
  readonly actions?: ReactNode; // buttons, links, etc.
  readonly testId?: string;
};

/**
 * Sub-component: Body section for ContentCard.
 * Handles title, subtitle, content, and actions with proper spacing and typography.
 * Fully responsive padding and sizing.
 */
export function ContentCardBody({
  title,
  subtitle,
  children,
  actions,
  testId,
}: Readonly<ContentCardBodyProps>) {
  return (
    <Box className={styles.body} data-testid={testId}>
      {title && (
        <Typography variant="h6" className={styles.title} component="h3">
          {title}
        </Typography>
      )}

      {subtitle && (
        <Typography variant="subtitle2" className={styles.subtitle}>
          {subtitle}
        </Typography>
      )}

      {children && <Box className={styles.content}>{children}</Box>}

      {actions && <Box className={styles.actions}>{actions}</Box>}
    </Box>
  );
}

export type ContentCardLinkProps = {
  readonly href: string;
  readonly children: ReactNode;
  readonly external?: boolean;
  readonly testId?: string;
};

/**
 * Sub-component: Styled link for ContentCard.
 * Follows design system for link styling.
 */
export function ContentCardLink({
  href,
  children,
  external = false,
  testId,
}: Readonly<ContentCardLinkProps>) {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={styles.link}
      data-testid={testId}
      underline="hover"
    >
      {children}
    </Link>
  );
}
