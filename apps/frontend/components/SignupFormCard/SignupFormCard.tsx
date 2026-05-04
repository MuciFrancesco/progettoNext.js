'use client';

import MuiButton from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import styles from './SignupFormCard.module.scss';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import { useFormik } from 'formik';
import type { SignupPasswordState } from '@/features/auth/hooks/useAuthForm';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple } from 'react-icons/fa';

type SignupFormCardExtraProps = {
  readonly backendBaseUrl?: string;
};

type SignupFormValues = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type SignupFormCardProps = {
  readonly locale: Locale;
  readonly formik: ReturnType<typeof useFormik<SignupFormValues>>;
  readonly passwordState: SignupPasswordState;
} & SignupFormCardExtraProps;

export function SignupFormCard({
  locale,
  formik,
  passwordState,
  backendBaseUrl,
}: Readonly<SignupFormCardProps>) {
  const t = createTranslator(locale);
  const resolvedBackendBaseUrl =
    backendBaseUrl ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3333';
  const hasTypedPassword = passwordState !== 'idle';
  const weakPasswordHint = passwordState === 'weak';
  const passwordError = formik.errors.password;
  const showPasswordError =
    weakPasswordHint ||
    ((formik.touched.password || formik.submitCount > 0 || hasTypedPassword) && !!passwordError);

  return (
    <Card variant="outlined">
      <CardHeader title={t('signupTitle')} />
      <CardContent>
        <Box
          component="form"
          data-testid="signup-form"
          onSubmit={formik.handleSubmit}
          noValidate
          className={styles.formStack}
        >
          <TextField
            id="signup-firstname"
            slotProps={{ htmlInput: { 'data-testid': 'signup-firstname-input' } }}
            name="firstName"
            type="text"
            label={t('firstNamePlaceholder')}
            placeholder={t('firstNamePlaceholder')}
            autoFocus
            fullWidth
            value={formik.values.firstName ?? ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(
              (formik.touched.firstName || formik.submitCount > 0) && formik.errors.firstName
            )}
            helperText={
              (formik.touched.firstName || formik.submitCount > 0) && formik.errors.firstName ? (
                <span data-testid="signup-firstname-error">{formik.errors.firstName}</span>
              ) : undefined
            }
          />

          <TextField
            id="signup-lastname"
            slotProps={{ htmlInput: { 'data-testid': 'signup-lastname-input' } }}
            name="lastName"
            type="text"
            label={t('lastNamePlaceholder')}
            placeholder={t('lastNamePlaceholder')}
            fullWidth
            value={formik.values.lastName ?? ''}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean(
              (formik.touched.lastName || formik.submitCount > 0) && formik.errors.lastName
            )}
            helperText={
              (formik.touched.lastName || formik.submitCount > 0) && formik.errors.lastName ? (
                <span data-testid="signup-lastname-error">{formik.errors.lastName}</span>
              ) : undefined
            }
          />

          <TextField
            id="signup-email"
            slotProps={{ htmlInput: { 'data-testid': 'signup-email-input' } }}
            name="email"
            type="email"
            label="Email"
            placeholder={t('emailPlaceholder')}
            fullWidth
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={Boolean((formik.touched.email || formik.submitCount > 0) && formik.errors.email)}
            helperText={
              (formik.touched.email || formik.submitCount > 0) && formik.errors.email ? (
                <span data-testid="signup-email-error">{formik.errors.email}</span>
              ) : undefined
            }
          />

          <TextField
            id="signup-password"
            slotProps={{
              htmlInput: {
                'aria-invalid': showPasswordError,
                'data-testid': 'signup-password-input',
                'data-validation-state': passwordState,
              },
            }}
            name="password"
            type="password"
            label="Password"
            placeholder={t('passwordStrongPlaceholder')}
            fullWidth
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={showPasswordError}
            helperText={
              showPasswordError ? (
                <span
                  data-testid="signup-password-error"
                  data-validation-state={passwordState}
                  role="alert"
                >
                  {passwordError ?? t('validationPasswordWeak')}
                </span>
              ) : undefined
            }
          />

          <MuiButton
            type="submit"
            variant="contained"
            fullWidth
            data-testid="signup-submit-button"
            disabled={formik.isSubmitting}
            disableElevation
          >
            {t('signupSubmit')}
          </MuiButton>

          <div className={styles.dividerSpacer} />

          <Divider>
            <Typography variant="subtitle2" color="text.secondary">
              {t('orLoginWith')}
            </Typography>
          </Divider>

          <div className={styles.socialButtons}>
            <MuiButton
              component="a"
              href={`${resolvedBackendBaseUrl}/auth/google`}
              variant="outlined"
              fullWidth
              data-testid="signup-google-button"
              startIcon={<FcGoogle size={20} aria-hidden="true" />}
            >
              Google
            </MuiButton>
            <MuiButton
              component="a"
              href={`${resolvedBackendBaseUrl}/auth/facebook`}
              variant="outlined"
              fullWidth
              data-testid="signup-facebook-button"
              startIcon={<FaFacebook size={20} color="#1877F2" aria-hidden="true" />}
            >
              Meta
            </MuiButton>
            <MuiButton
              component="a"
              href={`${resolvedBackendBaseUrl}/auth/apple`}
              variant="outlined"
              fullWidth
              data-testid="signup-apple-button"
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
