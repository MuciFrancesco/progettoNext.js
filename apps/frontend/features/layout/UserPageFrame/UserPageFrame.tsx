import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader/PublicShopHeader';
import { FooterFeature } from '@/features/footer/FooterFeature';
import SessionExpiryWatcher from '@/components/SessionExpiryWatcher/SessionExpiryWatcher';
import CookieConsentFeature from '@/features/cookie-consent/CookieConsentFeature';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { getUserFooterSections, getSharedFooterSections } from '@/lib/footer/footerSections';
import { APP_NAME } from '@/lib/constants';
import styles from './UserPageFrame.module.scss';

type UserPageFrameProps = {
  readonly children: ReactNode;
};

export async function UserPageFrame({ children }: Readonly<UserPageFrameProps>) {
  const locale = await getCurrentLocale();
  const t = await getTranslator();

  return (
    <Box component="div" className={styles.shell}>
      <SessionExpiryWatcher />
      <PublicShopHeader />
      <Box component="main" className={styles.main}>
        {children}
      </Box>
      <CookieConsentFeature locale={locale} />
      <FooterFeature
        appName={APP_NAME}
        copyright={t('footerCopyright').replace('{year}', new Date().getFullYear().toString())}
        note={t('footerUserNote')}
        sections={[...getUserFooterSections(t), ...getSharedFooterSections(t)]}
      />
    </Box>
  );
}
