import type { Metadata } from 'next';
import { requireUserSession } from '@/lib/auth/session';
import { getTranslator, getCurrentLocale } from '@/lib/i18n/locale';
import { listMyOrders } from '@/lib/api/user';
import { MyOrdersTable } from '@/features/user/components/MyOrdersTable';
import { Suspense } from 'react';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';

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
      className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10"
    >
      <header>
        <h1 data-testid="purchase-history-title" className="text-2xl font-semibold">
          {t('purchaseHistoryTitle')}
        </h1>
        <p className="text-muted-foreground">{t('purchaseHistorySubtitle')}</p>
      </header>
      <MyOrdersTable initialResponse={initialResponse} locale={locale} />
    </section>
    </Suspense>
  );
}
