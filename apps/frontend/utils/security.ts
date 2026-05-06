// ─── Security Utilities ──────────────────────────────────────────────────────
// Centralized sanitization to prevent XSS, injection, and information disclosure
// DRY: Single source of truth for all sanitization logic

const SAFE_TEXT_PATTERN = /^[\w\s.,!?:;'"()\-@%/+#]+$/u;

/**
 * Sanitizes a string for safe UI rendering.
 * Strips HTML/XML tags, removes angle brackets, trims whitespace.
 * XSS Prevention: Never trust user input in the UI layer.
 */
export function sanitizeText(raw: unknown, maxLength = 5000): string {
  if (typeof raw !== 'string' && typeof raw !== 'number') return '';
  const str = String(raw);
  const withoutTags = str
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim();
  return withoutTags.slice(0, maxLength);
}

/**
 * Sanitizes an image URL to prevent javascript:/data: injection.
 * Only allows http, https, and relative paths.
 * XSS Prevention: Never render unsanitized URLs in <img src>.
 */
export function sanitizeImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('javascript:')) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url;
  }
  return `/${url}`;
}

/**
 * Returns a safe error message for user display.
 * KISS: If the message looks suspicious, return a generic fallback.
 * Security: Prevents information disclosure through error messages.
 */
export function toSafeErrorMessage(raw: unknown, fallback: string): string {
  if (typeof raw !== 'string') return fallback;
  if (raw.length > 200) return fallback;
  if (!SAFE_TEXT_PATTERN.test(raw)) return fallback;
  return raw;
}

/**
 * Safely decodes a JWT payload without verification.
 * Security: This only reads the payload — NEVER trust it for auth decisions
 * on the client side. Server-side verification is required.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8')
    ) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Email validation with ReDoS-safe regex.
 * KISS: Simple regex, no over-engineering. Server does the real validation.
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email);
}

/**
 * Password strength check.
 * Returns 'empty' | 'weak' | 'strong' for UI feedback.
 * SRP: Only checks strength, doesn't validate form state.
 */
export type PasswordStrength = 'empty' | 'weak' | 'strong';

export function checkPasswordStrength(password: string): PasswordStrength {
  if (!password) return 'empty';
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W_]{8,}$/;
  return strongRegex.test(password) ? 'strong' : 'weak';
}

/**
 * Generic validation result type.
 */
export type ValidationResult = {
  readonly isValid: boolean;
  readonly errorKey?: string;
};
