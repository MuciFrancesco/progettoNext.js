'use client';

import Alert from '@mui/material/Alert';
import MuiButton from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { useFormik } from 'formik';
import type { MouseEvent } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';

type SigninFormValues = {
  email: string;
  password: string;
};

type SigninFormCardProps = {
  readonly locale: Locale;
  readonly formik: ReturnType<typeof useFormik<SigninFormValues>>;
  readonly remainingAttempts?: number;
  readonly isBlocked?: boolean;
};

export function SigninFormCard({
  locale,
  formik,
  remainingAttempts,
  isBlocked,
}: Readonly<SigninFormCardProps>) {
  const t = createTranslator(locale);
  const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3333';
  const showWarning =
    remainingAttempts !== undefined && remainingAttempts > 0 && remainingAttempts <= 2;
  const forgotPasswordHref = formik.values.email
    ? '/forgot-password?email=' + encodeURIComponent(formik.values.email)
    : '/forgot-password';

  return (
    <Card variant="outlined">
      <CardHeader title={t('signinTitle')} />
      <CardContent>
        <Box
          component="form"
          data-testid="signin-form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {isBlocked && (
            <Alert severity="error" data-testid="signin-blocked-alert" role="alert">
              {t('accountBlockedWarning')}
            </Alert>
          )}

          {showWarning && !isBlocked && (
            <Alert severity="warning" data-testid="signin-warning-alert" role="alert">
              {t('attemptsWarning', { attempts: remainingAttempts })}
            </Alert>
          )}

          <TextField
            id="signin-email"
            slotProps={{ htmlInput: { 'data-testid': 'signin-email-input' } }}
            name="email"
            type="email"
            label="Email"
            placeholder={t('emailPlaceholder')}
            autoFocus
            fullWidth
            disabled={isBlocked}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.email && formik.errors.email)}
            helperText={
              formik.touched.email && formik.errors.email ? (
                <span data-testid="signin-email-error">{formik.errors.email}</span>
              ) : undefined
            }
          />

          <TextField
            id="signin-password"
            slotProps={{ htmlInput: { 'data-testid': 'signin-password-input' } }}
            name="password"
            type="password"
            label="Password"
            placeholder={t('passwordPlaceholder')}
            fullWidth
            disabled={isBlocked}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(formik.touched.password && formik.errors.password)}
            helperText={
              formik.touched.password && formik.errors.password ? (
                <span data-testid="signin-password-error">{formik.errors.password}</span>
              ) : undefined
            }
          />

          <div style={{ textAlign: 'right' }}>
            <a
              href={forgotPasswordHref}
              data-testid="signin-forgot-password-link"
              style={{ fontSize: '0.875rem', color: 'var(--primary)' }}
            >
              {t('forgotPasswordLink')}
            </a>
          </div>

          <MuiButton
            type="submit"
            variant="contained"
            fullWidth
            data-testid="signin-submit-button"
            disabled={formik.isSubmitting || isBlocked}
            disableElevation
          >
            {t('signinSubmit')}
          </MuiButton>

          <div style={{ margin: '8px 0', height: '1px', background: 'var(--border)' }} />

          <Divider>
            <Typography variant="subtitle2" color="text.secondary">
              {t('orLoginWith')}
            </Typography>
          </Divider>

          <div style={{ display: 'grid', gap: '8px' }}>
            <MuiButton
              component="a"
              href={`${backendBaseUrl}/auth/google`}
              variant="outlined"
              fullWidth
              data-testid="signin-google-button"
              aria-disabled={isBlocked}
              onClick={isBlocked ? (e: MouseEvent) => e.preventDefault() : undefined}
              startIcon={<FcGoogle size={20} aria-hidden="true" />}
            >
              Google
            </MuiButton>
            <MuiButton
              component="a"
              href={`${backendBaseUrl}/auth/facebook`}
              variant="outlined"
              fullWidth
              data-testid="signin-facebook-button"
              aria-disabled={isBlocked}
              onClick={isBlocked ? (e: MouseEvent) => e.preventDefault() : undefined}
              startIcon={<FaFacebook size={20} color="#1877F2" aria-hidden="true" />}
            >
              Meta
            </MuiButton>
            <MuiButton
              component="a"
              href={`${backendBaseUrl}/auth/apple`}
              variant="outlined"
              fullWidth
              data-testid="signin-apple-button"
              aria-disabled={isBlocked}
              onClick={isBlocked ? (e: MouseEvent) => e.preventDefault() : undefined}
              startIcon={<FaApple size={20} aria-hidden="true" />}
            >
              Apple
            </MuiButton>
          </div>
        </Box>
      </CardContent>
    </Card>
  );
}
