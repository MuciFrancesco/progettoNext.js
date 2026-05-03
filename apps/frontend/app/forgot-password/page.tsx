import type { Metadata } from 'next';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import ForgotPasswordForm from '@/components/ForgotPasswordForm/ForgotPasswordForm';
import { Suspense } from 'react';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('forgotPasswordTitle') };
}

type ForgotPasswordPageProps = {
  searchParams?: Promise<{ email?: string }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: Readonly<ForgotPasswordPageProps>) {
  const locale = await getCurrentLocale();
  const t = await getTranslator();
  const params = await searchParams;
  const initialEmail = params?.email ?? '';

  return (
    <main
      data-testid="forgot-password-page"
      className="flex min-h-screen items-center justify-center px-6"
    >
      <Suspense
        fallback={
          <GlobalPageLoading title={t('loadingInProgress')} subtitle={t('loadingAwaitingServer')} />
        }
      >
        <ForgotPasswordForm locale={locale} initialEmail={initialEmail} />
      </Suspense>
    </main>
  );
}
