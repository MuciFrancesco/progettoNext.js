import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import styles from './ContactInfoCard.module.scss';

export interface ContactInfoCardProps {
  readonly icon: ReactNode;
  readonly title: string;
  readonly primaryText: string;
  readonly secondaryText?: string;
}

export function ContactInfoCard({ icon, title, primaryText, secondaryText }: ContactInfoCardProps) {
  return (
    <Paper variant="outlined" className={styles.card}>
      <Box className={styles.icon}>{icon}</Box>
      <Box>
        <Typography variant="subtitle2" className={styles.title}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {primaryText}
        </Typography>
        {secondaryText && (
          <Typography variant="caption" color="text.secondary">
            {secondaryText}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
