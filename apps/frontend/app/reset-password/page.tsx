import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import ResetPasswordFormContainer from '@/features/auth/ui/ResetPasswordFormContainer';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import styles from './page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t('resetPasswordTitle') };
}

type ResetPasswordPageProps = {
  searchParams?: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: Readonly<ResetPasswordPageProps>) {
  const locale = await getCurrentLocale();
  const t = await getTranslator();
  const params = await searchParams;
  const token = params?.token ?? null;

  return (
    <main
      data-testid="reset-password-page"
      className={styles.page}
    >
      <Suspense
        fallback={
          <GlobalPageLoading title={t('loadingInProgress')} subtitle={t('loadingAwaitingServer')} />
        }
      >
        <ResetPasswordFormContainer locale={locale} token={token} />
      </Suspense>
    </main>
  );
}
