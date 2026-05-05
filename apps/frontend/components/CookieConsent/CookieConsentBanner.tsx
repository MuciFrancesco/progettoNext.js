'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Collapse from '@mui/material/Collapse';
import Slide from '@mui/material/Slide';
import type { TranslationKey } from '@/lib/i18n/translator';
import styles from './CookieConsentBanner.module.scss';

type TranslateFn = (key: TranslationKey) => string;

interface CookieConsentBannerProps {
  readonly t: TranslateFn;
  readonly showDetails: boolean;
  readonly analytics: boolean;
  readonly marketing: boolean;
  readonly onAcceptAll: () => void;
  readonly onRejectNonEssential: () => void;
  readonly onSavePreferences: () => void;
  readonly onToggleDetails: () => void;
  readonly onAnalyticsChange: (value: boolean) => void;
  readonly onMarketingChange: (value: boolean) => void;
}

export default function CookieConsentBanner({
  t,
  showDetails,
  analytics,
  marketing,
  onAcceptAll,
  onRejectNonEssential,
  onSavePreferences,
  onToggleDetails,
  onAnalyticsChange,
  onMarketingChange,
}: CookieConsentBannerProps) {
  return (
    <Slide direction="up" in mountOnEnter unmountOnExit>
      <Paper
        elevation={8}
        className={styles.banner}
        role="dialog"
        aria-modal="true"
        aria-label={t('cookieConsentTitle')}
      >
        <Typography variant="h6" className={styles.title}>
          {t('cookieConsentTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary" className={styles.description}>
          {t('cookieConsentDesc')}
        </Typography>

        <Collapse in={showDetails}>
          <Divider className={styles.divider} />
          <Box className={styles.toggleGroup}>
            <FormControlLabel
              control={<Switch checked disabled size="small" />}
              label={<Typography variant="body2">{t('cookieConsentEssentialLabel')}</Typography>}
            />
            <Typography variant="caption" color="text.secondary" className={styles.toggleCaption}>
              {t('cookieConsentLegalNote')}
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={analytics}
                  onChange={(e) => onAnalyticsChange(e.target.checked)}
                  size="small"
                />
              }
              label={<Typography variant="body2">{t('cookieConsentAnalyticsLabel')}</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={marketing}
                  onChange={(e) => onMarketingChange(e.target.checked)}
                  size="small"
                />
              }
              label={<Typography variant="body2">{t('cookieConsentMarketingLabel')}</Typography>}
            />
          </Box>
          <Divider className={styles.divider} />
        </Collapse>

        <Box className={styles.actionRow}>
          {showDetails ? (
            <Button
              variant="contained"
              size="small"
              onClick={onSavePreferences}
              className={styles.actionButton}
            >
              {t('cookieConsentSavePreferences')}
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={onToggleDetails}
                className={styles.actionButton}
              >
                {t('cookieConsentCustomize')}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={onRejectNonEssential}
                className={styles.actionButton}
              >
                {t('cookieConsentRejectNonEssential')}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={onAcceptAll}
                className={styles.actionButton}
              >
                {t('cookieConsentAcceptAll')}
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Slide>
  );
}
