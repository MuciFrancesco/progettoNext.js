import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import styles from './FooterSection.module.scss';

export interface FooterSectionItem {
  href: string;
  label: string;
  external?: boolean;
}

export interface FooterSectionProps {
  readonly title: string;
  readonly children?: ReactNode;
}

export function FooterSection({ title, children }: Readonly<FooterSectionProps>) {
  return (
    <Box className={styles.section}>
      <Typography variant="overline" className={styles.title}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}
