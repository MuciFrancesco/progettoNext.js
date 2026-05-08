'use client';

import CookieConsentBanner from '@/components/CookieConsent/CookieConsentBanner';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { useCookieConsent } from '@/features/cookie-consent/hooks/useCookieConsent';

export default function CookieConsentFeature({ locale }: Readonly<{ locale: Locale }>) {
  const t = createTranslator(locale);
  const {
    visible,
    showDetails,
    analytics,
    marketing,
    handleAcceptAll,
    handleRejectNonEssential,
    handleSavePreferences,
    handleToggleDetails,
    handleAnalyticsChange,
    handleMarketingChange,
  } = useCookieConsent();

  if (!visible) return null;

  return (
    <CookieConsentBanner
      t={t}
      showDetails={showDetails}
      analytics={analytics}
      marketing={marketing}
      onAcceptAll={handleAcceptAll}
      onRejectNonEssential={handleRejectNonEssential}
      onSavePreferences={handleSavePreferences}
      onToggleDetails={handleToggleDetails}
      onAnalyticsChange={handleAnalyticsChange}
      onMarketingChange={handleMarketingChange}
    />
  );
}
