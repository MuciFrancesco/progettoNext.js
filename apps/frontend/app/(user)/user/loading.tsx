import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { getTranslator } from '@/lib/i18n/locale';

export default async function UserAreaLoading() {
  const t = await getTranslator();

  return <GlobalPageLoading title={t('userAreaTitle')} subtitle={t('loadingAwaitingServer')} />;
}
