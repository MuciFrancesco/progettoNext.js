import type { Metadata } from 'next';
import { ContactFeature } from '@/features/contact/ContactFeature';
import { Suspense } from 'react';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { getTranslator } from '@/lib/i18n/locale';
import { PublicPageFrame } from '@/features/layout/PublicPageFrame';

export const metadata: Metadata = {
  title: 'Contattaci',
};

export default async function ContactPage() {
  const t = await getTranslator();
  return (
    <PublicPageFrame>
      <Suspense
        fallback={
          <GlobalPageLoading title={t('purchaseHistoryTitle')} subtitle={t('loadingAwaitingServer')} />
        }
      >
        <ContactFeature />
      </Suspense>
    </PublicPageFrame>
  );
}
