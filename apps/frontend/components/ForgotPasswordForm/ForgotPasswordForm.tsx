'use client';

import type { FormEvent } from 'react';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import Box from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import styles from './ForgotPasswordForm.module.scss';

type ForgotPasswordFormProps = {
  readonly locale: Locale;
  readonly initialEmail?: string;
  readonly email: string;
  readonly emailError: string | null;
  readonly submitted: boolean;
  readonly loading: boolean;
  readonly onEmailChange: (value: string) => void;
  readonly onEmailBlur: () => void;
  readonly onSubmit: () => Promise<boolean>;
  readonly onBack: () => void;
};

export default function ForgotPasswordForm({
  locale,
  initialEmail = '',
  email,
  emailError,
  submitted,
  loading,
  onEmailChange,
  onEmailBlur,
  onSubmit,
  onBack,
}: Readonly<ForgotPasswordFormProps>) {
  const t = createTranslator(locale);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit();
  }

  return (
    <Card variant="outlined" className={styles.card}>
      <CardHeader title={t('forgotPasswordTitle')} />
      <CardContent>
        {submitted ? (
          <Box className={styles.stack}>
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
              onClick={onBack}
            >
              {t('forgotPasswordBack')}
            </MuiButton>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} className={styles.stack} noValidate>
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
              onChange={(event) => onEmailChange(event.target.value)}
              onBlur={onEmailBlur}
              error={!!emailError}
              helperText={
                emailError ? (
                  <Typography
                    component="span"
                    variant="caption"
                    color="error"
                    data-testid="forgot-password-email-error"
                  >
                    {emailError}
                  </Typography>
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
              onClick={onBack}
            >
              {t('forgotPasswordBack')}
            </MuiButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
