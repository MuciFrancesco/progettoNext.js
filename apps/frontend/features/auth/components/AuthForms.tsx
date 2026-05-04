'use client';

import { lazy, Suspense } from 'react';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { useSearchParams } from 'next/navigation';
import { useAuthForm } from '@/features/auth/hooks/useAuthForm';
import { AuthHeader } from '@/components/AuthHeader/AuthHeader';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { Footer } from '@/components/Footer/Footer';
import Popup from '@/components/ui/popup';
import styles from './AuthForms.module.scss';

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

  return (
    <div data-testid="auth-root" className={styles.root}>
      <AuthHeader locale={locale} isSigninMode={isSigninMode} onModeChange={handleModeChange} />

      {serverError ? <Popup message={serverError} type="error" /> : null}

      <Suspense fallback={<ComponentLoading label={t('loadingInProgress')} />}>
        {isSigninMode ? (
          <SigninFormCard
            locale={locale}
            formik={signinFormik}
            remainingAttempts={remainingAttempts}
            isBlocked={isBlocked}
          />
        ) : (
          <SignupFormCard
            locale={locale}
            formik={signupFormik}
            passwordState={signupPasswordState}
          />
        )}
      </Suspense>
      <Footer locale={locale} />
    </div>
  );
}
