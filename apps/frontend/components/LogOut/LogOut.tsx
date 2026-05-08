import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';
import Box from '@mui/material/Box';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import styles from './LogOut.module.scss';

export default async function LogOut() {
  const [t] = await Promise.all([getTranslator(), getCurrentLocale()]);
  return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
      <main className={styles.page}>
        <Typography variant="h1" className={styles.title}>
          {t('sessionExpiredTitle')}
        </Typography>
        <Typography className={styles.subtitle}>{t('sessionExpiredSubtitle')}</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', mt: 2 }}>
          <Link href="/login?mode=signin" className={styles.link}>
            {t('sessionExpiredLoginCta')}
          </Link>

          <Link href="/" className={styles.link}>
            {t('errorGoHome')}
          </Link>
        </Box>
      </main>
    </Box>
  );
}
