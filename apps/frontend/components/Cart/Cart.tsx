'use client';

import Image from 'next/image';
import Link from 'next/link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import type { CartItem } from '@/providers/CartProvider';
import { formatCurrency, resolveProductImageSrc } from '@/lib/shop/format';
import type { Locale } from '@/lib/i18n/translation';
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
  readonly items: CartItem[];
  readonly totalInCents: number;
  readonly hasItems: boolean;
  readonly labels: CartLabels;
  readonly locale: Locale;
  readonly stockAlerts: ReadonlyArray<{ readonly productId: string; readonly message: string }>;
  readonly onQuantityChange: (productId: string, quantity: number) => void;
  readonly onRemove: (productId: string) => void;
};

export function Cart({
  items,
  totalInCents,
  hasItems,
  labels,
  locale,
  stockAlerts,
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
              <Paper
                key={item.product.id}
                variant="outlined"
                data-testid={`cart-item-${item.product.id}`}
                className={styles.itemCard}
              >
                <Box className={styles.imageFrame}>
                  {item.product.imagePath ? (
                    <Image
                      src={resolveProductImageSrc(item.product.imagePath)}
                      alt={item.product.title}
                      fill
                      sizes="112px"
                      className={styles.containImage}
                      unoptimized
                    />
                  ) : null}
                </Box>
                <Box className={styles.itemInfo}>
                  <Typography className={styles.itemTitle}>{item.product.title}</Typography>
                  <Typography variant="body2" className={styles.mutedText}>
                    {formatCurrency(item.product.priceInCents, locale)} {labels.unitSuffix}
                  </Typography>
                  <TextField
                    type="number"
                    label={labels.quantity}
                    value={item.quantity}
                    size="small"
                    onChange={(event) => onQuantityChange(item.product.id, Number(event.target.value))}
                    slotProps={{
                      htmlInput: {
                        min: 1,
                        max: item.product.stockQuantity,
                        'data-testid': `cart-qty-${item.product.id}`,
                      },
                    }}
                    className={styles.quantityField}
                  />
                </Box>
                <Box className={styles.itemActions}>
                  <Typography className={styles.lineTotal}>
                    {formatCurrency(item.product.priceInCents * item.quantity, locale)}
                  </Typography>
                  <IconButton
                    aria-label={`${labels.remove} ${item.product.title}`}
                    onClick={() => onRemove(item.product.id)}
                    data-testid={`cart-remove-${item.product.id}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>

          <Paper variant="outlined" className={styles.summary}>
            <Typography variant="h6" className={styles.summaryTitle}>
              {labels.total}
            </Typography>
            <Box className={styles.summaryRow}>
              <Typography className={styles.mutedText}>{labels.items}</Typography>
              <Typography component="strong" className={styles.summaryTotal}>
                {formatCurrency(totalInCents, locale)}
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
        </Box>
      )}
    </Box>
  );
}
