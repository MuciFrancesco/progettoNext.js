import type { Metadata } from 'next';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { requireUserSession } from '@/lib/auth/session';
import { UserPageFrame } from '@/features/layout/UserPageFrame/UserPageFrame';
import { CheckoutSuccessFeature } from '@/features/shop/components/CheckoutSuccessFeature/CheckoutSuccessFeature';

export const metadata: Metadata = {
  title: 'Checkout success',
};

export default async function CheckoutSuccessPage() {
  const [, locale] = await Promise.all([requireUserSession(), getCurrentLocale()]);

  return (
    <UserPageFrame>
      <CheckoutSuccessFeature locale={locale} />
    </UserPageFrame>
  );
}
