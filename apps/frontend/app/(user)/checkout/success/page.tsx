import type { Metadata } from 'next';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { requireUserSession } from '@/lib/auth/session';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader/PublicShopHeader';
import { CheckoutSuccessFeature } from '@/features/shop/components/CheckoutSuccessFeature/CheckoutSuccessFeature';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Checkout success',
};

export default async function CheckoutSuccessPage() {
  const [, locale] = await Promise.all([requireUserSession(), getCurrentLocale()]);

  return (
    <div className={styles.shell}>
      <PublicShopHeader />
      <main className="flex-1">
        <CheckoutSuccessFeature locale={locale} />
      </main>
    </div>
  );
}
