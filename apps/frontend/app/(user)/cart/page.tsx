import type { Metadata } from 'next';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader/PublicShopHeader';
import { CartFeature } from '@/features/shop/components/CartFeature/CartFeature';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Cart',
};

export default async function CartPage() {
  const locale = await getCurrentLocale();

  return (
    <div className={styles.shell}>
      <PublicShopHeader />
      <main className="flex-1">
        <CartFeature locale={locale} />
      </main>
    </div>
  );
}
