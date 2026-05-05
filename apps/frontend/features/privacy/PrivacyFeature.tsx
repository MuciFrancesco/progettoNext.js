import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { PolicySection } from '@/components/PrivacyPolicy/PolicySection/PolicySection';
import { PolicyHeader } from '@/components/PrivacyPolicy/PolicyHeader/PolicyHeader';
import { PolicyBackLink } from '@/components/PrivacyPolicy/PolicyBackLink/PolicyBackLink';
import { PolicyItemList } from '@/components/PrivacyPolicy/PolicyItemList/PolicyItemList';
import {
  getPrivacyDataItems,
  privacyRightsItemKeys,
  privacySecurityItemKeys,
  privacyUsageItemKeys,
  translatePolicyItems,
} from '@/components/PrivacyPolicy/PolicyItemList/helpers/policyItems';
import { getTranslator, getCurrentLocale } from '@/lib/i18n/locale';
import styles from './PrivacyFeature.module.scss';

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
    <Container maxWidth="md" className={styles.page}>
      <PolicyBackLink label={t('contactBackLink')} />
      <PolicyHeader
        title={t('privacyPageTitle')}
        subtitle={`${t('lastUpdatedLabel')}: ${lastUpdated}`}
      />

      <Box className={styles.sections}>
        <PolicySection title={t('privacyS1Title')}>
          <Typography variant="body1" color="text.secondary">
            {t('privacyS1Body')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS2Title')}>
          <Typography variant="body1" color="text.secondary" className={styles.paragraphSpacing}>
            {t('privacyS2Intro')}
          </Typography>
          <PolicyItemList items={getPrivacyDataItems(t)} />
        </PolicySection>

        <PolicySection title={t('privacyS3Title')}>
          <PolicyItemList items={translatePolicyItems(t, privacyUsageItemKeys)} />
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
          <Typography variant="body1" color="text.secondary" className={styles.paragraphSpacing}>
            {t('privacyS6Intro')}
          </Typography>
          <PolicyItemList items={translatePolicyItems(t, privacyRightsItemKeys)} />
          <Typography variant="body1" color="text.secondary" className={styles.paragraphTopSpacing}>
            {t('privacyS6Closing')}
          </Typography>
        </PolicySection>

        <PolicySection title={t('privacyS7Title')}>
          <Typography variant="body1" color="text.secondary" className={styles.paragraphSpacing}>
            {t('privacyS7Intro')}
          </Typography>
          <PolicyItemList items={translatePolicyItems(t, privacySecurityItemKeys)} />
          <Typography variant="body1" color="text.secondary" className={styles.paragraphTopSpacing}>
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
