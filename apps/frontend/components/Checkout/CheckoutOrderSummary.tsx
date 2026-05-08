'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { formatCurrency } from '@/lib/shop/format';
import type { CartItem } from '@/store/CartContext';
import type { Locale } from '@/lib/i18n/translation';
import styles from './Checkout.module.scss';

type CheckoutOrderSummaryProps = {
  readonly items: CartItem[];
  readonly totalInCents: number;
  readonly totalLabel: string;
  readonly summaryTitle: string;
  readonly locale: Locale;
};

export function CheckoutOrderSummary({
  items,
  totalInCents,
  totalLabel,
  summaryTitle,
  locale,
}: Readonly<CheckoutOrderSummaryProps>) {
  return (
    <Paper variant="outlined" className={styles.summaryPanel}>
      <Typography variant="h6" className={styles.summaryTitle}>
        {summaryTitle}
      </Typography>
      <Box className={styles.summaryList}>
        {items.map((item) => (
          <Box key={item.product.id} className={styles.summaryItem}>
            <Typography variant="body2" className={styles.summaryText}>
              {item.product.title}&nbsp;
              <Typography component="span" variant="body2" color="text.secondary">
                &times; {item.quantity}
              </Typography>
            </Typography>
            <Typography component="strong" variant="body2" className={styles.strongText}>
              {formatCurrency(item.product.priceInCents * item.quantity, locale)}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box className={styles.totalRow}>
        <Typography className={styles.totalLabel}>{totalLabel}</Typography>
        <Typography component="strong" className={styles.strongText}>
          {formatCurrency(totalInCents, locale)}
        </Typography>
      </Box>
    </Paper>
  );
}
