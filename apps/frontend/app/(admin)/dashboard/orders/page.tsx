import type { Metadata } from 'next';
import { requireAdminSession } from '@/lib/auth/session';
import { getTranslator, getCurrentLocale } from '@/lib/i18n/locale';
import { listAdminOrders } from '@/lib/api/admin';
import { AdminOrdersTable } from '@/features/admin/components/AdminOrdersTable/AdminOrdersTable';
import { Suspense } from 'react';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import styles from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('navOrders') };
}

async function AdminOrdersPage() {
  await requireAdminSession();
  const t = await getTranslator();
  const locale = await getCurrentLocale();

  const [ordersResult] = await Promise.allSettled([
    listAdminOrders({ page: 1, limit: 20, filter: 'all' }),
  ]);
  const initialResponse =
    ordersResult.status === 'fulfilled'
      ? ordersResult.value
      : { data: [], total: 0, totalRevenue: 0, grandTotalRevenue: 0 };

  return (
    <Suspense
      fallback={<GlobalPageLoading title={t('navOrders')} subtitle={t('loadingAwaitingServer')} />}
    >
      <section data-testid="admin-orders-page" className={styles.section}>
        <header>
          <h1 className={styles.title}>{t('navOrders')}</h1>
        </header>
        <AdminOrdersTable initialResponse={initialResponse} locale={locale} />
      </section>
    </Suspense>
  );
}

export default AdminOrdersPage;
