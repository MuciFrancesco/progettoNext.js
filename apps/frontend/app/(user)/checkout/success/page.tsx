import type { Metadata } from 'next';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { requireUserSession } from '@/lib/auth/session';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader';
import { CheckoutSuccessFeature } from '@/features/shop/components/CheckoutSuccessFeature';

export const metadata: Metadata = {
  title: 'Checkout success',
};

export default async function CheckoutSuccessPage() {
  const [, locale] = await Promise.all([requireUserSession(), getCurrentLocale()]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      <PublicShopHeader />
      <main className="flex-1">
        <CheckoutSuccessFeature locale={locale} />
      </main>
    </div>
  );
}
