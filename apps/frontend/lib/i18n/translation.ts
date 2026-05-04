import type { Dictionary } from './dictionary';
import { de } from './locales/de';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { it } from './locales/it';

export const locales = ['it', 'en', 'fr', 'es', 'de'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'it';

export const dictionaries: Record<Locale, Dictionary> = {
  it,
  en,
  fr,
  es,
  de,
};
