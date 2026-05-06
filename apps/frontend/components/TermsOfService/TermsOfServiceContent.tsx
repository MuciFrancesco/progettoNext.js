import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { PolicySection } from '@/components/PrivacyPolicy/PolicySection/PolicySection';
import { PolicyHeader } from '@/components/PrivacyPolicy/PolicyHeader/PolicyHeader';
import { PolicyBackLink } from '@/components/PrivacyPolicy/PolicyBackLink/PolicyBackLink';
import { PolicyItemList } from '@/components/PrivacyPolicy/PolicyItemList/PolicyItemList';
import { getTranslator, getCurrentLocale } from '@/lib/i18n/locale';
import {
  termsSections,
  translatePolicyItems,
} from '@/components/PrivacyPolicy/PolicyItemList/helpers/policyItems';
import type { TermsSectionConfig } from '@/components/PrivacyPolicy/PolicyItemList/helpers/policyItems';
import type { TranslationKey } from '@/lib/i18n/translator';
import styles from './TermsOfServiceContent.module.scss';
type Translator = (key: TranslationKey, params?: Record<string, string | number>) => string;

const LOCALE_BCP47: Record<string, string> = {
  it: 'it-IT',
  en: 'en-GB',
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de-DE',
};

// ---------------------------------------------------------------------------
// Sub-component rendered once per section – keeps the main render flat
// ---------------------------------------------------------------------------
function TermsSection({ section, t }: { section: TermsSectionConfig; t: Translator }) {
  const { titleKey, bodyKey, list } = section;
  const title = t(titleKey);

  if (!list) {
    return (
      <PolicySection title={title}>
        <Typography variant="body1" color="text.secondary">
          {t(bodyKey!)}
        </Typography>
      </PolicySection>
    );
  }

  return (
    <PolicySection title={title}>
      {bodyKey && (
        <Typography variant="body1" color="text.secondary" className={styles.paragraphSpacing}>
          {t(bodyKey)}
        </Typography>
      )}
      <PolicyItemList items={translatePolicyItems(t, list.keys)} ordered={list.ordered} />
    </PolicySection>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------
export async function TermsOfServiceContent() {
  const [t, locale] = await Promise.all([getTranslator(), getCurrentLocale()]);
  const bcp47 = LOCALE_BCP47[locale] ?? 'it-IT';
  const lastUpdated = new Date().toLocaleDateString(bcp47, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <Container maxWidth="md" className={styles.page}>
      <PolicyBackLink label={t('contactBackLink')} />
      <PolicyHeader
        title={t('termsPageTitle')}
        subtitle={`${t('lastUpdatedLabel')}: ${lastUpdated}`}
      />
      <Box className={styles.sections}>
        {termsSections.map((section) => (
          <TermsSection key={section.titleKey} section={section} t={t} />
        ))}
      </Box>
    </Container>
  );
}
