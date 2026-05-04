import type { Metadata } from 'next';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader';
import { CartFeature } from '@/features/shop/components/CartFeature';

export const metadata: Metadata = {
  title: 'Cart',
};

export default async function CartPage() {
  const locale = await getCurrentLocale();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      <PublicShopHeader />
      <main className="flex-1">
        <CartFeature locale={locale} />
      </main>
    </div>
  );
}
