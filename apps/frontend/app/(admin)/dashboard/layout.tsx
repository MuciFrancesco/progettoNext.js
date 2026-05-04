import { DashboardHeader } from '@/components/DashboardHeader/DashboardHeader';
import {
  getAdminLinks,
  getEmployeeLinks,
} from '@/components/DashboardHeader/helpers/dashboardLinks';
import { AppFooter } from '@/components/Footer/AppFooter';
import SessionExpiryWatcher from '@/components/SessionExpiryWatcher/SessionExpiryWatcher';
import LogoutButton from '@/components/DashboardHeader/LogoutButton';
import LocaleSwitcher from '@/components/LocaleSwitcher/LocaleSwitcher';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { getLanguageOptions } from '@/lib/i18n/translator';
import { getAdminFooterSections, getSharedFooterSections } from '@/lib/footer/footerSections';
import { getCurrentSession } from '@/lib/auth/session';
import { APP_NAME } from '@/lib/constants';
import styles from './layout.module.scss';
import Box from '@mui/material/Box';
import React from 'react';

// Reads session cookies on each request, so this layout must stay dynamically rendered.
export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children?: React.ReactNode }) {
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
      <DashboardHeader
        badgeLabel={badgeLabel}
        navAriaLabel={t('adminDashboardNavAria')}
        links={navLinks}
        rightSlot={
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
      <Box
        component="main"
        sx={{ mx: 'auto', width: '100%', maxWidth: '72rem', px: { xs: 2, sm: 3 }, py: 3 }}
      >
        {children}
      </Box>
      <AppFooter
        appName={APP_NAME}
        copyright={t('footerCopyright').replace('{year}', new Date().getFullYear().toString())}
        note={t('footerAdminNote')}
        sections={[...getAdminFooterSections(t), ...getSharedFooterSections(t)]}
      />
    </Box>
  );
}
