'use client';

import { useState, useEffect } from 'react';
import CookieConsentBanner from './CookieConsentBanner';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';

const STORAGE_KEY = 'cookie-consent';

interface ConsentState {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

function loadConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

function saveConsent(analytics: boolean, marketing: boolean) {
  const state: ConsentState = {
    essential: true,
    analytics,
    marketing,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function CookieConsentController({ locale }: Readonly<{ locale: Locale }>) {
  const t = createTranslator(locale);
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!loadConsent()) {
      setVisible(true);
    }
  }, []);

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
      onToggleDetails={() => setShowDetails(true)}
      onAnalyticsChange={setAnalytics}
      onMarketingChange={setMarketing}
    />
  );
}
