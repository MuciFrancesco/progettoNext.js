'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import styles from './Checkout.module.scss';

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

type CheckoutPayPalPanelProps = {
  readonly isPaypalOpen: boolean;
  readonly isProcessing: boolean;
  readonly isError: boolean;
  readonly message: string;
  readonly paypalOpening: string;
  readonly paypalAwait: string;
  readonly paypalRedirectInfo: string;
  readonly processingLabel: string;
  readonly amountLabel: string;
  readonly onPayPalClick: () => void;
};

export function CheckoutPayPalPanel({
  isPaypalOpen,
  isProcessing,
  isError,
  message,
  paypalOpening,
  paypalAwait,
  paypalRedirectInfo,
  processingLabel,
  amountLabel,
  onPayPalClick,
}: Readonly<CheckoutPayPalPanelProps>) {
  if (isPaypalOpen) {
    return (
      <Box className={styles.paypalPanel}>
        <Alert severity="info" icon={false}>
          <Box className={styles.paypalLoading}>
            <CircularProgress size={18} />
            <Box>
              <Typography variant="body2" className={styles.paypalLoadingTitle}>
                {paypalOpening}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {paypalAwait}
              </Typography>
            </Box>
          </Box>
        </Alert>
      </Box>
    );
  }

  return (
    <Box className={styles.paypalPanel}>
      <Typography variant="body2" color="text.secondary">
        {paypalRedirectInfo}
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={onPayPalClick}
        disabled={isProcessing}
        className={styles.paypalButton}
      >
        {isProcessing ? (
          <Box className={styles.inlineCenter}>
            <CircularProgress size={18} className={styles.paypalSpinner} />
            <Typography component="span" variant="body2">
              {processingLabel}
            </Typography>
          </Box>
        ) : (
          <Box className={styles.inlineCenter}>
            <PayPalWordmark />
            <Typography component="span" variant="body2" className={styles.paypalAmount}>
              {amountLabel}
            </Typography>
          </Box>
        )}
      </Button>
      {isError && message && <Alert severity="error">{message}</Alert>}
    </Box>
  );
}
