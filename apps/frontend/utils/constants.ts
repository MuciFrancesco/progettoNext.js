// ─── App Constants ───────────────────────────────────────────────────────────
// Single source of truth for all magic values across the codebase
// YAGNI: Only what's actually used, no speculative exports

export const APP_NAME = 'ThinkShop';
export const DEFAULT_PAGE_SIZE = 20;

// ─── Images ─────────────────────────────────────────────────────────────────

export const MAX_PRODUCT_IMAGES = 10;
export const PRODUCT_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const PRODUCT_IMAGE_ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;
export const PRODUCT_IMAGE_ACCEPT = PRODUCT_IMAGE_ACCEPTED_MIME_TYPES.join(',');

// ─── Cart ───────────────────────────────────────────────────────────────────

export const CART_STORAGE_KEY = 'thinkshop-cart';
export const CART_STOCK_WARNING_DURATION_MS = 2800;

// ─── Hero Slideshow ─────────────────────────────────────────────────────────

export const HERO_SLIDESHOW_INTERVAL_MS = 7000;

// ─── Auth ───────────────────────────────────────────────────────────────────

export const LOCALE_COOKIE_NAME = 'locale';
export const AUTH_COOKIE_NAME = 'access_token';
export const REFRESH_COOKIE_NAME = 'refresh_token';
export const SESSION_EXPIRED_COOKIE_NAME = 'session_expired';
export const AUTH_TOKEN_MAX_AGE_SECONDS = 60 * 15; // 15 min
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// ─── Validation ─────────────────────────────────────────────────────────────

export const EMAIL_MAX_LENGTH = 254;
export const NAME_MAX_LENGTH = 50;
export const SAFE_ERROR_MAX_LENGTH = 200;

// ─── API ────────────────────────────────────────────────────────────────────

export const BACKEND_BASE_URL = process.env.BACKEND_URL ?? 'http://localhost:3333';
export const BACKEND_PUBLIC_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3333';
