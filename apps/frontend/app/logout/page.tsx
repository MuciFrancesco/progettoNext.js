import { Suspense } from 'react';

import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import LogOutFeature from '@/features/LogOut/LogOutFeature';
import { PublicPageFrame } from '@/features/layout/PublicPageFrame/PublicPageFrame';

export default async function LogoutPage() {
  const [locale, t] = await Promise.all([getCurrentLocale(), getTranslator()]);
  return (
    <PublicPageFrame>
      <Suspense
        fallback={
          <GlobalPageLoading title={t('loadingInProgress')} subtitle={t('loadingAwaitingServer')} />
        }
      >
        <LogOutFeature locale={locale} />
      </Suspense>
    </PublicPageFrame>
  );
}
