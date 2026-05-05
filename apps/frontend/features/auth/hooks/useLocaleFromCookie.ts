'use client';

import type { Locale } from '@/lib/i18n/translation';
import { defaultLocale } from '@/lib/i18n/translation';
import { LOCALE_COOKIE_NAME } from '@/lib/constants';
import { isLocale } from '@/lib/i18n/translator';

export function readLocaleFromCookie(): Locale {
  if (typeof document === 'undefined') {
    return defaultLocale;
  }

  const prefix = `${LOCALE_COOKIE_NAME}=`;

  for (const chunk of document.cookie.split(';')) {
    const candidate = chunk.trim();
    if (!candidate.startsWith(prefix)) {
      continue;
    }

    const value = decodeURIComponent(candidate.slice(prefix.length));
    return isLocale(value) ? value : defaultLocale;
  }

  return defaultLocale;
}
