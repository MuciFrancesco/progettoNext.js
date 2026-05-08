'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';
import styles from './NotFoundTextBlock.module.scss';

type NotFoundTextBlockProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly homeLabel: string;
  readonly backLabel: string;
  readonly fromExpiredSession: boolean;
  readonly expiredCtaLabel: string;
};

export function NotFoundTextBlock({
  title,
  subtitle,
  homeLabel,
  backLabel,
  fromExpiredSession,
  expiredCtaLabel,
}: Readonly<NotFoundTextBlockProps>) {
  return (
    <Box className={styles.container}>
      <Typography variant="h2" className={styles.title} data-testid="not-found-title">
        {title}
      </Typography>

      <Typography
        variant="body1"
        className={styles.description}
        data-testid="not-found-description"
      >
        {subtitle}
      </Typography>

      <Box className={styles.actions}>
        {fromExpiredSession ? (
          <Button
            component={Link}
            href="/login?mode=signin"
            variant="contained"
            size="large"
            data-testid="not-found-login-cta"
          >
            {expiredCtaLabel}
          </Button>
        ) : (
          <>
            <Button
              component={Link}
              href="/"
              variant="contained"
              size="large"
              data-testid="not-found-home-link"
            >
              {homeLabel}
            </Button>

            <Button
              component={Link}
              href="/login?mode=signin"
              variant="outlined"
              size="large"
              data-testid="not-found-back-link"
            >
              {backLabel}
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
