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

export async function TermsFeature() {
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
        title={t('termsPageTitle')}
        subtitle={`${t('lastUpdatedLabel')}: ${lastUpdated}`}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <PolicySection title={t('termsS1Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS1Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('termsS2Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS2Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('termsS3Title')}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t('termsS3Body')}
          </Typography>
          <PolicyItemList items={[t('termsS3Item1'), t('termsS3Item2'), t('termsS3Item3')]} />
        </PolicySection>

        <PolicySection title={t('termsS4Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS4Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('termsS5Title')}>
          <PolicyItemList
            ordered
            items={[t('termsS5Item1'), t('termsS5Item2'), t('termsS5Item3'), t('termsS5Item4')]}
          />
        </PolicySection>

        <PolicySection title={t('termsS6Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS6Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('termsS7Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS7Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('termsS8Title')}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {t('termsS8Body')}
          </Typography>
          <PolicyItemList items={[t('termsS8Item1'), t('termsS8Item2'), t('termsS8Item3')]} />
        </PolicySection>

        <PolicySection title={t('termsS9Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS9Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('termsS10Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS10Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('termsS11Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS11Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('termsS12Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('termsS12Body')}
          </Typography>
        </PolicySection>
      </Box>
    </Container>
  );
}
