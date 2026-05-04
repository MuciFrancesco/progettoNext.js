import { getTranslator } from '@/lib/i18n/locale';
import Link from 'next/link';
import styles from './LogOut.module.scss';

export default async function LogOut() {
  const t = await getTranslator();
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>{t('sessionExpiredTitle')}</h1>
      <p className={styles.subtitle}>{t('sessionExpiredSubtitle')}</p>
      <Link
        href="/login?mode=signin"
        className={styles.link}
      >
        {t('sessionExpiredLoginCta')}
      </Link>
    </main>
  );
}
