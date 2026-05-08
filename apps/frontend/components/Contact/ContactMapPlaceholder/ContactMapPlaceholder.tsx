import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MapIcon from '@mui/icons-material/Map';
import styles from './ContactMapPlaceholder.module.scss';

interface ContactMapPlaceholderProps {
  readonly address: string;
  readonly caption: string;
}

export function ContactMapPlaceholder({ address, caption }: ContactMapPlaceholderProps) {
  return (
    <Paper variant="outlined" className={styles.card}>
      <Box className={styles.iconWrap}>
        <MapIcon className={styles.icon} />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {address}
      </Typography>
      <Typography variant="caption" color="text.disabled">
        {caption}
      </Typography>
    </Paper>
  );
}
