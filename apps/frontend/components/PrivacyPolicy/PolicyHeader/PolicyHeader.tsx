import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './PolicyHeader.module.scss';

export interface PolicyHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
}

export function PolicyHeader({ title, subtitle }: PolicyHeaderProps) {
  return (
    <Box className={styles.header}>
      <Typography variant="h4" className={styles.title}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}
