import { cookies } from 'next/headers';
import { defaultLocale, type Locale } from '@/lib/i18n/translation';
import { LOCALE_COOKIE_NAME } from '@/lib/constants';
import { isLocale, translate, type TranslationKey } from '@/lib/i18n/translator';

export { LOCALE_COOKIE_NAME } from '@/lib/constants';

export async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeFromCookie = cookieStore.get(LOCALE_COOKIE_NAME)?.value;

  if (isLocale(localeFromCookie)) {
    return localeFromCookie;
  }

  return defaultLocale;
}

export async function getTranslator() {
  const locale = await getCurrentLocale();
  return (key: TranslationKey, params?: Record<string, string | number>) =>
    translate(locale, key, params);
}
