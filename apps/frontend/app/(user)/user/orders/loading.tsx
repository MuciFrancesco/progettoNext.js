import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { getTranslator } from '@/lib/i18n/locale';

export default async function UserOrdersLoading() {
  const t = await getTranslator();

  return (
    <GlobalPageLoading
      title={t('purchaseHistoryTitle')}
      subtitle={t('loadingAwaitingServer')}
    />
  );
}
