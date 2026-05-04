import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { getTranslator } from '@/lib/i18n/locale';

export default async function AdminAddProductLoading() {
  const t = await getTranslator();

  return (
    <GlobalPageLoading
      title={t('addProductPageTitle')}
      subtitle={t('loadingAwaitingServer')}
    />
  );
}
