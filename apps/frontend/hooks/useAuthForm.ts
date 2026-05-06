// ─── useAuthForm Hook ────────────────────────────────────────────────────────
// SRP: Auth form business logic — validation, submission, mode switching
// DIP: Uses server actions, not direct API calls
// Security: Password strength check, email validation, rate-limit awareness

'use client';

import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signinAction, signupAction } from '@/lib/actions/auth';
import type { SigninRequest, SignupRequest } from '@/types/api/auth';
import { isValidEmail, checkPasswordStrength, type PasswordStrength } from '@/utils/security';
import { NAME_MAX_LENGTH } from '@/utils/constants';

// ─── Types ──────────────────────────────────────────────────────────────────

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

export type UseAuthFormReturn = {
  readonly activeMode: 'signin' | 'signup';
  readonly serverError: string | null;
  readonly remainingAttempts: number | undefined;
  readonly isBlocked: boolean;
  readonly passwordStrength: PasswordStrength;
  readonly signinFormik: ReturnType<typeof useFormik<SigninFormValues>>;
  readonly signupFormik: ReturnType<typeof useFormik<SignupFormValues>>;
  readonly switchToMode: (mode: 'signin' | 'signup') => void;
};

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAuthForm(
  translate: (key: string, params?: Record<string, string | number>) => string,
  initialMode: 'signin' | 'signup' = 'signin'
): UseAuthFormReturn {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<'signin' | 'signup'>(initialMode);
  const [serverError, setServerError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | undefined>(undefined);
  const [isBlocked, setIsBlocked] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('empty');

  // ─── Shared helpers ─────────────────────────────────────────────────────

  const resetAuthState = () => {
    setServerError(null);
    setRemainingAttempts(undefined);
    setIsBlocked(false);
  };

  // ─── Signin Formik ──────────────────────────────────────────────────────

  const signinFormik = useFormik<SigninFormValues>({
    initialValues: { email: '', password: '' },
    validate: (values) => {
      const errors: Partial<Record<keyof SigninRequest, string>> = {};
      if (!values.email) {
        errors.email = translate('validationEmailRequired');
      } else if (!isValidEmail(values.email)) {
        errors.email = translate('validationEmailInvalid');
      }
      if (!values.password) {
        errors.password = translate('validationPasswordRequired');
      }
      return errors;
    },
    onSubmit: async (values, helpers) => {
      resetAuthState();

      const result = await signinAction(values);

      // Handle remaining attempts / blocked
      if (result.remainingAttempts !== undefined) {
        setRemainingAttempts(result.remainingAttempts);
        if (result.isBlocked) {
          setIsBlocked(true);
          setServerError(translate('accountBlockedFull'));
        } else {
          const warning =
            result.remainingAttempts > 0 && result.remainingAttempts <= 2
              ? ` ${translate('attemptsWarning', { attempts: result.remainingAttempts })}`
              : '';
          setServerError(`${translate('invalidCredentials')}${warning}`);
        }
        helpers.setSubmitting(false);
        return;
      }

      if (!result.ok || !result.redirectTo) {
        setServerError(result.error ?? translate('authErrorFallback'));
        helpers.setSubmitting(false);
        return;
      }

      router.push(result.redirectTo);
      router.refresh();
    },
  });

  // ─── Signup Formik ──────────────────────────────────────────────────────

  const signupFormik = useFormik<SignupFormValues>({
    initialValues: { email: '', password: '', firstName: '', lastName: '' },
    validate: (values) => {
      const errors: Partial<Record<'email' | 'password' | 'firstName' | 'lastName', string>> = {};

      if (!values.email) {
        errors.email = translate('validationEmailRequired');
      } else if (!isValidEmail(values.email)) {
        errors.email = translate('validationEmailInvalid');
      }

      if (!values.password) {
        errors.password = translate('validationPasswordRequired');
      } else if (checkPasswordStrength(values.password) === 'weak') {
        errors.password = translate('validationPasswordWeak');
      }

      if (values.firstName && values.firstName.length > NAME_MAX_LENGTH) {
        errors.firstName = translate('validationFirstNameMax');
      }
      if (values.lastName && values.lastName.length > NAME_MAX_LENGTH) {
        errors.lastName = translate('validationLastNameMax');
      }

      return errors;
    },
    onSubmit: async (values, helpers) => {
      resetAuthState();

      const payload: SignupRequest = {
        email: values.email,
        password: values.password,
        firstName: values.firstName || undefined,
        lastName: values.lastName || undefined,
      };

      const result = await signupAction(payload);

      if (!result.ok || !result.redirectTo) {
        setServerError(result.error ?? translate('authErrorFallback'));
        helpers.setSubmitting(false);
        return;
      }

      router.push(result.redirectTo);
      router.refresh();
    },
  });

  // ─── Password strength tracking ─────────────────────────────────────────

  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(signupFormik.values.password));
  }, [signupFormik.values.password]);

  // ─── Mode switching ─────────────────────────────────────────────────────

  const switchToMode = (mode: 'signin' | 'signup') => {
    resetAuthState();
    setActiveMode(mode);
    router.replace(mode === 'signup' ? '/login?mode=signup' : '/login?mode=signin');
  };

  useEffect(() => {
    setActiveMode(initialMode);
  }, [initialMode]);

  return {
    activeMode,
    serverError,
    remainingAttempts,
    isBlocked,
    passwordStrength,
    signinFormik,
    signupFormik,
    switchToMode,
  };
}
