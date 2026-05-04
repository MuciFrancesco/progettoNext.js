'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from './CheckoutSuccess.module.scss';

type CheckoutSuccessLabels = {
  readonly title: string;
  readonly subtitle: string;
  readonly backToCatalog: string;
  readonly orders: string;
};

export function CheckoutSuccess({ labels }: Readonly<{ labels: CheckoutSuccessLabels }>) {
  return (
    <Box
      component="section"
      data-testid="checkout-success-page"
      className={styles.pageSection}
    >
      <Paper variant="outlined" className={styles.card}>
        <CheckCircleIcon className={styles.icon} />
        <Typography component="h1" variant="h3" className={styles.title}>
          {labels.title}
        </Typography>
        <Typography className={styles.subtitle}>{labels.subtitle}</Typography>
        <Box className={styles.actions}>
          <Button component={Link} href="/" variant="contained" className={styles.actionButton}>
            {labels.backToCatalog}
          </Button>
          <Button component={Link} href="/user/orders" variant="outlined" className={styles.actionButton}>
            {labels.orders}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
