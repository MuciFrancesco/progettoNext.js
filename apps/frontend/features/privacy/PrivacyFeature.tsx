import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { PolicySection } from '@/components/PrivacyPolicy/PolicySection/PolicySection';
import { PolicyHeader } from '@/components/PrivacyPolicy/PolicyHeader/PolicyHeader';
import { PolicyBackLink } from '@/components/PrivacyPolicy/PolicyBackLink/PolicyBackLink';
import { PolicyItemList } from '@/components/PrivacyPolicy/PolicyItemList/PolicyItemList';
import { getTranslator, getCurrentLocale } from '@/lib/i18n/locale';
import styles from './PrivacyFeature.module.scss';
import {
  buildPrivacySections,
  formatPrivacyLastUpdated,
  SectionConfig,
} from './helpers/helper';

function renderContent(section: SectionConfig): ReactNode {
  switch (section.kind) {
    case 'text':
      return (
        <Typography variant="body1" color="text.secondary">
          {section.text}
        </Typography>
      );
    case 'list':
      return <PolicyItemList items={section.items} />;
    case 'intro-list':
      return (
        <>
          <Typography variant="body1" color="text.secondary" className={styles.paragraphSpacing}>
            {section.intro}
          </Typography>
          <PolicyItemList items={section.items} />
        </>
      );
    case 'intro-list-closing':
      return (
        <>
          <Typography variant="body1" color="text.secondary" className={styles.paragraphSpacing}>
            {section.intro}
          </Typography>
          <PolicyItemList items={section.items} />
          <Typography variant="body1" color="text.secondary" className={styles.paragraphTopSpacing}>
            {section.closing}
          </Typography>
        </>
      );
  }
}

export async function PrivacyFeature() {
  const [t, locale] = await Promise.all([getTranslator(), getCurrentLocale()]);
  const sections = buildPrivacySections(t);

  return (
    <Container maxWidth="md" className={styles.page}>
      <PolicyBackLink label={t('contactBackLink')} />
      <PolicyHeader
        title={t('privacyPageTitle')}
        subtitle={`${t('lastUpdatedLabel')}: ${formatPrivacyLastUpdated(locale)}`}
      />
      <Box className={styles.sections}>
        {sections.map((section) => (
          <PolicySection key={section.title} title={section.title}>
            {renderContent(section)}
          </PolicySection>
        ))}
      </Box>
    </Container>
  );
}
