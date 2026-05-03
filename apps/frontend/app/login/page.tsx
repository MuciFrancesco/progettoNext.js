import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getCurrentSession, redirectByRole } from '@/lib/auth/session';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import { getLanguageOptions } from '@/lib/i18n/translator';
import AuthForms from '@/features/auth/components/AuthForms';
import LocaleSwitcher from '@/components/LocaleSwitcher/LocaleSwitcher';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { DashboardHeader } from '@/components/DashboardHeader/DashboardHeader';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('signinTitle') };
}

type LoginPageProps = {
  searchParams?: Promise<{ mode?: string }>;
};

export default async function LoginPage({ searchParams }: Readonly<LoginPageProps>) {
  const params = await searchParams;
  const mode = params?.mode;

  if (mode !== 'signin' && mode !== 'signup') {
    redirect('/login?mode=signin');
  }

  const session = await getCurrentSession();
  const locale = await getCurrentLocale();
  const t = await getTranslator();

  if (session) {
    redirectByRole(session.user.role);
  }

  return (
    <>
      <DashboardHeader
        logoHref="/login"
        rightSlot={
          <LocaleSwitcher
            currentLocale={locale}
            label={t('languageLabel')}
            options={getLanguageOptions(locale)}
            testIdPrefix="login-locale-switcher"
          />
        }
      />

      <main
        data-testid="login-page"
        className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10"
      >
        <div className="w-full max-w-md" data-testid="login-content">
          <Suspense
            fallback={
              <GlobalPageLoading
                title={t('loadingInProgress')}
                subtitle={t('loadingAwaitingServer')}
              />
            }
          >
            <AuthForms locale={locale} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
