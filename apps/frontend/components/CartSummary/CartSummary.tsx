import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import styles from './CartSummary.module.scss';

type CartSummaryLabels = {
  readonly total: string;
  readonly items: string;
  readonly checkout: string;
};

type CartSummaryProps = {
  readonly totalLabel: string;
  readonly hasItems: boolean;
  readonly labels: CartSummaryLabels;
};

export function CartSummary({ totalLabel, hasItems, labels }: Readonly<CartSummaryProps>) {
  return (
    <Paper variant="outlined" className={styles.summary}>
      <Typography variant="h6" className={styles.summaryTitle}>
        {labels.total}
      </Typography>
      <Box className={styles.summaryRow}>
        <Typography className={styles.mutedText}>{labels.items}</Typography>
        <Typography component="strong" className={styles.summaryTotal}>
          {totalLabel}
        </Typography>
      </Box>
      <Button
        component={Link}
        href="/checkout"
        variant="contained"
        disabled={!hasItems}
        data-testid="cart-checkout-button"
        className={styles.checkoutButton}
      >
        {labels.checkout}
      </Button>
    </Paper>
  );
}
