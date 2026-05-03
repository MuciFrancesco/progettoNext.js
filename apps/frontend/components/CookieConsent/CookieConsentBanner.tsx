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
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1400,
          borderRadius: '12px 12px 0 0',
          p: { xs: 2, sm: 3 },
          maxWidth: 900,
          mx: 'auto',
          width: '100%',
        }}
        role="dialog"
        aria-modal="true"
        aria-label={t('cookieConsentTitle')}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {t('cookieConsentTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t('cookieConsentDesc')}
        </Typography>

        <Collapse in={showDetails}>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            <FormControlLabel
              control={<Switch checked disabled size="small" />}
              label={<Typography variant="body2">{t('cookieConsentEssentialLabel')}</Typography>}
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mt: -1 }}>
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
          <Divider sx={{ mb: 2 }} />
        </Collapse>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: { xs: 'stretch', sm: 'flex-end' },
          }}
        >
          {showDetails ? (
            <Button
              variant="contained"
              size="small"
              onClick={onSavePreferences}
              sx={{ flexGrow: { xs: 1, sm: 0 } }}
            >
              {t('cookieConsentSavePreferences')}
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                size="small"
                onClick={onToggleDetails}
                sx={{ flexGrow: { xs: 1, sm: 0 } }}
              >
                {t('cookieConsentCustomize')}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={onRejectNonEssential}
                sx={{ flexGrow: { xs: 1, sm: 0 } }}
              >
                {t('cookieConsentRejectNonEssential')}
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={onAcceptAll}
                sx={{ flexGrow: { xs: 1, sm: 0 } }}
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
