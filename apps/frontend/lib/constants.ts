export const APP_NAME = 'ThinkShop';

export const DEFAULT_PAGE_SIZE = 20;

export const PRODUCT_IMAGE_ACCEPTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export const PRODUCT_IMAGE_ACCEPT = PRODUCT_IMAGE_ACCEPTED_MIME_TYPES.join(',');

export const PRODUCT_IMAGE_MAX_SIZE_BYTES = 5 * 1024 * 1024;

export const LOCALE_COOKIE_NAME = 'locale';
