'use client';

import Paper from '@mui/material/Paper';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import type { Locale } from '@/lib/i18n/translation';
import { createTranslator } from '@/lib/i18n/translator';

type AuthHeaderProps = {
  readonly locale: Locale;
  readonly isSigninMode: boolean;
  readonly onModeChange: (mode: 'signin' | 'signup') => void;
};

export function AuthHeader({ locale, isSigninMode, onModeChange }: AuthHeaderProps) {
  const t = createTranslator(locale);
  return (
    <>
      <Paper variant="outlined" sx={{ py: 2, textAlign: 'center' }}>
        <Typography
          variant="caption"
          sx={{
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: 500,
            color: 'var(--primary)',
          }}
        >
          {t('authTitle')}
        </Typography>
      </Paper>

      <ToggleButtonGroup
        value={isSigninMode ? 'signin' : 'signup'}
        exclusive
        sx={{
          display: 'flex',
          width: '100%',
          '& .MuiToggleButton-root.Mui-selected': {
            backgroundColor: '#0D47A1',
            color: 'white',
            '&:hover': { backgroundColor: '#1565C0' },
          },
        }}
      >
        <ToggleButton
          value="signin"
          data-testid="auth-mode-signin-tab"
          sx={{ flex: 1 }}
          onClick={() => onModeChange('signin')}
        >
          {t('signinTitle')}
        </ToggleButton>
        <ToggleButton
          value="signup"
          data-testid="auth-mode-signup-tab"
          sx={{ flex: 1 }}
          onClick={() => onModeChange('signup')}
        >
          {t('signupTitle')}
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
