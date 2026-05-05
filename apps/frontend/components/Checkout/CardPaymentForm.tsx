'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import LockIcon from '@mui/icons-material/Lock';
import clsx from 'clsx';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import {
  BRAND_LABEL,
  type CardBrand,
} from '@/features/shop/helpers/cardPayment';
import {
  useCardPaymentForm,
  type CardPaymentSubmitInfo,
} from '@/features/shop/hooks/useCardPaymentForm';
import styles from './Checkout.module.scss';

export type { CardBrand } from '@/features/shop/helpers/cardPayment';

type Props = {
  readonly locale: Locale;
  readonly totalInCents: number;
  readonly isProcessing: boolean;
  readonly errorMessage?: string;
  readonly onSubmit: (info: CardPaymentSubmitInfo) => void;
};

const BRAND_CLASS: Record<CardBrand, string> = {
  visa: styles.brandVisa,
  mastercard: styles.brandMastercard,
  amex: styles.brandAmex,
  discover: styles.brandDiscover,
  unionpay: styles.brandUnionpay,
  jcb: styles.brandJcb,
  diners: styles.brandDiners,
  unknown: styles.brandUnknown,
};

export function CardPaymentForm({
  locale,
  totalInCents,
  isProcessing,
  errorMessage,
  onSubmit,
}: Props) {
  const t = createTranslator(locale);
  const form = useCardPaymentForm({ locale, totalInCents, isProcessing, onSubmit });

  if (form.saved && form.useSaved) {
    return (
      <Box component="form" onSubmit={form.handleSubmit} className={styles.cardForm}>
        <Box className={styles.savedCard}>
          <BrandBadge brand={form.saved.brand} />
          <Box className={styles.savedCardText}>
            <Typography variant="body2" className={styles.savedCardTitle}>
              {t('checkoutSavedCard')} **** {form.saved.last4}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {form.saved.name} - {form.saved.expiry}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="text"
          size="small"
          onClick={form.handleUseNewCard}
          className={styles.textButton}
        >
          {t('checkoutOrNewCard')}
        </Button>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <PayButton label={form.payLabel} disabled={isProcessing} />
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={form.handleSubmit} className={styles.cardForm}>
      {form.saved && (
        <Button
          variant="text"
          size="small"
          onClick={() => form.setUseSaved(true)}
          className={styles.textButton}
        >
          {'<-'} {t('checkoutUseSavedCard')} (**** {form.saved.last4})
        </Button>
      )}

      <Box className={styles.cardNumberField}>
        <TextField
          label={t('checkoutCardNumber')}
          value={form.cardNumber}
          onChange={form.handleNumberChange}
          fullWidth
          error={!!form.errors.cardNumber}
          helperText={form.errors.cardNumber}
          slotProps={{
            htmlInput: { inputMode: 'numeric', autoComplete: 'cc-number', maxLength: 23 },
          }}
          placeholder="1234 5678 9012 3456"
          disabled={isProcessing}
          className={styles.cardNumberInput}
        />
        <Box
          className={clsx(
            styles.brandBadgeAnchor,
            form.errors.cardNumber && styles.brandBadgeAnchorWithError
          )}
        >
          <BrandBadge brand={form.brand} />
        </Box>
      </Box>

      <Box className={styles.cardMetaGrid}>
        <TextField
          label={t('checkoutCardExpiry')}
          value={form.expiry}
          onChange={form.handleExpiryChange}
          error={!!form.errors.expiry}
          helperText={form.errors.expiry}
          slotProps={{ htmlInput: { inputMode: 'numeric', autoComplete: 'cc-exp', maxLength: 5 } }}
          placeholder="MM/AA"
          disabled={isProcessing}
        />
        <TextField
          label={t('checkoutCardCvc')}
          value={form.cvc}
          onChange={form.handleCvcChange}
          error={!!form.errors.cvc}
          helperText={form.errors.cvc}
          slotProps={{
            htmlInput: {
              inputMode: 'numeric',
              autoComplete: 'cc-csc',
              maxLength: form.brand === 'amex' ? 4 : 3,
            },
          }}
          placeholder={form.brand === 'amex' ? '1234' : '123'}
          type="password"
          disabled={isProcessing}
        />
      </Box>

      <TextField
        label={t('checkoutCardName')}
        value={form.name}
        onChange={form.handleNameChange}
        error={!!form.errors.name}
        helperText={form.errors.name}
        slotProps={{ htmlInput: { autoComplete: 'cc-name' } }}
        placeholder="Mario Rossi"
        disabled={isProcessing}
      />

      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={form.wantSave}
            onChange={(e) => form.setWantSave(e.target.checked)}
            disabled={isProcessing}
          />
        }
        label={
          <Typography variant="body2" color="text.secondary">
            {t('checkoutSaveCard')}
          </Typography>
        }
      />

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <PayButton label={form.payLabel} disabled={isProcessing} />

      <Box className={styles.secureRow}>
        <LockIcon className={styles.secureIcon} />
        <Typography variant="caption" color="text.disabled">
          256-bit SSL encryption
        </Typography>
      </Box>
    </Box>
  );
}

function BrandBadge({ brand }: { readonly brand: CardBrand }) {
  return (
    <Box aria-label={brand} className={clsx(styles.brandBadge, BRAND_CLASS[brand])}>
      {BRAND_LABEL[brand]}
    </Box>
  );
}

function PayButton({ label, disabled }: { readonly label: string; readonly disabled: boolean }) {
  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      disabled={disabled}
      startIcon={<LockIcon />}
      className={styles.payButton}
    >
      {label}
    </Button>
  );
}
