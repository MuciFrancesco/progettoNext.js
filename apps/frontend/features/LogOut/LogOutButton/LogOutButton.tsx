'use client';

import { LogoutConfirmDialog } from '@/components/LogOut/LogoutConfirmDialog';
import { signoutAction } from '@/lib/actions/auth';
import { Locale } from '@/lib/i18n/translation';

import { createTranslator } from '@/lib/i18n/translator';
import { Button } from '@mui/material';
import { useState, useTransition } from 'react';

type LogoutButtonProps = {
  readonly locale: Locale;
  readonly testId?: string;
};

export function LogoutButton({ locale, testId = 'signout-button' }: Readonly<LogoutButtonProps>) {
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

      <LogoutConfirmDialog
        open={open}
        title={t('logoutConfirmTitle')}
        message={t('logoutConfirmMessage')}
        cancelLabel={t('logoutConfirmNo')}
        confirmLabel={t('logoutConfirmYes')}
        isPending={isPending}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
