import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { getTranslator } from '@/lib/i18n/locale';

export default async function AdminUpdateProductLoading() {
  const t = await getTranslator();

  return (
    <GlobalPageLoading
      title={t('updateProductPageTitle')}
      subtitle={t('loadingAwaitingServer')}
    />
  );
}
