import { DashboardHeader } from '@/components/DashboardHeader/DashboardHeader';
import { getUserLinks } from '@/components/DashboardHeader/helpers/dashboardLinks';
import { AppFooter } from '@/components/Footer/AppFooter';
import SessionExpiryWatcher from '@/components/SessionExpiryWatcher/SessionExpiryWatcher';
import LogoutButton from '@/components/DashboardHeader/LogoutButton';
import LocaleSwitcher from '@/components/LocaleSwitcher/LocaleSwitcher';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { getLanguageOptions } from '@/lib/i18n/translator';
import { getUserFooterSections, getSharedFooterSections } from '@/lib/footer/footerSections';
import CookieConsentController from '@/components/CookieConsent/CookieConsentController';
import React from 'react';

export const dynamic = 'force-dynamic';

export default async function UserLayout({ children }: { children?: React.ReactNode }) {
  const locale = await getCurrentLocale();
  const t = await getTranslator();

  const userLinks = getUserLinks({
    userArea: t('navUserArea'),
    purchaseHistory: t('navPurchaseHistory'),
  });

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      <SessionExpiryWatcher />
      <DashboardHeader
        badgeLabel={t('userControlLabel')}
        navAriaLabel={t('userDashboardNavAria')}
        links={userLinks}
        rightSlot={
          <>
            <div className="flex items-center gap-2">
              <LocaleSwitcher
                currentLocale={locale}
                label={t('languageLabel')}
                options={getLanguageOptions(locale)}
                testIdPrefix="user-locale-switcher"
              />
            </div>
            <form data-testid="user-signout-form" style={{ display: 'contents' }}>
              <LogoutButton locale={locale} testId="user-signout-button" />
            </form>
          </>
        }
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">{children}</main>
      <CookieConsentController locale={locale} />
      <AppFooter
        appName="ThinkShop"
        copyright={t('footerCopyright').replace('{year}', new Date().getFullYear().toString())}
        note={t('footerUserNote')}
        sections={[...getUserFooterSections(t), ...getSharedFooterSections(t)]}
      />
    </div>
  );
}

