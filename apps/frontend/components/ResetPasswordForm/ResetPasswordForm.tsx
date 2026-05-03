'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPasswordAction } from '@/lib/actions/auth';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import Alert from '@mui/material/Alert';
import MuiButton from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

type ResetPasswordFormProps = {
  readonly locale: Locale;
  readonly token: string | null;
};

export default function ResetPasswordForm({ locale, token }: ResetPasswordFormProps) {
  const t = createTranslator(locale);
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <Card variant="outlined" sx={{ width: '100%', maxWidth: 448 }}>
        <CardContent sx={{ pt: 3 }} className="space-y-4">
          <Typography variant="body2" color="error" data-testid="reset-password-invalid-token">
            {t('resetPasswordInvalidToken')}
          </Typography>
          <Link href="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>
            {t('forgotPasswordBack')}
          </Link>
        </CardContent>
      </Card>
    );
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
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

  if (success) {
    return (
      <Card variant="outlined" sx={{ width: '100%', maxWidth: 448 }}>
        <CardContent sx={{ pt: 3 }} className="space-y-4">
          <Typography variant="body2" color="text.secondary" data-testid="reset-password-success">
            {t('resetPasswordSuccess')}
          </Typography>
          <Link href="/login?mode=signin" style={{ fontSize: '0.875rem', color: 'var(--primary)' }}>
            {t('forgotPasswordBack')}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ width: '100%', maxWidth: 448 }}>
      <CardHeader title={t('resetPasswordTitle')} />
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
            onChange={(e) => setPassword(e.target.value)}
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
        </form>
      </CardContent>
    </Card>
  );
}
