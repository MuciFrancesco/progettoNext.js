'use client';

import { useState } from 'react';
import { forgotPasswordAction } from '@/lib/actions/auth';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function useForgotPassword(locale: Locale, initialEmail = '') {
  const t = createTranslator(locale);
  const [email, setEmail] = useState(initialEmail);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function validateEmail(value: string): boolean {
    if (!value.trim()) {
      setEmailError(t('validationEmailRequired'));
      return false;
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      setEmailError(t('validationEmailInvalid'));
      return false;
    }
    setEmailError(null);
    return true;
  }

  async function handleSubmit() {
    if (!validateEmail(email)) return false;
    setLoading(true);
    await forgotPasswordAction(email);
    setLoading(false);
    setSubmitted(true);
    return true;
  }

  return {
    email,
    emailError,
    submitted,
    loading,
    setEmail,
    validateEmail,
    handleSubmit,
  };
}
