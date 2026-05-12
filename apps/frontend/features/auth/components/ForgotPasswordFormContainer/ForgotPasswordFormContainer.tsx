'use client';

import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n/translation';
import ForgotPasswordForm from '@/components/ForgotPasswordForm/ForgotPasswordForm';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';
import { Suspense } from 'react';
import { ComponentLoading } from '@/components/ComponentLoading/ComponentLoading';
import { createTranslator } from '@/lib/i18n/translator';

type ForgotPasswordFormContainerProps = {
  readonly locale: Locale;
  readonly initialEmail?: string;
};

export default function ForgotPasswordFormContainer({
  locale,
  initialEmail = '',
}: Readonly<ForgotPasswordFormContainerProps>) {
  const router = useRouter();
  const form = useForgotPassword(locale, initialEmail);
  const t = createTranslator(locale);
  return (
    <Suspense fallback={<ComponentLoading label={t('loadingInProgress')} />}>
      <ForgotPasswordForm
        locale={locale}
        initialEmail={initialEmail}
        email={form.email}
        emailError={form.emailError}
        submitted={form.submitted}
        loading={form.loading}
        onEmailChange={(value) => {
          form.setEmail(value);
          if (form.emailError) {
            form.validateEmail(value);
          }
        }}
        onEmailBlur={() => form.validateEmail(form.email)}
        onSubmit={() => form.handleSubmit()}
        onBack={() => router.push('/login?mode=signin')}
      />
    </Suspense>
  );
}
