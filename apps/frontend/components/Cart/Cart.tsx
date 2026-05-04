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
      sx={{ mx: 'auto', display: 'flex', width: '100%', maxWidth: '64rem', flexDirection: 'column', gap: 3, px: { xs: 2, sm: 3 }, py: 4 }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography component="h1" variant="h3" sx={{ fontWeight: 700 }}>
          {labels.title}
        </Typography>
        <Typography sx={{ color: 'var(--muted-foreground)' }}>{labels.subtitle}</Typography>
      </Box>

      {stockAlerts.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {stockAlerts.map((alert) => (
            <Alert key={`${alert.productId}-${alert.message}`} severity="warning">
              {alert.message}
            </Alert>
          ))}
        </Box>
      ) : null}

      {!hasItems ? (
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <ShoppingBagIcon sx={{ mb: 1, color: 'var(--primary)' }} />
          <Typography sx={{ mb: 2 }}>{labels.empty}</Typography>
          <Button component={Link} href="/" variant="contained" sx={{ borderRadius: 1.5 }}>
            {labels.goToCatalog}
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' }, gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {items.map((item) => (
              <Paper
                key={item.product.id}
                variant="outlined"
                data-testid={`cart-item-${item.product.id}`}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '88px 1fr', sm: '112px 1fr auto' },
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  alignItems: 'center',
                }}
              >
                <Box sx={{ position: 'relative', height: { xs: 80, sm: 96 }, overflow: 'hidden', borderRadius: 1, bgcolor: 'var(--secondary)' }}>
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
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700 }}>{item.product.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
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
                    sx={{ mt: 1, width: 120 }}
                  />
                </Box>
                <Box sx={{ gridColumn: { xs: 'span 2', sm: 'span 1' }, display: 'flex', alignItems: { xs: 'center', sm: 'flex-end' }, justifyContent: 'space-between', flexDirection: { sm: 'column' }, gap: { sm: 1.5 } }}>
                  <Typography sx={{ fontWeight: 800 }}>
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

          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {labels.total}
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ color: 'var(--muted-foreground)' }}>{labels.items}</Typography>
              <Typography component="strong" sx={{ fontWeight: 800 }}>
                {formatCurrency(totalInCents, locale)}
              </Typography>
            </Box>
            <Button
              component={Link}
              href="/checkout"
              variant="contained"
              disabled={!hasItems}
              data-testid="cart-checkout-button"
              sx={{ width: '100%', borderRadius: 1.5 }}
            >
              {labels.checkout}
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
