'use client';

import type { Locale } from '@/lib/i18n/translation';
import ResetPasswordForm from '@/components/ResetPasswordForm/ResetPasswordForm';
import { useResetPassword } from '@/features/auth/hooks/useResetPassword';

type ResetPasswordFormContainerProps = {
  readonly locale: Locale;
  readonly token: string | null;
};

export default function ResetPasswordFormContainer({
  locale,
  token,
}: Readonly<ResetPasswordFormContainerProps>) {
  const form = useResetPassword(locale, token);

  return (
    <ResetPasswordForm
      locale={locale}
      token={token}
      password={form.password}
      success={form.success}
      loading={form.loading}
      error={form.error}
      onPasswordChange={form.setPassword}
      onSubmit={() => form.handleSubmit()}
    />
  );
}
