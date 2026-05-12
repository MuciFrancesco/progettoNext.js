import type { Metadata } from 'next';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { PublicPageFrame } from '@/features/layout/PublicPageFrame/PublicPageFrame';
import { CartFeature } from '@/features/shop/components/CartFeature/CartFeature';

export const metadata: Metadata = {
  title: 'Cart',
};

export default async function CartPage() {
  const locale = await getCurrentLocale();

  return (
    <PublicPageFrame>
      <CartFeature locale={locale} />
    </PublicPageFrame>
  );
}
