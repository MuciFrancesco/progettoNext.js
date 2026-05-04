import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { getTranslator } from '@/lib/i18n/locale';

export default async function CartLoading() {
  const t = await getTranslator();

  return <GlobalPageLoading title={t('cartTitle')} subtitle={t('loadingAwaitingServer')} />;
}
