import { getTranslator } from '@/lib/i18n/locale';
import { NotFoundFeature } from '@/features/not-found/NotFoundFeature';

export default async function AdminNotFound() {
  const t = await getTranslator();

  return (
    <NotFoundFeature
      title={t('notFoundTitle')}
      subtitle={t('notFoundSubtitle')}
      homeLabel={t('notFoundGoHome')}
      backLabel={t('notFoundBackToLogin')}
      fromExpiredSession={false}
      expiredCtaLabel={t('sessionExpiredLoginCta')}
    />
  );
}
