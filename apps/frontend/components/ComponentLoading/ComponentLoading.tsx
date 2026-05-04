import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import styles from './ComponentLoading.module.scss';

type ComponentLoadingProps = {
  readonly label: string;
};

export function ComponentLoading({ label }: Readonly<ComponentLoadingProps>) {
  return (
    <Box className={styles.container}>
      <CircularProgress size={16} thickness={5} />
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
}
