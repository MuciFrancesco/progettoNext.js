'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import type { CartItem } from '@/providers/CartProvider';
import type { Locale } from '@/lib/i18n/translation';
import { formatCurrency } from '@/lib/shop/format';
import styles from './Checkout.module.scss';
import { CardPaymentForm } from './CardPaymentForm';
import type { CardBrand } from './CardPaymentForm';
import type { PaymentMethod } from '@/features/shop/hooks/useCheckoutPage';

type CheckoutStatus = 'idle' | 'loading' | 'ready' | 'processing' | 'paypal-open' | 'error';

type Labels = {
  readonly title: string;
  readonly subtitle: string;
  readonly cardTab: string;
  readonly paypalTab: string;
  readonly summary: string;
  readonly total: string;
  readonly paypalOpening: string;
  readonly paypalAwait: string;
};

type CheckoutProps = {
  readonly items: CartItem[];
  readonly totalInCents: number;
  readonly status: CheckoutStatus;
  readonly message: string;
  readonly labels: Labels;
  readonly locale: Locale;
  readonly selectedMethod: PaymentMethod;
  readonly onMethodChange: (method: PaymentMethod) => void;
  readonly onCardSubmit: (info: { last4: string; brand: CardBrand }) => void;
  readonly onPayPalClick: () => void;
};

export function Checkout({
  items,
  totalInCents,
  status,
  message,
  labels,
  locale,
  selectedMethod,
  onMethodChange,
  onCardSubmit,
  onPayPalClick,
}: Readonly<CheckoutProps>) {
  const isProcessing = status === 'processing';
  const isPaypalOpen = status === 'paypal-open';
  const isLoading = status === 'loading' || status === 'idle';
  const isError = status === 'error';

  return (
    <Box
      component="section"
      data-testid="checkout-page"
      className={styles.pageLayout}
    >
      {/* ── Payment panel ── */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 800, mb: 0.5 }}>
          {labels.title}
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4 }}>
            <CircularProgress size={24} />
            <Typography color="text.secondary">Caricamento...</Typography>
          </Box>
        ) : isError ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {message}
          </Alert>
        ) : (
          <>
            {/* ── Tabs ── */}
            <Tabs
              value={selectedMethod}
              onChange={(_e, v: PaymentMethod) => onMethodChange(v)}
              sx={{ mb: 3, mt: 1.5, borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab
                value="card"
                label={labels.cardTab}
                icon={<CreditCardIcon sx={{ fontSize: 18 }} />}
                iconPosition="start"
                sx={{ textTransform: 'none', fontWeight: 600, minHeight: 44 }}
              />
              <Tab
                value="paypal"
                label={labels.paypalTab}
                icon={<PayPalIcon />}
                iconPosition="start"
                sx={{ textTransform: 'none', fontWeight: 600, minHeight: 44 }}
              />
            </Tabs>

            {/* ── Card form ── */}
            {selectedMethod === 'card' && (
              <CardPaymentForm
                locale={locale}
                totalInCents={totalInCents}
                isProcessing={isProcessing}
                errorMessage={isError ? message : undefined}
                onSubmit={onCardSubmit}
              />
            )}

            {/* ── PayPal ── */}
            {selectedMethod === 'paypal' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {isPaypalOpen ? (
                  <Alert severity="info" icon={false}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CircularProgress size={18} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {labels.paypalOpening}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {labels.paypalAwait}
                        </Typography>
                      </Box>
                    </Box>
                  </Alert>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Verrai reindirizzato alla finestra PayPal per completare il pagamento in sicurezza.
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={onPayPalClick}
                      disabled={isProcessing}
                      sx={{
                        backgroundColor: '#ffc439',
                        color: '#003087',
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        py: 1.5,
                        borderRadius: 3,
                        '&:hover': { backgroundColor: '#f0b429' },
                        '&:disabled': { backgroundColor: '#ffc439', opacity: 0.6 },
                      }}
                    >
                      {isProcessing ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={18} sx={{ color: '#003087' }} />
                          <span>Elaborazione...</span>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PayPalWordmark />
                          <span className={styles.paypalAmount}>
                            {formatCurrency(totalInCents, locale)}
                          </span>
                        </Box>
                      )}
                    </Button>
                    {isError && message && <Alert severity="error">{message}</Alert>}
                  </>
                )}
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* ── Order summary ── */}
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: 'fit-content' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
          {labels.summary}
        </Typography>
        <Box className={styles.summaryList}>
          {items.map((item) => (
            <Box key={item.product.id} className={styles.summaryItem}>
              <Typography variant="body2" sx={{ flex: 1 }}>
                {item.product.title}{' '}
                <Typography component="span" variant="body2" color="text.secondary">
                  × {item.quantity}
                </Typography>
              </Typography>
              <Typography component="strong" variant="body2" sx={{ fontWeight: 800, flexShrink: 0 }}>
                {formatCurrency(item.product.priceInCents * item.quantity, locale)}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box className={styles.totalRow}>
          <Typography sx={{ fontWeight: 600 }}>{labels.total}</Typography>
          <Typography component="strong" sx={{ fontWeight: 800 }}>
            {formatCurrency(totalInCents, locale)}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

// ── PayPal SVG icons ──────────────────────────────────────────────────────────

function PayPalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.5 7.5C19.5 10.8 17.1 13.5 13.5 13.5H11.1L10.2 18H7.5L9.9 6H15C17.7 6 19.5 7.5 19.5 7.5Z"
        fill="#009cde"
      />
      <path
        d="M8.4 15H6L8.1 4.5H13.2C16.2 4.5 18 6 18 8.4C18 11.7 15.6 13.5 12 13.5H9.9L8.4 15Z"
        fill="#003087"
      />
    </svg>
  );
}

function PayPalWordmark() {
  return (
    <svg width="72" height="18" viewBox="0 0 72 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0" y="14" fontSize="14" fontWeight="bold" fill="#003087">
        Pay
      </text>
      <text x="24" y="14" fontSize="14" fontWeight="bold" fill="#009cde">
        Pal
      </text>
    </svg>
  );
}
