import type { Metadata } from 'next';
import { requireAdminSession } from '@/lib/auth/session';
import { getTranslator, getCurrentLocale } from '@/lib/i18n/locale';
import { listAdminOrders } from '@/lib/api/admin';
import { AdminOrdersTable } from '@/features/admin/components/AdminOrdersTable';
import { adminPanelsConfig } from '@/features/admin/config/adminPanels';
import { PanelsGrid } from '@/components/PanelsGrid/PanelsGrid';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('navDashboard') };
}

async function AdminPage() {
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

  const panels = adminPanelsConfig.map((panel) => ({
    ...panel,
    title: t(panel.titleKey),
    description: t(panel.descKey),
  }));

  return (
    <section data-testid="admin-dashboard-page" className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{t('adminDashboardTitle')}</h1>
      </header>
      <PanelsGrid panels={panels} goToLabel={t('dashboardPanelGoTo')} />
      <AdminOrdersTable initialResponse={initialResponse} locale={locale} />
    </section>
  );
}

export default AdminPage;
