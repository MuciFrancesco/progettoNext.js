'use client';

import { Checkout } from '@/components/Checkout/Checkout';
import type { Locale } from '@/lib/i18n/translation';
import { useCheckoutPage } from '../hooks/useCheckoutPage';

export function CheckoutFeature({ locale }: Readonly<{ locale: Locale }>) {
  const checkout = useCheckoutPage(locale);

  return (
    <Checkout
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
