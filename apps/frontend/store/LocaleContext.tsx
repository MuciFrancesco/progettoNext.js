// ─── Locale Context ──────────────────────────────────────────────────────────
// DRY: Single context for all translation needs — eliminates 8+ createTranslator() calls
// SRP: Only handles locale state and translation — no API, no UI

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { LOCALE_COOKIE_NAME } from '@/utils/constants';
import { defaultLocale, type Locale } from '@/lib/i18n/translation';
import { type TranslationKey, translate } from '@/lib/i18n/translator';

// ─── Context Value Interface ────────────────────────────────────────────────

type LocaleContextValue = {
  readonly locale: Locale;
  readonly t: TranslatorFunction;
  readonly setLocaleCookie: (locale: Locale) => void;
};

export type TranslatorFunction = (
  key: TranslationKey | string,
  params?: Record<string, string | number>
) => string;

// ─── Helpers ────────────────────────────────────────────────────────────────

const LOCALE_VALUES: readonly string[] = ['it', 'en', 'fr', 'es', 'de'];

function isKnownLocale(value: string): value is Locale {
  return LOCALE_VALUES.includes(value);
}

function readInitialLocale(): Locale {
  if (typeof document === 'undefined') return defaultLocale;
  try {
    const match = document.cookie.match(
      new RegExp(`(^| )${LOCALE_COOKIE_NAME}=([^;]+)`)
    );
    if (match && isKnownLocale(match[2])) return match[2];
  } catch {
    // Cookie unavailable — use default
  }
  return defaultLocale;
}

// ─── Context ────────────────────────────────────────────────────────────────

const LocaleContext = createContext<LocaleContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function LocaleProvider({
  initialLocale,
  children,
}: Readonly<{
  initialLocale: Locale;
  children: ReactNode;
}>) {
  const [locale, setLocale] = useState<Locale>(initialLocale ?? readInitialLocale());

  const setLocaleCookie = useCallback((newLocale: Locale) => {
    try {
      document.cookie = `${LOCALE_COOKIE_NAME}=${newLocale};path=/;max-age=31536000;SameSite=Lax`;
    } catch {
      // Cookie unavailable — fail silently
    }
    setLocale(newLocale);
  }, []);

  const t = useCallback<TranslatorFunction>(
    (key, params) => translate(locale, key as TranslationKey, params),
    [locale]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, t, setLocaleCookie }),
    [locale, t, setLocaleCookie]
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used inside LocaleProvider');
  }
  return context;
}
