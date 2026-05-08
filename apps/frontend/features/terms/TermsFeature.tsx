import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { PolicySection } from '@/components/PrivacyPolicy/PolicySection/PolicySection';
import { PolicyHeader } from '@/components/PrivacyPolicy/PolicyHeader/PolicyHeader';
import { PolicyBackLink } from '@/components/PrivacyPolicy/PolicyBackLink/PolicyBackLink';
import { PolicyItemList } from '@/components/PrivacyPolicy/PolicyItemList/PolicyItemList';
import styles from './TermsFeature.module.scss';
import { lastUpdated, SectionConfig, sections } from './helpers/helper';
import { getCurrentLocale, getTranslator } from '@/lib/i18n/locale';

function renderContent(section: SectionConfig): ReactNode {
  switch (section.kind) {
    case 'text':
      return (
        <Typography variant="body1" color="text.secondary">
          {section.text}
        </Typography>
      );
    case 'ordered-list':
      return <PolicyItemList ordered items={section.items} />;
    case 'text+list':
      return (
        <>
          <Typography variant="body1" color="text.secondary" className={styles.paragraphSpacing}>
            {section.text}
          </Typography>
          <PolicyItemList items={section.items} />
        </>
      );
  }
}

export async function TermsFeature() {
  const [t] = await Promise.all([getTranslator(), getCurrentLocale()]);

  return (
    <Container maxWidth="md" className={styles.page}>
      <PolicyBackLink label={t('contactBackLink')} />
      <PolicyHeader
        title={t('termsPageTitle')}
        subtitle={`${t('lastUpdatedLabel')}: ${lastUpdated}`}
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
