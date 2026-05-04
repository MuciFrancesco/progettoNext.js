import { AppFooter } from '@/components/Footer/AppFooter';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader';
import SessionExpiryWatcher from '@/components/SessionExpiryWatcher/SessionExpiryWatcher';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { getUserFooterSections, getSharedFooterSections } from '@/lib/footer/footerSections';
import CookieConsentController from '@/components/CookieConsent/CookieConsentController';
import { APP_NAME } from '@/lib/constants';
import Box from '@mui/material/Box';
import React from 'react';

// Reads session cookies on each request, so this layout must stay dynamically rendered.
export const dynamic = 'force-dynamic';

export default async function UserLayout({ children }: { children?: React.ReactNode }) {
  const locale = await getCurrentLocale();
  const t = await getTranslator();

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        minHeight: '100vh',
        flexDirection: 'column',
        background: 'linear-gradient(to bottom, var(--background), color-mix(in oklch, var(--muted) 30%, transparent))',
      }}
    >
      <SessionExpiryWatcher />
      <PublicShopHeader />
      <Box
        component="main"
        sx={{ mx: 'auto', width: '100%', maxWidth: '72rem', px: { xs: 2, sm: 3 }, py: 3 }}
      >
        {children}
      </Box>
      <CookieConsentController locale={locale} />
      <AppFooter
        appName={APP_NAME}
        copyright={t('footerCopyright').replace('{year}', new Date().getFullYear().toString())}
        note={t('footerUserNote')}
        sections={[...getUserFooterSections(t), ...getSharedFooterSections(t)]}
      />
    </Box>
  );
}
