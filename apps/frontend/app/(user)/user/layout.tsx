import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader/PublicShopHeader';
import SessionExpiryWatcher from '@/components/SessionExpiryWatcher/SessionExpiryWatcher';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { getUserFooterSections, getSharedFooterSections } from '@/lib/footer/footerSections';
import CookieConsentController from '@/components/CookieConsent/CookieConsentController';
import { APP_NAME } from '@/lib/constants';
import Box from '@mui/material/Box';
import React from 'react';
import { FooterFeature } from '@/features/layout/FooterFeature';
import styles from './layout.module.scss';

// Reads session cookies on each request, so this layout must stay dynamically rendered.
export const dynamic = 'force-dynamic';

export default async function UserLayout({ children }: { children?: React.ReactNode }) {
  const locale = await getCurrentLocale();
  const t = await getTranslator();

  return (
    <Box component="div" className={styles.shell}>
      <SessionExpiryWatcher />
      <PublicShopHeader />
      <Box component="main" className={styles.main}>
        {children}
      </Box>
      <CookieConsentController locale={locale} />
      <FooterFeature
        appName={APP_NAME}
        copyright={t('footerCopyright').replace('{year}', new Date().getFullYear().toString())}
        note={t('footerUserNote')}
        sections={[...getUserFooterSections(t), ...getSharedFooterSections(t)]}
      />
    </Box>
  );
}
