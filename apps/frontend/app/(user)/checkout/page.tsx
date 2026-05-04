import type { Metadata } from 'next';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { requireUserSession } from '@/lib/auth/session';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader';
import { CheckoutFeature } from '@/features/shop/components/CheckoutFeature';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default async function CheckoutPage() {
  const [, locale] = await Promise.all([requireUserSession(), getCurrentLocale()]);

  return (
    <div className={styles.shell}>
      <PublicShopHeader />
      <main className="flex-1">
        <CheckoutFeature locale={locale} />
      </main>
    </div>
  );
}
