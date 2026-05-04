import Link from 'next/link';
import { cookies } from 'next/headers';
import AutoRedirect from '@/components/utils/AutoRedirect';
import { SESSION_EXPIRED_COOKIE_NAME } from '@/lib/auth/session';
import { getCurrentLocale } from '@/lib/i18n/locale';
import { translate } from '@/lib/i18n/translator';
import { BackToPreviousButton } from '@/components/ui/BackToPreviousButton';
import styles from './not-found.module.scss';

export default async function NotFound() {
  const cookieStore = await cookies();
  const fromExpiredSession = cookieStore.get(SESSION_EXPIRED_COOKIE_NAME)?.value === '1';
  const locale = await getCurrentLocale();

  return (
    <main className={styles.page}>
      {fromExpiredSession ? <AutoRedirect href="/login?mode=signin" /> : null}
      <h1 className={styles.title}>{translate(locale, 'notFoundTitle')}</h1>
      <p className={styles.subtitle}>
        {translate(locale, 'notFoundSubtitle')}
      </p>
      {fromExpiredSession ? (
        <Link
          href="/login?mode=signin"
          className={styles.action}
        >
          {translate(locale, 'sessionExpiredLoginCta')}
        </Link>
      ) : (
        <BackToPreviousButton
          label={translate(locale, 'notFoundBackToLogin')}
          fallbackHref="/login?mode=signin"
          className={styles.action}
        />
      )}
    </main>
  );
}
