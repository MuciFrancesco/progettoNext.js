'use client';

import { useState } from 'react';
import { resetPasswordAction } from '@/lib/actions/auth';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';

export function useResetPassword(locale: Locale, token: string | null) {
  const t = createTranslator(locale);
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!password || !token) return;
    setLoading(true);
    setError(null);
    const result = await resetPasswordAction(token, password);
    setLoading(false);
    if (result.ok) {
      setSuccess(true);
    } else {
      setError(result.error ?? t('resetPasswordInvalidToken'));
    }
  }

  return {
    password,
    success,
    loading,
    error,
    setPassword,
    handleSubmit,
  };
}
