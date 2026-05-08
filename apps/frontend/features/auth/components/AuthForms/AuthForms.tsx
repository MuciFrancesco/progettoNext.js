'use client';

import { lazy, Suspense } from 'react';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { useSearchParams } from 'next/navigation';
import { useAuthForm } from '@/features/auth/hooks/useAuthForm';
import {
  getSigninFormDerivedValues,
  getSignupFormDerivedValues,
} from '@/features/auth/helpers/authFormConfig';
import { AuthHeader } from '@/components/AuthHeader/AuthHeader';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { GlobalPageLoading } from '@/components/GlobalPageLoading/GlobalPageLoading';
import Popup from '@/components/ui/popup';
import styles from './AuthForms.module.scss';
import { Box } from '@mui/material';

const SigninFormCard = lazy(() =>
  import('@/components/SigninFormCard/SigninFormCard').then((m) => ({ default: m.SigninFormCard }))
);
const SignupFormCard = lazy(() =>
  import('@/components/SignupFormCard/SignupFormCard').then((m) => ({ default: m.SignupFormCard }))
);

type AuthFormsProps = {
  readonly locale: Locale;
};

export default function AuthForms({ locale }: Readonly<AuthFormsProps>) {
  const t = createTranslator(locale);
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  const initialMode = modeParam === 'signup' ? 'signup' : 'signin';

  const {
    activeMode,
    handleModeChange,
    serverError,
    remainingAttempts,
    isBlocked,
    signinFormik,
    signupFormik,
    signupPasswordState,
  } = useAuthForm(locale, initialMode);

  const isSigninMode = activeMode === 'signin';
  const isSubmitting = signinFormik.isSubmitting || signupFormik.isSubmitting;

  // Derive values for signin form from container logic
  const signinDerivedValues = getSigninFormDerivedValues(
    signinFormik.values.email,
    remainingAttempts
  );

  // Derive values for signup form from container logic
  const signupDerivedValues = getSignupFormDerivedValues();

  return (
    <Box data-testid="auth-root" className={styles.root}>
      <AuthHeader locale={locale} isSigninMode={isSigninMode} onModeChange={handleModeChange} />

      {serverError ? <Popup message={serverError} type="error" /> : null}

      {isSubmitting ? (
        <GlobalPageLoading title={t('loadingInProgress')} subtitle={t('loadingAwaitingServer')} />
      ) : (
        <Suspense fallback={<ComponentLoading label={t('loadingInProgress')} />}>
          {isSigninMode ? (
            <SigninFormCard
              locale={locale}
              formik={signinFormik}
              remainingAttempts={remainingAttempts}
              isBlocked={isBlocked}
              backendBaseUrl={signinDerivedValues.backendBaseUrl}
              forgotPasswordHref={signinDerivedValues.forgotPasswordHref}
              showWarning={signinDerivedValues.showWarning}
            />
          ) : (
            <SignupFormCard
              locale={locale}
              formik={signupFormik}
              passwordState={signupPasswordState}
              backendBaseUrl={signupDerivedValues.backendBaseUrl}
            />
          )}
        </Suspense>
      )}
    </Box>
  );
}
