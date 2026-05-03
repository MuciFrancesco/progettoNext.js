import Link from 'next/link';
import { cookies } from 'next/headers';
import AutoRedirect from '@/components/utils/AutoRedirect';

import { getCurrentLocale } from '@/lib/i18n/locale';
import { translate } from '@/lib/i18n/translator';
import { BackToPreviousButton } from '@/components/ui/BackToPreviousButton';

const SESSION_EXPIRED_COOKIE_NAME = 'session_expired';

export default async function NotFound() {
  const cookieStore = await cookies();
  const fromExpiredSession = cookieStore.get(SESSION_EXPIRED_COOKIE_NAME)?.value === '1';
  const locale = await getCurrentLocale();

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      {fromExpiredSession ? <AutoRedirect href="/login?mode=signin" /> : null}
      <h1 className="text-3xl font-semibold">{translate(locale, 'notFoundTitle')}</h1>
      <p className="max-w-xl text-sm text-muted-foreground">
        {translate(locale, 'notFoundSubtitle')}
      </p>
      {fromExpiredSession ? (
        <Link
          href="/login?mode=signin"
          className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
        >
          {translate(locale, 'sessionExpiredLoginCta')}
        </Link>
      ) : (
        <BackToPreviousButton
          label={translate(locale, 'notFoundBackToLogin')}
          fallbackHref="/login?mode=signin"
          className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
        />
      )}
    </main>
  );
}
