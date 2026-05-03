import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { getTranslator } from '@/lib/i18n/locale';

export default async function Loading() {
  const t = await getTranslator();
  return <GlobalPageLoading title={t('loadingInProgress')} subtitle={t('loadingPreparingData')} />;
}
