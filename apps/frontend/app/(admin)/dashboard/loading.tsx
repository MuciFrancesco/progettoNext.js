import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { getTranslator } from '@/lib/i18n/locale';

export default async function DashboardLoading() {
  const t = await getTranslator();
  return (
    <GlobalPageLoading
      title={t('dashboardLoadingTitle')}
      subtitle={t('dashboardLoadingSubtitle')}
    />
  );
}
