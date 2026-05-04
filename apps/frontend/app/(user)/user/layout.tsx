import { AppFooter } from '@/components/Footer/AppFooter';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader';
import SessionExpiryWatcher from '@/components/SessionExpiryWatcher/SessionExpiryWatcher';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { getUserFooterSections, getSharedFooterSections } from '@/lib/footer/footerSections';
import CookieConsentController from '@/components/CookieConsent/CookieConsentController';
import React from 'react';

export const dynamic = 'force-dynamic';

export default async function UserLayout({ children }: { children?: React.ReactNode }) {
  const locale = await getCurrentLocale();
  const t = await getTranslator();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      <SessionExpiryWatcher />
      <PublicShopHeader />
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
