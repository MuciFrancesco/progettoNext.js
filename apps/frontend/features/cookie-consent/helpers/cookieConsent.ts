const STORAGE_KEY = 'cookie-consent';

export interface ConsentState {
  readonly essential: true;
  readonly analytics: boolean;
  readonly marketing: boolean;
  readonly timestamp: string;
}

export function loadConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean, marketing: boolean): void {
  const state: ConsentState = {
    essential: true,
    analytics,
    marketing,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function shouldShowBanner(): boolean {
  if (typeof window === 'undefined') return false;
  return !loadConsent();
}
