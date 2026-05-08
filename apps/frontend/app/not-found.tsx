import { cookies } from 'next/headers';
import AutoRedirect from '@/components/utils/AutoRedirect';
import { SESSION_EXPIRED_COOKIE_NAME } from '@/lib/auth/session';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { translate } from '@/lib/i18n/translator';
import { PublicPageFrame } from '@/features/layout/PublicPageFrame/PublicPageFrame';
import { NotFoundFeature } from '@/features/not-found/NotFoundFeature';

export default async function NotFound() {
  const cookieStore = await cookies();
  const fromExpiredSession = cookieStore.get(SESSION_EXPIRED_COOKIE_NAME)?.value === '1';
  const locale = await getCurrentLocale();

  return (
    <PublicPageFrame>
      {fromExpiredSession ? <AutoRedirect href="/login?mode=signin" /> : null}

      <NotFoundFeature
        title={translate(locale, 'notFoundTitle')}
        subtitle={translate(locale, 'notFoundSubtitle')}
        homeLabel={translate(locale, 'notFoundGoHome')}
        backLabel={translate(locale, 'notFoundBackToLogin')}
        fromExpiredSession={fromExpiredSession}
        expiredCtaLabel={translate(locale, 'sessionExpiredLoginCta')}
      />
    </PublicPageFrame>
  );
}
