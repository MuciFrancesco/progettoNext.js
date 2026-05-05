import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';
import { formatCurrency } from '@/lib/shop/format';
import {
  detectBrand,
  formatCardNumber,
  getInitialSavedCard,
  luhnCheck,
  maxDigits,
  persistCard,
  removeSavedCard,
  type CardBrand,
  type SavedCard,
} from '@/features/shop/helpers/cardPayment';

export type CardPaymentSubmitInfo = {
  readonly last4: string;
  readonly brand: CardBrand;
};

type UseCardPaymentFormParams = {
  readonly locale: Locale;
  readonly totalInCents: number;
  readonly isProcessing: boolean;
  readonly onSubmit: (info: CardPaymentSubmitInfo) => void;
};

export function useCardPaymentForm({
  locale,
  totalInCents,
  isProcessing,
  onSubmit,
}: UseCardPaymentFormParams) {
  const t = useMemo(() => createTranslator(locale), [locale]);
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
  const payLabel = isProcessing
    ? t('checkoutProcessing')
    : `${t('checkoutPayNow')} - ${formatCurrency(totalInCents, locale)}`;

  function handleNumberChange(e: ChangeEvent<HTMLInputElement>) {
    const nextBrand = detectBrand(e.target.value);
    setCardNumber(formatCardNumber(e.target.value, nextBrand));
    setErrors((prev) => ({ ...prev, cardNumber: '' }));
  }

  function handleExpiryChange(e: ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
    setExpiry(value);
    setErrors((prev) => ({ ...prev, expiry: '' }));
  }

  function handleCvcChange(e: ChangeEvent<HTMLInputElement>) {
    const max = brand === 'amex' ? 4 : 3;
    setCvc(e.target.value.replace(/\D/g, '').slice(0, max));
    setErrors((prev) => ({ ...prev, cvc: '' }));
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
    setErrors((prev) => ({ ...prev, name: '' }));
  }

  function handleUseNewCard() {
    removeSavedCard();
    setSaved(null);
    setUseSaved(false);
  }

  function validate(): boolean {
    if (useSaved && saved) return true;

    const nextErrors: Record<string, string> = {};
    if (rawDigits.length < maxDigits(brand) || !luhnCheck(rawDigits)) {
      nextErrors.cardNumber = t('checkoutCardNumberInvalid');
    }

    const parts = expiry.split('/');
    const mm = parseInt(parts[0] ?? '', 10);
    const yy = parts[1] ?? '';
    if (Number.isNaN(mm) || mm < 1 || mm > 12 || yy.length !== 2) {
      nextErrors.expiry = t('checkoutCardExpiryInvalid');
    }

    const minCvc = brand === 'amex' ? 4 : 3;
    if (cvc.length < minCvc) nextErrors.cvc = t('checkoutCardCvcInvalid');
    if (!name.trim()) nextErrors.name = t('checkoutCardNameRequired');

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
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

  return {
    brand,
    cardNumber,
    cvc,
    errors,
    expiry,
    name,
    payLabel,
    saved,
    useSaved,
    wantSave,
    handleCvcChange,
    handleExpiryChange,
    handleNameChange,
    handleNumberChange,
    handleSubmit,
    handleUseNewCard,
    setUseSaved,
    setWantSave,
  };
}
