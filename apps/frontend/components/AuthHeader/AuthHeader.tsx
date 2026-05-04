'use client';

import Paper from '@mui/material/Paper';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';
import styles from './AuthHeader.module.scss';

type AuthHeaderProps = {
  readonly locale: Locale;
  readonly isSigninMode: boolean;
  readonly onModeChange: (mode: 'signin' | 'signup') => void;
};

export function AuthHeader({ locale, isSigninMode, onModeChange }: AuthHeaderProps) {
  const t = createTranslator(locale);
  return (
    <>
      <Paper variant="outlined" className={styles.paper}>
        <Typography variant="caption" className={styles.caption}>
          {t('authTitle')}
        </Typography>
      </Paper>

      <ToggleButtonGroup
        value={isSigninMode ? 'signin' : 'signup'}
        exclusive
        className={styles.toggleGroup}
      >
        <ToggleButton
          value="signin"
          data-testid="auth-mode-signin-tab"
          className={styles.toggleButton}
          onClick={() => onModeChange('signin')}
        >
          {t('signinTitle')}
        </ToggleButton>
        <ToggleButton
          value="signup"
          data-testid="auth-mode-signup-tab"
          className={styles.toggleButton}
          onClick={() => onModeChange('signup')}
        >
          {t('signupTitle')}
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
