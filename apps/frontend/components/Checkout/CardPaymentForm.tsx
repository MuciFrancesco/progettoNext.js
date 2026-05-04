'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import LockIcon from '@mui/icons-material/Lock';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { formatCurrency } from '@/lib/shop/format';

// ── Card brand detection ──────────────────────────────────────────────────────

export type CardBrand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'unionpay'
  | 'jcb'
  | 'diners'
  | 'unknown';

function detectBrand(raw: string): CardBrand {
  const n = raw.replace(/\D/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^(6011|622|64|65)/.test(n)) return 'discover';
  if (/^62/.test(n)) return 'unionpay';
  if (/^35(2[89]|[3-8])/.test(n)) return 'jcb';
  if (/^3(0[0-5]|[68])/.test(n)) return 'diners';
  return 'unknown';
}

function maxDigits(brand: CardBrand): number {
  if (brand === 'amex') return 15;
  if (brand === 'diners') return 14;
  return 16;
}

function formatCardNumber(raw: string, brand: CardBrand): string {
  const digits = raw.replace(/\D/g, '').slice(0, maxDigits(brand));
  if (brand === 'amex') {
    const m = digits.match(/^(\d{0,4})(\d{0,6})(\d{0,5})$/);
    if (!m) return digits;
    return [m[1], m[2], m[3]].filter(Boolean).join(' ');
  }
  if (brand === 'diners') {
    const m = digits.match(/^(\d{0,4})(\d{0,6})(\d{0,4})$/);
    if (!m) return digits;
    return [m[1], m[2], m[3]].filter(Boolean).join(' ');
  }
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

// ── Brand badge ───────────────────────────────────────────────────────────────

const BRAND_COLORS: Record<CardBrand, string> = {
  visa: '#1a1f71',
  mastercard: '#eb001b',
  amex: '#007bc1',
  discover: '#e65c00',
  unionpay: '#d0021b',
  jcb: '#003087',
  diners: '#004b87',
  unknown: '#bdbdbd',
};

const BRAND_LABEL: Record<CardBrand, string> = {
  visa: 'VISA',
  mastercard: 'MC',
  amex: 'AMEX',
  discover: 'DISC',
  unionpay: 'UP',
  jcb: 'JCB',
  diners: 'DC',
  unknown: '••••',
};

function BrandBadge({ brand }: { brand: CardBrand }) {
  return (
    <Box
      aria-label={brand}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 46,
        height: 28,
        borderRadius: 1,
        backgroundColor: BRAND_COLORS[brand],
        color: '#fff',
        fontSize: '0.65rem',
        fontWeight: 900,
        letterSpacing: '0.04em',
        userSelect: 'none',
        transition: 'background-color 0.25s',
        flexShrink: 0,
      }}
    >
      {BRAND_LABEL[brand]}
    </Box>
  );
}

// ── Luhn check ────────────────────────────────────────────────────────────────

function luhnCheck(digits: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

// ── LocalStorage ──────────────────────────────────────────────────────────────

const LS_KEY = 'thinkshop-saved-card';

type SavedCard = { last4: string; name: string; expiry: string; brand: CardBrand };

function loadSavedCard(): SavedCard | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as SavedCard) : null;
  } catch {
    return null;
  }
}

function persistCard(card: SavedCard) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(card));
  } catch {}
}

function removeSavedCard() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {}
}

function getInitialSavedCard(): SavedCard | null {
  if (typeof window === 'undefined') return null;
  return loadSavedCard();
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  readonly locale: Locale;
  readonly totalInCents: number;
  readonly isProcessing: boolean;
  readonly errorMessage?: string;
  readonly onSubmit: (info: { last4: string; brand: CardBrand }) => void;
};

