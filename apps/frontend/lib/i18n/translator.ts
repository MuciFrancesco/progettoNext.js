import type { Dictionary } from './dictionary';
import { locales, type Locale, defaultLocale, dictionaries } from './translation';

export type TranslationKey = keyof Dictionary;

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && locales.includes(value as Locale);
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const text = dictionaries[locale][key] ?? dictionaries[defaultLocale][key];

  if (!params) {
    return text;
  }

  return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
    return acc.replace(`{${paramKey}}`, String(paramValue));
  }, text);
}

export function getLanguageOptions(locale: Locale): Array<{ value: Locale; label: string }> {
  return [
    { value: 'it', label: translate(locale, 'languageItalian') },
    { value: 'en', label: translate(locale, 'languageEnglish') },
    { value: 'fr', label: translate(locale, 'languageFrench') },
    { value: 'es', label: translate(locale, 'languageSpanish') },
    { value: 'de', label: translate(locale, 'languageGerman') },
  ];
}

export function createTranslator(locale: Locale) {
  return (key: TranslationKey, params?: Record<string, string | number>) =>
    translate(locale, key, params);
}
