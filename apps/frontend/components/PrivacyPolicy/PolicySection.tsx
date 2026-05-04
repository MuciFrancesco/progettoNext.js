import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import styles from './PolicySection.module.scss';

export interface PolicySectionProps {
  readonly title: string;
  readonly children: ReactNode;
}

export function PolicySection({ title, children }: PolicySectionProps) {
  return (
    <Paper variant="outlined" className={styles.section}>
      <Typography variant="h6" className={styles.title}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
}
