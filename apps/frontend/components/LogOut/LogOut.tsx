import { getTranslator } from '@/lib/i18n/locale';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import Typography from '@mui/material/Typography';
import { Home, LogIn, ShieldCheck } from 'lucide-react';
import type { ReactNode } from 'react';
import styles from './LogOut.module.scss';

type LogOutProps = {
  readonly children?: ReactNode;
};

export default async function LogOut({ children }: Readonly<LogOutProps>) {
  const t = await getTranslator();
  return (
    <article className={styles.panel}>
      <div className={styles.icon} aria-hidden="true">
        <ShieldCheck size={28} strokeWidth={1.8} />
      </div>

      <div className={styles.copy}>
        <Typography variant="h1" className={styles.title}>
          {t('sessionExpiredTitle')}
        </Typography>
        <Typography className={styles.subtitle}>{t('sessionExpiredSubtitle')}</Typography>
      </div>

      <div className={styles.actions}>
        <NextLink href="/login?mode=signin" className={styles.actionLink}>
          <Button variant="contained" startIcon={<LogIn size={18} />} disableElevation>
            {t('sessionExpiredLoginCta')}
          </Button>
        </NextLink>

        <NextLink href="/" className={styles.actionLink}>
          <Button variant="outlined" color="inherit" startIcon={<Home size={18} />}>
            {t('errorGoHome')}
          </Button>
        </NextLink>
      </div>

      {children ? <div className={styles.secondaryAction}>{children}</div> : null}
    </article>
  );
}
