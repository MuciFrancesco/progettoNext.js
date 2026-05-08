import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { PublicShopHeader } from '@/components/ShopHeader/PublicShopHeader/PublicShopHeader';
import { FooterFeature } from '@/features/footer/FooterFeature';
import { APP_NAME } from '@/lib/constants';
import { getTranslator } from '@/lib/i18n/locale';
import { getPublicFooterSections, getSharedFooterSections } from '@/lib/footer/footerSections';
import styles from './PublicPageFrame.module.scss';

type PublicPageFrameProps = {
  readonly children: ReactNode;
};

export async function PublicPageFrame({ children }: Readonly<PublicPageFrameProps>) {
  const t = await getTranslator();

  return (
    <Box className={styles.shell}>
      <PublicShopHeader />
      <Box component="main" className={styles.main}>
        {children}
      </Box>
      <FooterFeature
        appName={APP_NAME}
        copyright={t('footerCopyright').replace('{year}', new Date().getFullYear().toString())}
        note={t('footerUserNote')}
        sections={[
          ...getPublicFooterSections(t),
          ...getSharedFooterSections(t).filter((section) => section.title !== t('footerSupport')),
        ]}
      />
    </Box>
  );
}
