import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';

export function Footer({ locale }: Readonly<{ locale: Locale }>) {
  const t = createTranslator(locale);
  return (
    <footer className="mt-4 text-center text-xs text-muted-foreground">
      {t('footerCopyright').replace('{year}', new Date().getFullYear().toString())}
    </footer>
  );
}
