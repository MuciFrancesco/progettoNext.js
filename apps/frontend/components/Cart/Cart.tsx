'use client';

import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { CartItem, type CartItemViewModel } from '@/components/CartItem/CartItem';
import { CartSummary } from '@/components/CartSummary/CartSummary';
import styles from './Cart.module.scss';

type CartLabels = {
  readonly title: string;
  readonly subtitle: string;
  readonly empty: string;
  readonly goToCatalog: string;
  readonly quantity: string;
  readonly remove: string;
  readonly total: string;
  readonly items: string;
  readonly checkout: string;
  readonly unitSuffix: string;
};

type CartProps = {
  readonly items: CartItemViewModel[];
  readonly totalLabel: string;
  readonly hasItems: boolean;
  readonly labels: CartLabels;
  readonly stockAlerts: ReadonlyArray<{ readonly productId: string; readonly message: string }>;
  readonly quantityWarnings: Readonly<Record<string, string>>;
  readonly onQuantityChange: (productId: string, quantity: number) => Promise<void> | void;
  readonly onRemove: (productId: string) => void;
};

export function Cart({
  items,
  totalLabel,
  hasItems,
  labels,
  stockAlerts,
  quantityWarnings,
  onQuantityChange,
  onRemove,
}: Readonly<CartProps>) {
  return (
    <Box
      component="section"
      data-testid="cart-page"
      className={styles.page}
    >
      <Box className={styles.header}>
        <Typography component="h1" variant="h3" className={styles.title}>
          {labels.title}
        </Typography>
        <Typography className={styles.mutedText}>{labels.subtitle}</Typography>
      </Box>

      {stockAlerts.length > 0 ? (
        <Box className={styles.alerts}>
          {stockAlerts.map((alert) => (
            <Alert key={`${alert.productId}-${alert.message}`} severity="warning">
              {alert.message}
            </Alert>
          ))}
        </Box>
      ) : null}

      {!hasItems ? (
        <Paper variant="outlined" className={styles.emptyState}>
          <ShoppingBagIcon className={styles.emptyIcon} />
          <Typography className={styles.emptyText}>{labels.empty}</Typography>
          <Button component={Link} href="/" variant="contained" className={styles.roundedButton}>
            {labels.goToCatalog}
          </Button>
        </Paper>
      ) : (
        <Box className={styles.contentGrid}>
          <Box className={styles.itemsList}>
            {items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                labels={labels}
                warningMessage={quantityWarnings[item.productId]}
                onQuantityChange={onQuantityChange}
                onRemove={onRemove}
              />
            ))}
          </Box>

          <CartSummary totalLabel={totalLabel} hasItems={hasItems} labels={labels} />
        </Box>
      )}
    </Box>
  );
}
