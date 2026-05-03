'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LOCALE_COOKIE_NAME } from '@/lib/i18n/locale';
import { defaultLocale } from '@/lib/i18n/translation';
import { isLocale } from '@/lib/i18n/translator';

export async function setLocaleAction(locale: string, redirectPath: string): Promise<void> {
  const cookieStore = await cookies();
  const safeLocale = isLocale(locale) ? locale : defaultLocale;
  const safeRedirectPath = redirectPath.startsWith('/') ? redirectPath : '/';

  cookieStore.set(LOCALE_COOKIE_NAME, safeLocale, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect(safeRedirectPath);
}
