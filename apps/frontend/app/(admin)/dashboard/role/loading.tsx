import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { getTranslator } from '@/lib/i18n/locale';

export default async function AdminRoleLoading() {
  const t = await getTranslator();

  return (
    <GlobalPageLoading title={t('rolePageTitle')} subtitle={t('loadingAwaitingServer')} />
  );
}
