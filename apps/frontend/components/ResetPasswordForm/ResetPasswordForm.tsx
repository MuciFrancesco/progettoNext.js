'use client';

import type { SyntheticEvent } from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MuiButton from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import styles from './ResetPasswordForm.module.scss';

type ResetPasswordFormProps = {
  readonly locale: Locale;
  readonly token: string | null;
  readonly password: string;
  readonly success: boolean;
  readonly loading: boolean;
  readonly error: string | null;
  readonly onPasswordChange: (value: string) => void;
  readonly onSubmit: () => Promise<void>;
};

export default function ResetPasswordForm({
  locale,
  token,
  password,
  success,
  loading,
  error,
  onPasswordChange,
  onSubmit,
}: Readonly<ResetPasswordFormProps>) {
  const t = createTranslator(locale);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit();
  }

  if (!token) {
    return (
      <Card variant="outlined" className={styles.card}>
        <CardContent className={styles.paddedCardContent}>
          <Typography variant="body2" color="error" data-testid="reset-password-invalid-token">
            {t('resetPasswordInvalidToken')}
          </Typography>
          <Link href="/forgot-password" className={styles.link}>
            {t('forgotPasswordBack')}
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (success) {
    return (
      <Card variant="outlined" className={styles.card}>
        <CardContent className={styles.paddedCardContent}>
          <Typography variant="body2" color="text.secondary" data-testid="reset-password-success">
            {t('resetPasswordSuccess')}
          </Typography>
          <Link href="/login?mode=signin" className={styles.link}>
            {t('forgotPasswordBack')}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" className={styles.card}>
      <CardHeader title={t('resetPasswordTitle')} />
      <CardContent>
        <Box component="form" onSubmit={handleSubmit} className={styles.cardContent} noValidate>
          <Typography variant="body2" color="text.secondary">
            {t('resetPasswordSubtitle')}
          </Typography>
          {error && (
            <Alert severity="error" data-testid="reset-password-error">
              {error}
            </Alert>
          )}
          <TextField
            id="reset-password"
            slotProps={{ htmlInput: { 'data-testid': 'reset-password-input' } }}
            type="password"
            label={t('passwordPlaceholder')}
            placeholder={t('resetPasswordPasswordHint')}
            fullWidth
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            required
            autoFocus
          />
          <MuiButton
            type="submit"
            variant="contained"
            fullWidth
            data-testid="reset-password-submit"
            disabled={loading}
            disableElevation
          >
            {loading ? '...' : t('resetPasswordSubmit')}
          </MuiButton>
        </Box>
      </CardContent>
    </Card>
  );
}
