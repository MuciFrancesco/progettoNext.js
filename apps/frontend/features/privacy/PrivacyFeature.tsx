import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { PolicySection } from '@/components/PrivacyPolicy/PolicySection';
import { PolicyHeader } from '@/components/PrivacyPolicy/PolicyHeader';
import { PolicyBackLink } from '@/components/PrivacyPolicy/PolicyBackLink';
import { PolicyItemList } from '@/components/PrivacyPolicy/PolicyItemList';
import { getTranslator, getCurrentLocale } from '@/lib/i18n/locale';

const LOCALE_BCP47: Record<string, string> = {
  it: 'it-IT',
  en: 'en-GB',
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de-DE',
};

export async function PrivacyFeature() {
  const [t, locale] = await Promise.all([getTranslator(), getCurrentLocale()]);
  const lastUpdated = new Date().toLocaleDateString(LOCALE_BCP47[locale] ?? 'it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <PolicyBackLink label={t('contactBackLink')} />
      <PolicyHeader
        title={t('privacyPageTitle')}
        subtitle={`${t('lastUpdatedLabel')}: ${lastUpdated}`}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <PolicySection title={t('privacyS1Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('privacyS1Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS2Title')}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t('privacyS2Intro')}
          </Typography>
          <PolicyItemList
            items={[
              <>
                <strong>{t('privacyS2Item1Label')}</strong> {t('privacyS2Item1Desc')}
              </>,
              <>
                <strong>{t('privacyS2Item2Label')}</strong> {t('privacyS2Item2Desc')}
              </>,
              <>
                <strong>{t('privacyS2Item3Label')}</strong> {t('privacyS2Item3Desc')}
              </>,
              <>
                <strong>{t('privacyS2Item4Label')}</strong> {t('privacyS2Item4Desc')}
              </>,
            ]}
          />
        </PolicySection>

        <PolicySection title={t('privacyS3Title')}>
          <PolicyItemList
            items={[
              t('privacyS3Item1'),
              t('privacyS3Item2'),
              t('privacyS3Item3'),
              t('privacyS3Item4'),
              t('privacyS3Item5'),
              t('privacyS3Item6'),
            ]}
          />
        </PolicySection>

        <PolicySection title={t('privacyS4Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('privacyS4Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS5Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('privacyS5Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS6Title')}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t('privacyS6Intro')}
          </Typography>
          <PolicyItemList
            items={[
              t('privacyS6Item1'),
              t('privacyS6Item2'),
              t('privacyS6Item3'),
              t('privacyS6Item4'),
            ]}
          />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {t('privacyS6Closing')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS7Title')}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t('privacyS7Intro')}
          </Typography>
          <PolicyItemList
            items={[
              t('privacyS7Item1'),
              t('privacyS7Item2'),
              t('privacyS7Item3'),
              t('privacyS7Item4'),
              t('privacyS7Item5'),
              t('privacyS7Item6'),
              t('privacyS7Item7'),
            ]}
          />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {t('privacyS7Closing')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS8Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('privacyS8Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS9Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('privacyS9Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS10Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('privacyS10Body')}
          </Typography>
        </PolicySection>
      </Box>
    </Container>
  );
}
