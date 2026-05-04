import type { Metadata } from 'next';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { requireUserSession } from '@/lib/auth/session';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader';
import { CheckoutFeature } from '@/features/shop/components/CheckoutFeature';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default async function CheckoutPage() {
  const [, locale] = await Promise.all([requireUserSession(), getCurrentLocale()]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      <PublicShopHeader />
      <main className="flex-1">
        <CheckoutFeature locale={locale} />
      </main>
    </div>
  );
}
