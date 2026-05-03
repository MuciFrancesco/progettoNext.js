import type { Metadata } from 'next';
import { PrivacyFeature } from '@/features/privacy/PrivacyFeature';
import { getTranslator } from '@/lib/i18n/locale';
import { Suspense } from 'react';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default async function PrivacyPage() {
  const t = await getTranslator();
  return (
    <Suspense
      fallback={
        <GlobalPageLoading
          title={t('purchaseHistoryTitle')}
          subtitle={t('loadingAwaitingServer')}
        />
      }
    >
      <PrivacyFeature />
    </Suspense>
  );
}
