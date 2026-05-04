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
import React from 'react';

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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background to-muted/30">
      <SessionExpiryWatcher />
      <DashboardHeader
        badgeLabel={badgeLabel}
        navAriaLabel={t('adminDashboardNavAria')}
        links={navLinks}
        rightSlot={
          <>
            <div className="flex items-center gap-2">
              <LocaleSwitcher
                currentLocale={locale}
                label={t('languageLabel')}
                options={getLanguageOptions(locale)}
                testIdPrefix="admin-locale-switcher"
              />
            </div>
            <form data-testid="admin-signout-form" style={{ display: 'contents' }}>
              <LogoutButton locale={locale} testId="admin-signout-button" />
            </form>
          </>
        }
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">{children}</main>
      <AppFooter
        appName="ThinkShop"
        copyright={t('footerCopyright').replace('{year}', new Date().getFullYear().toString())}
        note={t('footerAdminNote')}
        sections={[...getAdminFooterSections(t), ...getSharedFooterSections(t)]}
      />
    </div>
  );
}

