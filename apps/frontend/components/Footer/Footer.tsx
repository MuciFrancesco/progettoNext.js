import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import styles from './Footer.module.scss';

export function Footer({ locale }: Readonly<{ locale: Locale }>) {
  const t = createTranslator(locale);
  return (
    <footer className={styles.footer}>
      {t('footerCopyright').replace('{year}', new Date().getFullYear().toString())}
    </footer>
  );
}
