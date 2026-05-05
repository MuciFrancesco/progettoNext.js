import type { Metadata } from 'next';
import { requireUserSession } from '@/lib/auth/session';
import { getTranslator, getCurrentLocale } from '@/lib/i18n/locale';
import { listMyOrders } from '@/lib/api/user';
import { MyOrdersTable } from '@/features/user/components/MyOrdersTable/MyOrdersTable';
import { Suspense } from 'react';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import styles from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('purchaseHistoryTitle') };
}

export default async function PurchaseHistoryPage() {
  await requireUserSession();
  const t = await getTranslator();
  const locale = await getCurrentLocale();

  const [ordersResult] = await Promise.allSettled([
    listMyOrders({ page: 1, limit: 20, filter: 'all' }),
  ]);
  const initialResponse =
    ordersResult.status === 'fulfilled'
      ? ordersResult.value
      : { data: [], total: 0, totalRevenue: 0, grandTotalRevenue: 0 };

  return (
    <Suspense
      fallback={<GlobalPageLoading title={t('purchaseHistoryTitle')} subtitle={t('loadingAwaitingServer')} />}
    >
    <section
      data-testid="purchase-history-page"
      className={styles.page}
    >
      <header>
        <h1 data-testid="purchase-history-title" className={styles.title}>
          {t('purchaseHistoryTitle')}
        </h1>
        <p className={styles.subtitle}>{t('purchaseHistorySubtitle')}</p>
      </header>
      <MyOrdersTable initialResponse={initialResponse} locale={locale} />
    </section>
    </Suspense>
  );
}
