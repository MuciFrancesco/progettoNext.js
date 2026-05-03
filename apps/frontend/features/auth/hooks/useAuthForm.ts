'use client';

import { signinAction, signupAction } from '@/lib/actions/auth';
import type { SigninRequest, SignupRequest } from '@/types/api/auth';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';

export type SignupPasswordState = 'idle' | 'weak' | 'strong';

type SigninFormValues = {
  email: string;
  password: string;
};

type SignupFormValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W_]{8,}$/;

export function useAuthForm(locale: Locale, initialMode: 'signin' | 'signup' = 'signin') {
  const t = createTranslator(locale);
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<'signin' | 'signup'>(initialMode);
  const [serverError, setServerError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | undefined>(undefined);
  const [isBlocked, setIsBlocked] = useState(false);
  const [signupPasswordState, setSignupPasswordState] = useState<SignupPasswordState>('idle');

  const resetAuthState = () => {
    setServerError(null);
    setRemainingAttempts(undefined);
    setIsBlocked(false);
  };

  const resolveSignupPasswordState = (password: string): SignupPasswordState => {
    if (!password) {
      return 'idle';
    }

    return strongPasswordRegex.test(password) ? 'strong' : 'weak';
  };

  const signinFormik = useFormik<SigninFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => {
      const errors: Partial<Record<keyof SigninRequest, string>> = {};

      if (!values.email) {
        errors.email = t('validationEmailRequired');
      } else if (!emailRegex.test(values.email)) {
        errors.email = t('validationEmailInvalid');
      }

      if (!values.password) {
        errors.password = t('validationPasswordRequired');
      }

      return errors;
    },
    onSubmit: async (values, helpers) => {
      setServerError(null);
      setRemainingAttempts(undefined);
      setIsBlocked(false);

      const result = await signinAction(values);

      // Handle blocked or warning response
      if (result.remainingAttempts !== undefined) {
        setRemainingAttempts(result.remainingAttempts);
        if (result.isBlocked) {
          setIsBlocked(true);
          setServerError(t('accountBlockedFull'));
        } else {
          const invalidCredentialsMessage = t('invalidCredentials');
          const warningMessage =
            result.remainingAttempts > 0 && result.remainingAttempts <= 2
              ? ` ${t('attemptsWarning', { attempts: result.remainingAttempts })}`
              : '';

          setServerError(`${invalidCredentialsMessage}${warningMessage}`);
        }
        helpers.setSubmitting(false);
        return;
      }

      if (!result.ok || !result.redirectTo) {
        setServerError(result.error ?? t('authErrorFallback'));
        helpers.setSubmitting(false);
        return;
      }

      router.push(result.redirectTo);
      router.refresh();
    },
  });

  const signupFormik = useFormik<SignupFormValues>({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    validate: (values) => {
      const errors: Partial<Record<'email' | 'password' | 'firstName' | 'lastName', string>> = {};

      if (!values.email) {
        errors.email = t('validationEmailRequired');
      } else if (!emailRegex.test(values.email)) {
        errors.email = t('validationEmailInvalid');
      }

      if (!values.password) {
        errors.password = t('validationPasswordRequired');
      } else if (!strongPasswordRegex.test(values.password)) {
        errors.password = t('validationPasswordWeak');
      }

      if (values.firstName && values.firstName.length > 50) {
        errors.firstName = t('validationFirstNameMax');
      }

      if (values.lastName && values.lastName.length > 50) {
        errors.lastName = t('validationLastNameMax');
      }

      return errors;
    },
    onSubmit: async (values, helpers) => {
      setServerError(null);

      const payload: SignupRequest = {
        email: values.email,
        password: values.password,
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined,
      };

      const result = await signupAction(payload);

      if (!result.ok || !result.redirectTo) {
        setServerError(result.error ?? t('authErrorFallback'));
        helpers.setSubmitting(false);
        return;
      }

      router.push(result.redirectTo);
      router.refresh();
    },
  });

  const handleModeChange = (mode: 'signin' | 'signup') => {
    resetAuthState();
    setActiveMode(mode);
    router.replace(mode === 'signup' ? '/login?mode=signup' : '/login?mode=signin');
  };

  useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setSignupPasswordState(resolveSignupPasswordState(signupFormik.values.password));
  }, [signupFormik.values.password]);

  return {
    activeMode,
    handleModeChange,
    serverError,
    remainingAttempts,
    isBlocked,
    signinFormik,
    signupFormik,
    signupPasswordState,
  };
}
