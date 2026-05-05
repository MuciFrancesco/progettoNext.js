import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import styles from './AppFooter.module.scss';

export interface AppFooterProps {
  readonly appName?: string;
  readonly copyright: string;
  readonly sectionsSlot?: ReactNode;
  readonly note?: string;
}

export function AppFooter({ appName, copyright, sectionsSlot, note }: Readonly<AppFooterProps>) {
  return (
    <Box
      component="footer"
      aria-label="footer"
      className={styles.footer}
    >
      <Box className={styles.inner}>
        {sectionsSlot}

        <Divider className={styles.divider} />

        <Box className={styles.bottom}>
          {appName && (
            <Typography variant="body2" className={styles.brandName}>
              Think
              <Box component="span" className={styles.accent}>
                Shop
              </Box>
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            {copyright}
          </Typography>
          {note && (
            <Typography variant="caption" color="text.secondary">
              {note}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
