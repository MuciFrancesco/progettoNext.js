export type CardBrand =
  | 'visa'
  | 'mastercard'
  | 'amex'
  | 'discover'
  | 'unionpay'
  | 'jcb'
  | 'diners'
  | 'unknown';

export type SavedCard = {
  readonly last4: string;
  readonly name: string;
  readonly expiry: string;
  readonly brand: CardBrand;
};

const LS_KEY = 'thinkshop-saved-card';

export const BRAND_LABEL: Record<CardBrand, string> = {
  visa: 'VISA',
  mastercard: 'MC',
  amex: 'AMEX',
  discover: 'DISC',
  unionpay: 'UP',
  jcb: 'JCB',
  diners: 'DC',
  unknown: '****',
};

export function detectBrand(raw: string): CardBrand {
  const n = raw.replace(/\D/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^(6011|622|64|65)/.test(n)) return 'discover';
  if (/^62/.test(n)) return 'unionpay';
  if (/^35(2[89]|[3-8])/.test(n)) return 'jcb';
  if (/^3(0[0-5]|[68])/.test(n)) return 'diners';
  return 'unknown';
}

export function maxDigits(brand: CardBrand): number {
  if (brand === 'amex') return 15;
  if (brand === 'diners') return 14;
  return 16;
}

export function formatCardNumber(raw: string, brand: CardBrand): string {
  const digits = raw.replace(/\D/g, '').slice(0, maxDigits(brand));
  if (brand === 'amex') {
    const m = digits.match(/^(\d{0,4})(\d{0,6})(\d{0,5})$/);
    if (!m) return digits;
    return [m[1], m[2], m[3]].filter(Boolean).join(' ');
  }
  if (brand === 'diners') {
    const m = digits.match(/^(\d{0,4})(\d{0,6})(\d{0,4})$/);
    if (!m) return digits;
    return [m[1], m[2], m[3]].filter(Boolean).join(' ');
  }
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function luhnCheck(digits: string): boolean {
  let sum = 0;
  let alt = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }

  return sum % 10 === 0;
}

export function loadSavedCard(): SavedCard | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as SavedCard) : null;
  } catch {
    return null;
  }
}

export function persistCard(card: SavedCard) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(card));
  } catch {}
}

export function removeSavedCard() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {}
}

export function getInitialSavedCard(): SavedCard | null {
  if (typeof window === 'undefined') return null;
  return loadSavedCard();
}