export function CardPaymentForm({ locale, totalInCents, isProcessing, errorMessage, onSubmit }: Props) {
  const t = createTranslator(locale);

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [wantSave, setWantSave] = useState(false);
  const [saved, setSaved] = useState<SavedCard | null>(getInitialSavedCard);
  const [useSaved, setUseSaved] = useState(() => Boolean(getInitialSavedCard()));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const brand = detectBrand(cardNumber);
  const rawDigits = cardNumber.replace(/\D/g, '');

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const b = detectBrand(e.target.value);
    setCardNumber(formatCardNumber(e.target.value, b));
    setErrors((prev) => ({ ...prev, cardNumber: '' }));
  }

  function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2, 4);
    setExpiry(v);
    setErrors((prev) => ({ ...prev, expiry: '' }));
  }

  function handleCvcChange(e: React.ChangeEvent<HTMLInputElement>) {
    const max = brand === 'amex' ? 4 : 3;
    setCvc(e.target.value.replace(/\D/g, '').slice(0, max));
    setErrors((prev) => ({ ...prev, cvc: '' }));
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  function validate(): boolean {
    if (useSaved && saved) return true;
    const errs: Record<string, string> = {};
    if (rawDigits.length < maxDigits(brand) || !luhnCheck(rawDigits)) {
      errs.cardNumber = t('checkoutCardNumberInvalid');
    }
    const parts = expiry.split('/');
    const mm = parseInt(parts[0] ?? '', 10);
    const yy = parts[1] ?? '';
    if (isNaN(mm) || mm < 1 || mm > 12 || yy.length !== 2) {
      errs.expiry = t('checkoutCardExpiryInvalid');
    }
    const minCvc = brand === 'amex' ? 4 : 3;
    if (cvc.length < minCvc) errs.cvc = t('checkoutCardCvcInvalid');
    if (!name.trim()) errs.name = t('checkoutCardNameRequired');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (useSaved && saved) {
      onSubmit({ last4: saved.last4, brand: saved.brand });
      return;
    }

    const last4 = rawDigits.slice(-4);
    if (wantSave) {
      persistCard({ last4, name: name.trim(), expiry, brand });
    }
    onSubmit({ last4, brand });
  }

  // ── Saved card view ───────────────────────────────────────────────────────────

  if (saved && useSaved) {
    return (
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: 2,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(25,118,210,0.04)',
          }}
        >
          <BrandBadge brand={saved.brand} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t('checkoutSavedCard')} &nbsp;•••• {saved.last4}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {saved.name} &middot; {saved.expiry}
            </Typography>
          </Box>
        </Box>

        <Button
          variant="text"
          size="small"
          onClick={() => {
            removeSavedCard();
            setSaved(null);
            setUseSaved(false);
          }}
          sx={{ alignSelf: 'flex-start', textTransform: 'none', color: 'text.secondary' }}
        >
          {t('checkoutOrNewCard')}
        </Button>

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <PayButton label={isProcessing ? t('checkoutProcessing') : `${t('checkoutPayNow')} · ${formatCurrency(totalInCents, locale)}`} disabled={isProcessing} />
      </Box>
    );
  }

  // ── New card form ─────────────────────────────────────────────────────────────

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {saved && (
        <Button
          variant="text"
          size="small"
          onClick={() => setUseSaved(true)}
          sx={{ alignSelf: 'flex-start', textTransform: 'none' }}
        >
          ← {t('checkoutUseSavedCard')} (•••• {saved.last4})
        </Button>
      )}

      {/* Card number with brand badge */}
      <Box sx={{ position: 'relative' }}>
        <TextField
          label={t('checkoutCardNumber')}
          value={cardNumber}
          onChange={handleNumberChange}
          fullWidth
          error={!!errors.cardNumber}
          helperText={errors.cardNumber}
          slotProps={{ htmlInput: { inputMode: 'numeric', autoComplete: 'cc-number', maxLength: 23 } }}
          placeholder="1234 5678 9012 3456"
          disabled={isProcessing}
          sx={{ '& .MuiInputBase-root': { pr: '60px' } }}
        />
        <Box
          sx={{
            position: 'absolute',
            right: 12,
            top: errors.cardNumber ? 'calc(50% - 10px)' : '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        >
          <BrandBadge brand={brand} />
        </Box>
      </Box>

      {/* Expiry + CVC */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <TextField
          label={t('checkoutCardExpiry')}
          value={expiry}
          onChange={handleExpiryChange}
          error={!!errors.expiry}
          helperText={errors.expiry}
          slotProps={{ htmlInput: { inputMode: 'numeric', autoComplete: 'cc-exp', maxLength: 5 } }}
          placeholder="MM/AA"
          disabled={isProcessing}
        />
        <TextField
          label={t('checkoutCardCvc')}
          value={cvc}
          onChange={handleCvcChange}
          error={!!errors.cvc}
          helperText={errors.cvc}
          slotProps={{
            htmlInput: {
              inputMode: 'numeric',
              autoComplete: 'cc-csc',
              maxLength: brand === 'amex' ? 4 : 3,
            },
          }}
          placeholder={brand === 'amex' ? '1234' : '123'}
          type="password"
          disabled={isProcessing}
        />
      </Box>

      {/* Name on card */}
      <TextField
        label={t('checkoutCardName')}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setErrors((prev) => ({ ...prev, name: '' }));
        }}
        error={!!errors.name}
        helperText={errors.name}
        slotProps={{ htmlInput: { autoComplete: 'cc-name' } }}
        placeholder="Mario Rossi"
        disabled={isProcessing}
      />

      {/* Save card */}
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={wantSave}
            onChange={(e) => setWantSave(e.target.checked)}
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

      <PayButton
        label={isProcessing ? t('checkoutProcessing') : `${t('checkoutPayNow')} · ${formatCurrency(totalInCents, locale)}`}
        disabled={isProcessing}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
        <LockIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
        <Typography variant="caption" color="text.disabled">
          256-bit SSL encryption
        </Typography>
      </Box>
    </Box>
  );
}

function PayButton({ label, disabled }: { label: string; disabled: boolean }) {
  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      disabled={disabled}
      startIcon={<LockIcon />}
      sx={{ mt: 1, py: 1.5, fontWeight: 700, fontSize: '1rem' }}
    >
      {label}
    </Button>
  );
}
