import Box from '@mui/material/Box';

import styles from './NotFoundFeature.module.scss';
import { NotFoundIllustration } from '@/components/not-found/NotFoundIllustration/NotFoundIllustration';
import { NotFoundTextBlock } from '@/components/not-found/NotFoundTextBlock/NotFoundTextBlock';

type NotFoundFeatureProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly homeLabel: string;
  readonly backLabel: string;
  readonly fromExpiredSession: boolean;
  readonly expiredCtaLabel: string;
};

export function NotFoundFeature({
  title,
  subtitle,
  homeLabel,
  backLabel,
  fromExpiredSession,
  expiredCtaLabel,
}: Readonly<NotFoundFeatureProps>) {
  return (
    <Box className={styles.section}>
      <Box className={styles.illustrationCol}>
        <NotFoundIllustration />
      </Box>

      <Box className={styles.textCol}>
        <NotFoundTextBlock
          title={title}
          subtitle={subtitle}
          homeLabel={homeLabel}
          backLabel={backLabel}
          fromExpiredSession={fromExpiredSession}
          expiredCtaLabel={expiredCtaLabel}
        />
      </Box>
    </Box>
  );
}
