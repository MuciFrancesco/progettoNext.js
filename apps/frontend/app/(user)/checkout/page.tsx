import type { Metadata } from 'next';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { requireUserSession } from '@/lib/auth/session';
import { UserPageFrame } from '@/features/layout/UserPageFrame/UserPageFrame';
import { CheckoutFeature } from '@/features/shop/components/CheckoutFeature/CheckoutFeature';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default async function CheckoutPage() {
  const [, locale] = await Promise.all([requireUserSession(), getCurrentLocale()]);

  return (
    <UserPageFrame>
      <CheckoutFeature locale={locale} />
    </UserPageFrame>
  );
}
