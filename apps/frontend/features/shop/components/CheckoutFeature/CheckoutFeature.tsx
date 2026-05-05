'use client';

import type { Locale } from '@/lib/i18n/translation';
import { useCheckoutPage } from '@/features/shop/hooks/useCheckoutPage';
import { CheckoutComposed } from '@/features/shop/components/CheckoutComposed/CheckoutComposed';

export function CheckoutFeature({ locale }: Readonly<{ locale: Locale }>) {
  const checkout = useCheckoutPage(locale);

  return (
    <CheckoutComposed
      items={checkout.items}
      totalInCents={checkout.totalInCents}
      status={checkout.status}
      message={checkout.message}
      labels={checkout.labels}
      locale={checkout.locale}
      selectedMethod={checkout.selectedMethod}
      onMethodChange={checkout.setSelectedMethod}
      onCardSubmit={checkout.submitCardPayment}
      onPayPalClick={checkout.openPayPalPopup}
    />
  );
}
