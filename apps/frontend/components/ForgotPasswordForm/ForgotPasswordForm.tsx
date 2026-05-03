'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { forgotPasswordAction } from '@/lib/actions/auth';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import MuiButton from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type ForgotPasswordFormProps = {
  readonly locale: Locale;
  readonly initialEmail?: string;
};

export default function ForgotPasswordForm({ locale, initialEmail = '' }: ForgotPasswordFormProps) {
  const t = createTranslator(locale);
  const router = useRouter();
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

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateEmail(email)) return;
    setLoading(true);
    await forgotPasswordAction(email);
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <Card variant="outlined" sx={{ width: '100%', maxWidth: 448 }}>
      <CardHeader title={t('forgotPasswordTitle')} />
      <CardContent>
        {submitted ? (
          <div className="space-y-4">
            <Typography
              variant="body2"
              color="text.secondary"
              data-testid="forgot-password-success"
            >
              {t('forgotPasswordSuccess')}
            </Typography>
            <MuiButton
              variant="outlined"
              fullWidth
              data-testid="forgot-password-back-button"
              onClick={() => router.push('/login?mode=signin')}
            >
              {t('forgotPasswordBack')}
            </MuiButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Typography variant="body2" color="text.secondary">
              {t('forgotPasswordSubtitle')}
            </Typography>
            <TextField
              id="forgot-email"
              slotProps={{ htmlInput: { 'data-testid': 'forgot-password-email-input' } }}
              type="email"
              label="Email"
              placeholder={t('emailPlaceholder')}
              fullWidth
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
              error={!!emailError}
              helperText={
                emailError ? (
                  <span data-testid="forgot-password-email-error">{emailError}</span>
                ) : undefined
              }
              autoFocus={!initialEmail}
            />
            <MuiButton
              type="submit"
              variant="contained"
              fullWidth
              data-testid="forgot-password-submit"
              disabled={loading}
              disableElevation
            >
              {loading ? '...' : t('forgotPasswordSubmit')}
            </MuiButton>
            <MuiButton
              type="button"
              variant="outlined"
              fullWidth
              data-testid="forgot-password-back-button"
              onClick={() => router.push('/login?mode=signin')}
            >
              {t('forgotPasswordBack')}
            </MuiButton>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
