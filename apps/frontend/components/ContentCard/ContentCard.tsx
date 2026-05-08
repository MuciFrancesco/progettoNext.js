'use client';

import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import styles from './ContentCard.module.scss';

export type ContentCardVariant = 'outlined' | 'elevated';

export type ContentCardProps = {
  readonly variant?: ContentCardVariant;
  readonly children: ReactNode;
  readonly testId?: string;
  readonly onClick?: () => void;
  readonly className?: string;
};

/**
 * Atomic Content Card component.
 * - Always occupies 1/3 of screen width (grid-based: 3 cols on desktop, responsive down to 1 col on mobile)
 * - Uses MUI Box as base with SCSS styling
 * - Can contain flexible content: images, text, links, titles, custom children
 * - Fully responsive across breakpoints
 */
export function ContentCard({
  variant = 'outlined',
  children,
  testId,
  onClick,
  className,
}: Readonly<ContentCardProps>) {
  return (
    <Box
      className={`${styles.contentCard} ${styles[variant]} ${className || ''}`}
      data-testid={testId}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </Box>
  );
}
