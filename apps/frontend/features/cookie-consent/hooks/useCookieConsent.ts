'use client';

import { useState } from 'react';
import { shouldShowBanner, saveConsent } from '@/features/cookie-consent/helpers/cookieConsent';

type UseCookieConsentReturn = {
  readonly visible: boolean;
  readonly showDetails: boolean;
  readonly analytics: boolean;
  readonly marketing: boolean;
  readonly handleAcceptAll: () => void;
  readonly handleRejectNonEssential: () => void;
  readonly handleSavePreferences: () => void;
  readonly handleToggleDetails: () => void;
  readonly handleAnalyticsChange: (value: boolean) => void;
  readonly handleMarketingChange: (value: boolean) => void;
};

export function useCookieConsent(): UseCookieConsentReturn {
  const [visible, setVisible] = useState(shouldShowBanner);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  function handleAcceptAll() {
    saveConsent(true, true);
    setVisible(false);
  }

  function handleRejectNonEssential() {
    saveConsent(false, false);
    setVisible(false);
  }

  function handleSavePreferences() {
    saveConsent(analytics, marketing);
    setVisible(false);
  }

  return {
    visible,
    showDetails,
    analytics,
    marketing,
    handleAcceptAll,
    handleRejectNonEssential,
    handleSavePreferences,
    handleToggleDetails: () => setShowDetails(true),
    handleAnalyticsChange: setAnalytics,
    handleMarketingChange: setMarketing,
  };
}
