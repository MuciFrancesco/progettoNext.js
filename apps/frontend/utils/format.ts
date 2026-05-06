// ─── Format Utilities ───────────────────────────────────────────────────────
// Pure functions for data formatting — no side effects, no React dependencies
// DRY: Single source of truth for all formatting logic across the codebase

import type { ProductCategory } from '@/types/api/product';
import { BACKEND_PUBLIC_URL } from '@/utils/constants';

// ─── Locale mapping ─────────────────────────────────────────────────────────

const LOCALE_MAP: Record<string, string> = {
  it: 'it-IT',
  en: 'en-GB',
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de-DE',
};

export function toDisplayLocale(locale: string): string {
  return LOCALE_MAP[locale] ?? 'it-IT';
}

// ─── Currency ───────────────────────────────────────────────────────────────

/**
 * Formats a price in cents to EUR currency string.
 * Pure function — no side effects, testable in isolation.
 */
export function formatCurrency(valueInCents: number, locale: string = 'it'): string {
  return new Intl.NumberFormat(toDisplayLocale(locale), {
    style: 'currency',
    currency: 'EUR',
  }).format(valueInCents / 100);
}

// ─── Images ─────────────────────────────────────────────────────────────────

/**
 * Resolves a product image path to a full URL.
 * If the path is already absolute (http/https/data:), returns as-is.
 * Otherwise prepends the backend URL.
 */
export function resolveProductImageSrc(imagePath: string): string {
  if (!imagePath || imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  const prefix = imagePath.startsWith('/') ? '' : '/';
  return `${BACKEND_PUBLIC_URL}${prefix}${imagePath}`;
}

// ─── Categories ─────────────────────────────────────────────────────────────

const CATEGORY_KEY_MAP: Record<ProductCategory, string> = {
  TECHNOLOGY: 'categoryTechnology',
  HOME: 'categoryHome',
  CLOTHING: 'categoryClothing',
  SPORTS: 'categorySports',
  BOOKS: 'categoryBooks',
  FOOD: 'categoryFood',
  BEAUTY: 'categoryBeauty',
  TOYS: 'categoryToys',
  OTHER: 'categoryOther',
};

/**
 * Returns the translation key for a product category.
 * DRY: Eliminates inline mapping duplicated across 4+ files.
 */
export function categoryTranslationKey(category: ProductCategory): string {
  return CATEGORY_KEY_MAP[category] ?? 'categoryOther';
}

// ─── Users ──────────────────────────────────────────────────────────────────

/**
 * Formats user name from possibly-null fields.
 */
export function formatUserName(
  firstname: string | null | undefined,
  lastname: string | null | undefined
): string {
  return [firstname ?? '', lastname ?? ''].filter(Boolean).join(' ') || '—';
}

/**
 * Formats an order filter label for display.
 */
export function formatOrderFilterLabel(filter: string, t: (key: string) => string): string {
  const keyMap: Record<string, string> = {
    today: 'ordersFilterToday',
    week: 'ordersFilterWeek',
    month: 'ordersFilterMonth',
    year: 'ordersFilterYear',
    all: 'ordersFilterAll',
  };
  return t(keyMap[filter] ?? 'ordersFilterAll');
}

// ─── Text ───────────────────────────────────────────────────────────────────

/**
 * Truncates text to maxLength with ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

/**
 * Pluralizes a word based on count.
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}
