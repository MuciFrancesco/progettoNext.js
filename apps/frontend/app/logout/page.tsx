import { Suspense } from 'react';

import { getTranslator } from '@/lib/i18n/locale';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import LogOutFeature from '@/features/LogOut/LogOutFeature';

export default async function LogoutPage() {
  const t = await getTranslator();
  return (
    <Suspense
      fallback={
        <GlobalPageLoading title={t('loadingInProgress')} subtitle={t('loadingAwaitingServer')} />
      }
    >
      <LogOutFeature />
    </Suspense>
  );
}
