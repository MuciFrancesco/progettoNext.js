import type { Metadata } from 'next';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import ForgotPasswordFormContainer from '@/features/auth/components/ForgotPasswordFormContainer/ForgotPasswordFormContainer';
import { Suspense } from 'react';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import { PublicPageFrame } from '@/features/layout/PublicPageFrame/PublicPageFrame';
import styles from './page.module.scss';
import { Box } from '@mui/material';

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
    <PublicPageFrame>
      <Box data-testid="forgot-password-page" className={styles.page}>
        <Suspense
          fallback={
            <GlobalPageLoading
              title={t('loadingInProgress')}
              subtitle={t('loadingAwaitingServer')}
            />
          }
        >
          <ForgotPasswordFormContainer locale={locale} initialEmail={initialEmail} />
        </Suspense>
      </Box>
    </PublicPageFrame>
  );
}
