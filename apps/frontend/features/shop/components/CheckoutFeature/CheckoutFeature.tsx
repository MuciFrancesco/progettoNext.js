'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { formatCurrency } from '@/lib/shop/format';
import type { Locale } from '@/lib/i18n/translation';
import { useCheckoutPage } from '@/features/shop/hooks/useCheckoutPage';
import { CardPaymentForm } from '@/components/Checkout/CardPaymentForm';
import { CheckoutPayPalPanel } from '@/components/Checkout/CheckoutPayPalPanel';
import { CheckoutOrderSummary } from '@/components/Checkout/CheckoutOrderSummary';
import { CheckoutPaymentTabs } from '@/components/Checkout/CheckoutPaymentTabs';
import styles from '@/components/Checkout/Checkout.module.scss';

export function CheckoutFeature({ locale }: Readonly<{ locale: Locale }>) {
  const checkout = useCheckoutPage(locale);

  const isError = checkout.status === 'error';
  const isLoading = checkout.status === 'loading' || checkout.status === 'idle';
  const isProcessing = checkout.status === 'processing';
  const isPaypalOpen = checkout.status === 'paypal-open';

  let panelContent: React.ReactNode;

  if (isLoading) {
    panelContent = (
      <Box className={styles.loadingRow}>
        <CircularProgress size={24} />
        <Typography color="text.secondary">{checkout.labels.loading}</Typography>
      </Box>
    );
  } else if (isError) {
    panelContent = (
      <Alert severity="error" className={styles.errorAlert}>
        {checkout.message}
      </Alert>
    );
  } else {
    panelContent = (
      <>
        <CheckoutPaymentTabs
          selectedMethod={checkout.selectedMethod}
          cardTab={checkout.labels.cardTab}
          paypalTab={checkout.labels.paypalTab}
          onMethodChange={checkout.setSelectedMethod}
        />

        {checkout.selectedMethod === 'card' && (
          <CardPaymentForm
            locale={checkout.locale}
            totalInCents={checkout.totalInCents}
            isProcessing={isProcessing}
            errorMessage={isError ? checkout.message : undefined}
            onSubmit={checkout.submitCardPayment}
          />
        )}

        {checkout.selectedMethod === 'paypal' && (
          <CheckoutPayPalPanel
            isPaypalOpen={isPaypalOpen}
            isProcessing={isProcessing}
            isError={isError}
            message={checkout.message}
            paypalOpening={checkout.labels.paypalOpening}
            paypalAwait={checkout.labels.paypalAwait}
            paypalRedirectInfo={checkout.labels.paypalRedirectInfo}
            processingLabel={checkout.labels.processing}
            amountLabel={formatCurrency(checkout.totalInCents, checkout.locale)}
            onPayPalClick={checkout.openPayPalPopup}
          />
        )}
      </>
    );
  }

  return (
    <Box component="section" data-testid="checkout-page" className={styles.pageLayout}>
      <Paper variant="outlined" className={styles.panel}>
        <Typography variant="h5" component="h1" className={styles.title}>
          {checkout.labels.title}
        </Typography>

        {panelContent}
      </Paper>

      <CheckoutOrderSummary
        items={checkout.items}
        totalInCents={checkout.totalInCents}
        totalLabel={checkout.labels.total}
        summaryTitle={checkout.labels.summary}
        locale={checkout.locale}
      />
    </Box>
  );
}
