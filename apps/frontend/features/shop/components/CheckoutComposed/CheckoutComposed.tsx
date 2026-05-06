'use client';

import { Checkout } from '@/components/Checkout/Checkout';
import { CardPaymentForm } from '@/components/Checkout/CardPaymentForm';
import type { CardBrand } from '@/features/shop/helpers/cardPayment';
import type { CartItem } from '@/store/CartContext';
import type { Locale } from '@/lib/i18n/translation';
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

type CheckoutComposedProps = {
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

export function CheckoutComposed({
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
}: Readonly<CheckoutComposedProps>) {
  return (
    <Checkout
      items={items}
      totalInCents={totalInCents}
      status={status}
      message={message}
      labels={labels}
      locale={locale}
      selectedMethod={selectedMethod}
      onMethodChange={onMethodChange}
      cardForm={
        <CardPaymentForm
          locale={locale}
          totalInCents={totalInCents}
          isProcessing={status === 'processing'}
          errorMessage={status === 'error' ? message : undefined}
          onSubmit={onCardSubmit}
        />
      }
      onPayPalClick={onPayPalClick}
    />
  );
}
