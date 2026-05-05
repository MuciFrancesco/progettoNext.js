'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { Locale } from '@/lib/i18n/translation';
import { APP_NAME } from '@/lib/constants';
import { translate } from '@/lib/i18n/translator';
import styles from './AppErrorState.module.scss';

type AppErrorStateProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
  locale: Locale;
}>;

export default function AppErrorState({ error, reset, locale }: AppErrorStateProps) {

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(error);
    }
  }, [error]);

  return (
    <main className={styles.page}>
      <Typography variant="overline" color="text.secondary">
        {APP_NAME}
      </Typography>
      <Typography variant="h3" component="h1" className={styles.title}>
        {translate(locale, 'errorTitle')}
      </Typography>
      <Typography variant="body1" color="text.secondary" className={styles.subtitle}>
        {translate(locale, 'errorSubtitle')}
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <Button variant="contained" onClick={() => reset()}>
          {translate(locale, 'errorRetry')}
        </Button>
        <Button component={Link} href="/" variant="outlined">
          {translate(locale, 'errorGoHome')}
        </Button>
      </Stack>
    </main>
  );
}
