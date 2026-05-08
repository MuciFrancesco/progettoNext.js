import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import React from 'react';
import { DashboardHeaderComposed } from '@/features/admin/ui/dashboard-header/DashboardHeaderComposed';
import { FooterFeature } from '@/features/footer/FooterFeature';
import SessionExpiryWatcher from '@/components/SessionExpiryWatcher/SessionExpiryWatcher';
import LocaleSwitcher from '@/components/LocaleSwitcher/LocaleSwitcher';
import { LogoutButton } from '@/features/LogOut/LogOutButton/LogOutButton';
import {
  getAdminLinks,
  getEmployeeLinks,
} from '@/components/DashboardHeader/helpers/dashboardLinks';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { getLanguageOptions } from '@/lib/i18n/translator';
import { getAdminFooterSections, getSharedFooterSections } from '@/lib/footer/footerSections';
import { getCurrentSession } from '@/lib/auth/session';
import { APP_NAME } from '@/lib/constants';
import styles from './AdminPageFrame.module.scss';

type AdminPageFrameProps = {
  readonly children: ReactNode;
};

export async function AdminPageFrame({ children }: Readonly<AdminPageFrameProps>) {
  const locale = await getCurrentLocale();
  const t = await getTranslator();
  const session = await getCurrentSession();
  const role = session?.user.role ?? 'ADMIN';

  const navLinks =
    role === 'EMPLOYEE'
      ? getEmployeeLinks({
          overview: t('navOverview'),
          addProduct: t('navAddProduct'),
          updateProduct: t('navUpdateProduct'),
        })
      : getAdminLinks({
          overview: t('navOverview'),
          role: t('navRole'),
          addProduct: t('navAddProduct'),
          updateProduct: t('navUpdateProduct'),
          orders: t('navOrders'),
        });

  const badgeLabel = role === 'EMPLOYEE' ? t('employeeControlLabel') : t('adminControlLabel');

  return (
    <Box component="div" className={styles.shell}>
      <SessionExpiryWatcher />
      <DashboardHeaderComposed
        badgeLabel={badgeLabel}
        navAriaLabel={t('adminDashboardNavAria')}
        links={navLinks}
        rightSlot={
          <>
            <Box className={styles.rightControls}>
              <LocaleSwitcher
                currentLocale={locale}
                label={t('languageLabel')}
                options={getLanguageOptions(locale)}
                testIdPrefix="admin-locale-switcher"
              />
            </Box>
            <form data-testid="admin-signout-form" className={styles.signoutForm}>
              <LogoutButton locale={locale} testId="admin-signout-button" />
            </form>
          </>
        }
      />
      <Box component="main" className={styles.main}>
        {children}
      </Box>
      <FooterFeature
        appName={APP_NAME}
        copyright={t('footerCopyright').replace('{year}', new Date().getFullYear().toString())}
        note={t('footerAdminNote')}
        sections={[...getAdminFooterSections(t), ...getSharedFooterSections(t)]}
      />
    </Box>
  );
}
