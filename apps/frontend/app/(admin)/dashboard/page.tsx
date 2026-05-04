import type { Metadata } from 'next';
import { requireAdminOrEmployeeSession } from '@/lib/auth/session';
import { getTranslator, getCurrentLocale } from '@/lib/i18n/locale';
import { listAdminOrders } from '@/lib/api/admin';
import { AdminOrdersTable } from '@/features/admin/components/AdminOrdersTable';
import { getAdminPanelsConfig } from '@/features/admin/config/adminPanels';
import { PanelsGrid } from '@/components/PanelsGrid/PanelsGrid';
import styles from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('navDashboard') };
}

async function AdminPage() {
  const session = await requireAdminOrEmployeeSession();
  const role = session.user.role;
  const t = await getTranslator();
  const locale = await getCurrentLocale();

  const isAdmin = role === 'ADMIN';

  const [ordersResult] = await Promise.allSettled([
    isAdmin ? listAdminOrders({ page: 1, limit: 20, filter: 'all' }) : Promise.resolve(null),
  ]);
  const initialResponse =
    isAdmin && ordersResult.status === 'fulfilled' && ordersResult.value
      ? ordersResult.value
      : { data: [], total: 0, totalRevenue: 0, grandTotalRevenue: 0 };

  const panels = getAdminPanelsConfig(role).map((panel) => ({
    ...panel,
    title: t(panel.titleKey),
    description: t(panel.descKey),
  }));

  return (
    <section data-testid="admin-dashboard-page" className={styles.section}>
      <header>
        <h1 className={styles.title}>{t('adminDashboardTitle')}</h1>
      </header>
      <PanelsGrid panels={panels} goToLabel={t('dashboardPanelGoTo')} />
      {isAdmin && <AdminOrdersTable initialResponse={initialResponse} locale={locale} />}
    </section>
  );
}

export default AdminPage;
