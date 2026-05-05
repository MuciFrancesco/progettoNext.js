'use client';

import { useState, useTransition } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import { signoutAction } from '@/lib/actions/auth';
import { createTranslator } from '@/lib/i18n/translator';
import type { Locale } from '@/lib/i18n/translation';

interface LogoutButtonFeatureProps {
  readonly locale: Locale;
  readonly testId?: string;
}

export default function LogoutButtonFeature({
  locale,
  testId = 'signout-button',
}: Readonly<LogoutButtonFeatureProps>) {
  const t = createTranslator(locale);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await signoutAction();
    });
  }

  return (
    <>
      <Button
        data-testid={testId}
        type="button"
        onClick={() => setOpen(true)}
        variant="outlined"
        color="inherit"
        size="small"
      >
        {t('logout')}
      </Button>

      <Dialog open={open} onClose={() => !isPending && setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('logoutConfirmTitle')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('logoutConfirmMessage')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t('logoutConfirmNo')}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirm}
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {t('logoutConfirmYes')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
