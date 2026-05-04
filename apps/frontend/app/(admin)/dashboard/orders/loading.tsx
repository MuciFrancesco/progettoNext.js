import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { getTranslator } from '@/lib/i18n/locale';

export default async function AdminOrdersLoading() {
  const t = await getTranslator();

  return <GlobalPageLoading title={t('navOrders')} subtitle={t('loadingAwaitingServer')} />;
}
