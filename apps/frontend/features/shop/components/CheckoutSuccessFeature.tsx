'use client';

import { CheckoutSuccess } from '@/components/CheckoutSuccess/CheckoutSuccess';
import type { Locale } from '@/lib/i18n/translation';
import { useCheckoutSuccess } from '@/features/shop/hooks/useCheckoutSuccess';

export function CheckoutSuccessFeature({ locale }: Readonly<{ locale: Locale }>) {
  const checkoutSuccess = useCheckoutSuccess(locale);

  return <CheckoutSuccess labels={checkoutSuccess.labels} />;
}
