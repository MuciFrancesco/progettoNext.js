import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import styles from './GlobalPageLoading.module.scss';

type GlobalPageLoadingProps = {
  readonly title: string;
  readonly subtitle: string;
};

export function GlobalPageLoading({ title, subtitle }: Readonly<GlobalPageLoadingProps>) {
  return (
    <Box component="section" className={styles.section}>
      <Box className={styles.spinner} />
      <Box className={styles.textBlock}>
        <Typography variant="h2" className={styles.title}>
          {title}
        </Typography>
        <Typography className={styles.subtitle}>{subtitle}</Typography>
      </Box>
    </Box>
  );
}
